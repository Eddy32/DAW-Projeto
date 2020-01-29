function showFicheiro(f){
    console.log("FUI INVOCADO");
    if(f.ficheiroMimeType == 'image/png'){
        var ficheiro = $('<img src="/ficheiros/' + f.ficheiroName + '" width="80%"/>')
    }
    else{ if(f.ficheiroMimeType == 'image/jpg')
            var ficheiro = $('<img src="/ficheiros/' + f.ficheiroName + '" width="80%"/>')
          else
            var ficheiro = $('<p>' + JSON.stringify(f) + '</p>')
    }
        
    var download = $('<div><a href="/download/' + f.ficheiroName + '">Download</a></div>')
    $("#display").empty()
    $('#display').append(ficheiro, download)
    $('#display').modal()
}

