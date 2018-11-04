function createJam(userUri) {
    var website = "http://localhost:8080/create";
  //  var website = "http://localhost:8080/create";
    $.ajaxSetup({
        headers: {
            useruri:userUri,
            'dataType': "text",
            'Access-Control-Allow-Credentials':true,
            'Access-Control-Allow-Origin':true,
            'content-type': 'text/html',
            'Accept': 'text/html',
        },
        error: function(jqxhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });

    $.get(website, function(data) {
            var newDoc = document.open("text/html", "replace");
            newDoc.write(data);
            newDoc.close();
    }, 'text');
}

function joinJam(userUri) {
    var website = $('#jamNameInput').val();
    console.log(website);
    $.ajaxSetup({
        headers: {
            useruri:userUri,
            'dataType': "text",
            'Access-Control-Allow-Credentials':true,
            'Access-Control-Allow-Origin':true,
            'content-type': 'text/html',
            'Accept': 'text/html',
        },
        error: function(jqxhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });

    $.get(website, function(data) {
            var newDoc = document.open("text/html", "replace");
            newDoc.write(data);
            newDoc.close();
    }, 'text');
}
