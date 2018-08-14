(function (global, $) {

    var fileUploadWebClient = new BasConceptFileUploadWebClient();

    var selectEl = $("#select"),
        filesEl = $("#files"),
        fileListEl = $("#fileList");

    filesEl.on("change", handleFiles);

    selectEl.on("click", function (e) {
        if (filesEl) {
            filesEl.click();
        }

        e.preventDefault();
    });

    function handleFiles() {
        for (var i = 0, numFiles = this.files.length; i < numFiles; i++) {
            var file = this.files[i];
            var listItem = $('<li>')
                .addClass('list-group-item')
                .attr('data-file-name', file.name)
                .text(file.name + ' (enviando...)');

            fileListEl.append(listItem);
        }

        fileUploadWebClient.sendFile(this.files, null)
            .then(function (result) {
                $.each(result.httpResult.data, function (_, obj) {
                    var $el = $('li[data-file-name="' + obj.fileName + '"]', fileListEl)

                    $el.removeAttr('data-file-name')
                        .text('')
                        .addClass('list-group-item-success');

                    var urlDownload = fileUploadWebClient
                        .options
                        .urlDownload
                        .replace('{id}', obj.fileId);

                    var downloadLink = $('<a>')
                        .attr({
                            'href': urlDownload,
                            'target': '_blank',
                            'title': 'Baixar arquivo "' + obj.fileName + '" [' + obj.fileId + ']'
                        })
                        .text(obj.fileName)
                        .css({
                            'color': 'green'
                        });

                    $el.append(downloadLink);
                });
            })
            .catch(function (result) {
                $('li[data-file-name]', fileListEl).each(function (_, el) {
                    var $el = $(el);

                    $el.text($el.data('file-name'))
                        .addClass('list-group-item-danger');

                    var closeLink = $('<a>')
                        .attr("href", "#")
                        .addClass(['badge', 'badge-danger'])
                        .text('Erro! [remover]')
                        .css({
                            'margin-left': '15px',
                        })
                        .on("click", function () {
                            $(this).closest("li").remove();
                        });

                    $el.append(closeLink);
                })
            });
    }
})(window, jQuery);