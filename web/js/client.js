$(document).ready( function(){


    // get room name
    var room = document.getElementById("room").innerHTML;

    // get username
    var name = window.prompt("Enter username:", "");

    //validate username
    while(!isValidUsername(name)){
        name = window.prompt("Enter username\nInvalid characters: (\",<#>$)", "");
    }

    // open connection to server
    var webSocket = //new WebSocket('ws://crmepham.no-ip.biz:8080/WebSocketChat/wschat');
        new WebSocket('ws://localhost:8080/wschat');

    // keep message window at bottom (most recent messages)
    var $cont = $('#messages');
    $cont[0].scrollTop = $cont[0].scrollHeight;

    // allow user to start typing as soon as page is loaded
    $("#message").focus();

    $('#message').bind('keyup', function(e) {
        if (e.keyCode === 13) { // 13 is enter key

            send();
            $cont[0].scrollTop = $cont[0].scrollHeight;
            $("#message").val('');

        }

    });

    // store users session id locally
    var sessionId = 0;

    // store jsonUserList
    var onlineUserList;


    webSocket.onerror = function(event) {



    };

    webSocket.onopen = function(event) {



    };

    webSocket.onmessage = function(event) {

        // incoming messages are always JSON format
        var json = JSON.parse(event.data);

        if(json.hasOwnProperty("USERLEFT")){
            alert("hereee");

            document.getElementById("messages").innerHTML += json.USERLEFT + " left the room.";

        }

        // if json has SESSIONID then request a list of online users
        if(json.hasOwnProperty("SESSIONID")){
            sessionId = json.SESSIONID;
            webSocket.send("{\"CMD\":\"ONLINEUSERS\",\"SESSIONID\":\""+sessionId+"\"}");

        }

        if(json.hasOwnProperty("ONLINEUSERS")){

            if(usernameExists(name, json)){
                name = window.prompt("Username already in use: (\",<#>$)\n\nEnter a different username\nInvalid characters: (\",<#>$)", "");
                webSocket.send("{\"CMD\":\"ONLINEUSERS\",\"SESSIONID\":\""+sessionId+"\"}");
            }

            // update list of online users
            onlineUserList = updateOnlineUserList(json);

            // send user details (session id, room, username)
            webSocket.send("{\"CMD\":\"ADDUSER\",\"SESSIONID\":\""+sessionId+"\",\"USERNAME\":\""+name+"\",\"ROOM\":\""+room+"\"}");
        }

        if(json.hasOwnProperty("RSP")){

            document.getElementById("messages").innerHTML += "Welcome to r/" + room + ".<br>";
            document.getElementById("messages").innerHTML += "Online users: " + onlineUserList + " " + name;
        }

    };


    function updateOnlineUserList(json){
        var list = "";
        for(var i in json.ONLINEUSERS){
            list += json.ONLINEUSERS[i].USERNAME + " ";
        }
        return list;
    }

    function usernameExists(name, json){

            for(var i in json.ONLINEUSERS){
                if(json.ONLINEUSERS[i].USERNAME == name) return true;
            }

        return false;

    }


    function isValidUsername(name){
        var fname = name.trim();
        if(fname.length == 0){
            return false;
        }
        for (var i = 0, len = fname.length; i < len; i++) {

            if(fname.charAt(i) == '<' || fname.charAt(i) == '#' || fname.charAt(i) == '>' || fname.charAt(i) =='$' || fname.charAt(i) == '\'' || fname.charAt(i) == '"'){
                return false;
            }

        }




        return true;
    }








    function onMessage(event) {
        //document.getElementById('messages').innerHTML
        //+= '<p>' + event.data + '</p>';

        var jsonObj = JSON.parse(event.data);

        if(jsonObj.hasOwnProperty("onlineUsers")){

            var userListString = "";
            for(var user in jsonObj.onlineUsers){
                userListString += jsonObj.onlineUsers[user] + " ";
            }

            document.getElementById('messages').innerHTML
                += "<p><i><span class='server'>Online users:  " + userListString + ".</span></i></p>";
        }

        if(jsonObj.hasOwnProperty("server")){

            var server = jsonObj.server;

            document.getElementById('messages').innerHTML
                += "<p><i><span class='server'>> " + server + " left the chat.</span></i></p>";
        }
        if(jsonObj.hasOwnProperty("newUser")){

            var newUser = jsonObj.newUser;

            if(newUser != name)
                document.getElementById('messages').innerHTML
                    += "<p><i><span class='server'>> " + newUser + " joined the chat.</span></i></p>";

        }
        if(jsonObj.hasOwnProperty("name")){

            var message = "<span class='you'>" + jsonObj.name + ": </span> "+ jsonObj.message;
            if(jsonObj.name != name) message = "<span class='sender'>" + jsonObj.name + ": </span>" + jsonObj.message;

            document.getElementById('messages').innerHTML
                += '<p>' + message+'</p>';

        }


        if(jsonObj.hasOwnProperty("message")){

            document.getElementById('messages').innerHTML
                += '<p>' + jsonObj.message+'</p>';

        }


        $cont[0].scrollTop = $cont[0].scrollHeight;
    }

    function onOpen(event) {
        document.getElementById('messages').innerHTML
            += '<i>Connection established</i>';

        var send = "{\"newUser\":\""+name+"\"}";
        webSocket.send(send);
    }

    function onError(event) {
        alert(event.data);
    }

    function send() {
        var message = document.getElementById('message').value.replace("\"", "&quot;");
        var str = "{\"name\":\""+name+"\",\"message\":\""+message+"\"}";
        //var jsonObj = JSON.parse(str);
        //var txt = "<span class=\"you\">"+name+": </span>" + document.getElementById('message').value;
        webSocket.send(str);
        return false;
    }
});