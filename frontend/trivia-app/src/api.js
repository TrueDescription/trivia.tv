
function api_createLobby(cb){

    fetch('/api/createLobby', {
        method: "post", 
        mode: "same-origin",
        cache: "no-cache", 
        credentials: "same-origin", 
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow",
        referrerPolicy: "no-referrer", 
    })
    .then(response=>response.json())
	.then(data=>cb(data))
	.catch(error=>console.log(error));;
}

function api_joinLobby(lobbyCode, cb){
    fetch('/api/joinLobby/' + lobbyCode, {
        method: "post", 
        mode: "same-origin",
        cache: "no-cache", 
        credentials: "same-origin", 
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow",
        referrerPolicy: "no-referrer", 
    })
    .then(response=>response.json())
	.then(data=>cb(data))
	.catch(error=>console.log(error));;
}

export { api_createLobby, api_joinLobby }