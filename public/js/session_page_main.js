/* function receiveUsers() {
    var users = $.ajax({url:"url"})
} */
function createTable(testUsers){
    var testSplit = testUsers.split(',')
    var users= [].concat(testSplit);
    console.log(users);
    var table = document.getElementById('userTable');
    console.log(users);
    for(let i = 0; i < users.length; i++){
        var row = table.insertRow(i+1);
        var cell = row.insertCell(0);
        cell.innerHTML = users[i];
    }
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
		newDoc.write(data);
		newDoc.close();
	}, 'text');
}
