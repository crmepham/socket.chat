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

    $("#message").bind('keyup', function(e) {
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

    // keep connection alive
    window.setInterval(function(){
        webSocket.send("{\"CMD\":\"KEEPALIVE\"}");
    }, 30000);


    webSocket.onerror = function(event) {

    };

    webSocket.onopen = function(event) {

    };

    webSocket.onmessage = function(event) {

        // incoming messages are always JSON format
        var json = JSON.parse(event.data);

        if(json.hasOwnProperty("MESSAGE")){

            document.getElementById("messages").innerHTML += "<p>" + json.USERNAME + ": " + json.MESSAGE + "</p>";
        }

        if(json.hasOwnProperty("NOTIFYOFNEWUSER")){

            document.getElementById("messages").innerHTML += json.NOTIFYOFNEWUSER + " joined the room.<br>";
        }

        if(json.hasOwnProperty("USERLEFTNAME")){

            webSocket.send("{\"CMD\":\"USERLEFT\",\"USERLEFTNAME\":\"" + json.USERLEFTNAME + "\",\"ROOM\":\""+json.ROOM+"\"}");

        }

        if(json.hasOwnProperty("USERLEFT")){

            document.getElementById("messages").innerHTML += "<p>" + json.USERLEFT + " left the room.</p>";

        }

        // if json has SESSIONID then request a list of online users
        if(json.hasOwnProperty("SESSIONID")){
            sessionId = json.SESSIONID;
            webSocket.send("{\"CMD\":\"ONLINEUSERS\",\"SESSIONID\":\""+sessionId+"\"}");

        }

        if(json.hasOwnProperty("ONLINEUSERS")){

            if(usernameExists(name, json)){
                name = window.prompt("Username already in use: \nEnter a different username.\nInvalid characters: (\",<#>$)", "");
                webSocket.send("{\"CMD\":\"ONLINEUSERS\",\"SESSIONID\":\""+sessionId+"\"}");
            }else{
                // update list of online users
                onlineUserList = updateOnlineUserList(json);

                // send user details (session id, room, username)
                webSocket.send("{\"CMD\":\"ADDUSER\",\"SESSIONID\":\""+sessionId+"\",\"USERNAME\":\""+name+"\",\"ROOM\":\""+room+"\"}");
            }


        }

        if(json.hasOwnProperty("RSP")){

            if(json.RSP == "WELCOME"){
                document.getElementById("messages").innerHTML += "Welcome to r/" + room + ".<br>";
                document.getElementById("messages").innerHTML += "Online users: " + onlineUserList + " " + name + "<br>";
                webSocket.send("{\"CMD\":\"NOTIFYOFNEWUSER\",\"USERNAME\":\""+name+"\",\"ROOM\":\""+room+"\"}");
            }
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

    function send() {

        var msg = document.getElementById('message').value;
        msg = sanitizeMessage(msg);
        if(isValidMessage(msg)){
            webSocket.send("{\"CMD\":\"MESSAGE\",\"BODY\":\"" + msg + "\",\"ROOM\":\"" + room + "\",\"SESSIONID\":\"" + sessionId + "\",\"USERNAME\":\"" + name + "\"}");
            //document.getElementById("messages").innerHTML += "<p>" + name + ": " + msg + "</p>";
            return false;
        }

    }

    function isValidMessage(msg){
        msg = msg.trim();
        if(msg.length )return true;
        return false;
    }

    function sanitizeMessage(msg){

        return msg.replace("\"", "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;");
    }
});