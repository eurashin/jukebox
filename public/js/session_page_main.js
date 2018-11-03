/* function receiveUsers() {
    var users = $.ajax({url:"url"})
} */

var testUsers = ["Alex","Logan","Eura","Chase"];

function createTable(){
    var table = document.getElementById('userTable');  

    for(let i = 0; i < testUsers.length; i++){
        var row = table.insertRow(i+1);
        var cell = row.insertCell(0);
        cell.innerHTML = testUsers[i];
    }
}
