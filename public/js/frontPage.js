function createJam(userUri) {
//    var website = "https://jukebox-node-8080.herokuapp.com/create";
    var website = "http://localhost:8080/create";
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

function startSession(userUri, userId) {
	var website = "http://localhost:8080/session_start";
	$.ajaxSetup({
		headers: {
			useruri:userUri,
			userid:userId,
			'dataType': "text",
			'Access-Control-Allow-Credentials':true,
			'Access-Control-Allow-Origin':true,
			'content-type':'text/html',
			'Accept':'text/html',
		},
		error: function(jqxhr, textStatus, errorThrown) {
			console.log(errorThrown);
		}
	});

	$.get(website, function(data) {
		var newDoc = document.open("text/html", "replace");
		newDocwrite(data);
		newDoc.close();
	}, 'text');
}
