
var sendPost = function(){
    var data = document.getElementById('coin')
    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {"val" : data.value}
    })
}
