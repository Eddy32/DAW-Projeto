function showFicheiro(f){
    console.log("FUI INVOCADO");
    if(f.ficheiroMimeType == 'image/png'){
        var ficheiro = $('<img src="/ficheiros/291895598016211.png' +  '" width="80%"/>')
        console.log("O:  YEAH " + f.ficheiroMimeType + " - " + f.ficheiroName )
    }else
        var ficheiro = $('<p>' + JSON.stringify(f) + '</p>')
    var download = $('<div><a href="/download/' + f.ficheiroName + '">Download</a></div>')
    $("#display").empty()
    $('#display').append(ficheiro, download)
    $('#display').modal()
}

