function createJam(userUri) {
//    var website = "https://jukebox-node-8080.herokuapp.com/create";
    var website = "http://localhost:8080/create";
    $.ajax({
        url: website, 
        type: "post", 
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
            useruri:userUri,
            'Access-Control-Allow-Credentials':true,
            'Access-Control-Allow-Origin':true, 
            'content-type': 'application/json',
            'Accept': 'application/json',
        }
    });
}

