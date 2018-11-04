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
