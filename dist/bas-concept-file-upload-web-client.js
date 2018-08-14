(function (global) {

    /* https://developer.mozilla.org/pt-BR/docs/Web/API/File/Using_files_from_web_applications */

    function FileUpload(options, fileObj) {

        if (!(fileObj instanceof File) && !(fileObj instanceof FileList)) {
            throw 'FileUpload(options, --> "fileObj" precisa ser uma instância de [File] ou [FileList]';
        }

        var self = this;
        var xhr = new XMLHttpRequest();
        var fd = new FormData();

        xhr.open("POST", options.urlUpload, true);
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');

        function _onLoad() {
            if (xhr.status >= 200 && xhr.status <= 299) {
                if (typeof self._cbSuccess !== 'function') {
                    return;
                }

                var data = xhr.responseText;

                if ((xhr.getResponseHeader('Content-Type') || '').indexOf('application/json') >= 0) {
                    data = JSON.parse(xhr.responseText);
                }

                self._cbSuccess({
                    statusCode: xhr.status,
                    statusText: xhr.statusText,
                    data: data
                });

                return;
            }

            _onError();
        }

        function _onError() {
            if (typeof self._cbError !== 'function') {
                return;
            }

            var data = xhr.responseText;

            self._cbError({
                statusCode: xhr.status,
                statusText: xhr.statusText,
                data: data
            });
        }

        xhr.onload = _onLoad;
        xhr.onerror = _onError;

        //File, FileList
        var fileObjList = fileObj;

        if (!(fileObj instanceof FileList)) {
            fileObjList = [fileObj];
        }

        for (var i = 0; i < fileObjList.length; i++) {
            fd.append('files[]', fileObjList[i]);
        }

        self.send = function (cbSuccess, cbError) {
            self._cbSuccess = cbSuccess;
            self._cbError = cbError;

            xhr.send(fd);
        }
    }

    function BasConceptFileUploadWebClient(config) {
        var self = this;

        self.options = config || {};

        self.options.url = self.options.url || 'http://bas-concept-file-upload-api.herokuapp.com';

        // TODO: "/" end's

        self.options.urlUpload = self.options.url + '/upload';
        self.options.urlDownload = self.options.url + '/download/{id}';
        self.options.urlInfo = self.options.url + '/file/{id}';
        self.options.urlInfoAllFiles = self.options.url + '/files';

        self.sendFile = function (fileObj, params) {
            return new Promise(function (resolve, reject) {
                var uploader = new FileUpload(self.options, fileObj);

                uploader.send(function (httpResult) {
                    resolve({ params, httpResult });
                }, function (httpResult) {
                    reject({ params, httpResult })
                });
            })
        }
    }

    global.BasConceptFileUploadWebClient = global.BasConceptFileUploadWebClient || BasConceptFileUploadWebClient;

})(window);