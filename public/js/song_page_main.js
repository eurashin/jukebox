function songDetails(picture, song, artist, user){ 

    document.getElementById("picture").setAttribute("src", picture);
    document.getElementById("songAlbum").innerHTML += song;
    document.getElementById("artist").innerHTML += artist;
    document.getElementById("user").innerHTML += user;

    var queueTest = ["Fireball","Talking Out Loud","Darude Sandstorm","Molly"];
    createList(queueTest); 
}

function createList(queue){
    for (let i = 0; i < queue.length; i++){
        $("#playlist").append("<li>" + queue[i] + "</li>");
    }
}

function getCurrentTrack() {

}


function onLoad() {
    window.setInterval(function() {
         
    }, 5000);   
}
