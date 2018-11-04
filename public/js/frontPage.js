
function createJam(userUri){
    var website = "https://jukebox-node-8080.herokuapp.com/create";
    $.ajax({url: website, 
        beforeSend: function(xhr){xhr.setRequestHeader("useruri", userUri);}
    });
}

