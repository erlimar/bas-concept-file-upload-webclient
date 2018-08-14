# bas-concept-file-upload-webclient
Prova de conceito para API de upload de arquivos para BAS (WebClient)

## Adicionando a biblioteca em sua aplicação

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <!-- ... -->
</head>
<body>
    <div>
        <!-- ... -->
    </div>

    <script src="https://unpkg.com/bas-concept-file-upload-webclient/dist/bas-concept-file-upload-web-client.js"></script>
</body>

</html>
```

## Enviando arquivos

```js
var webClient = new BasConceptFileUploadWebClient();

var files = /* ... */
var params = /* ... */

webClient.sendFile(files, params)
    .then(function (result) {
        console.log('Success:', result);
    })
    .catch(function (result) {
        console.log('Error:', result);
    });
```

## Servidor

A parte do lado do servidor dessa prova de conceito pode ser encontrada em https://github.com/erlimar/bas-concept-file-upload-api

