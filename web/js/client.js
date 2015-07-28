$(document).ready( function(){

    // get room name
    var room = document.getElementById("room").innerHTML;

    // get username
    var name = window.prompt("Enter username:", "");

    //validate username
    while(!isValidUsername(name)){
        name = window.prompt("Enter username\nInvalid characters: (\",<#>$)\nBetween 1-15 characters", "");
    }

    var url = "ws://crmepham.no-ip.biz:8080/WebSocketChat/server";

    // open connection to server
    var webSocket = new WebSocket(url);

    // keep message window at bottom (most recent messages)
    var $cont = $('#messages');
    $cont[0].scrollTop = $cont[0].scrollHeight;

    // store users session id locally
    var sessionId = 0;

    // store jsonUserList
    var onlineUserList;

    // temporarily store last message sent
    var lastMessage;

    // list of muted players
    var muteList = [];

    // store name of last person privately messaged
    var lastMessageReciever = "";

    // keep connection alive
    window.setInterval(function(){
        webSocket.send("{\"CMD\":\"KEEPALIVE\"}");
    }, 30000);

    // allow user to start typing as soon as page is loaded
    $("#message").focus();

    $("#message").bind('keydown', function(e){

        if(e.keyCode === 9){
            e.preventDefault();
            if(lastMessageReciever == ""){
                $("#message").val("/tell ");
            }else{
                $("#message").val("/tell "+lastMessageReciever+" ");
            }

        }
    });
    $("#message").bind('keyup', function(e) {

        if (e.keyCode === 13) { // 13 is enter key

            var message = $("#message").val().trim();

            // if first character is forward slash then it is a command
            if(message.charAt(0) == '/'){
                var message = message.replace(/\//g,"");
                var cmds = message.split(" ");
                var cmd = cmds[0];
                var option = cmds[1];


                switch(cmd){
                    case "t":
                    case "tell":
                        var count = cmds.length;
                        var msg = "";
                        for(var i = 2; i<count; i++){
                            if(i == count-1){
                                msg += cmds[i];
                            }else{
                                msg += cmds[i] + " ";
                            }
                        }
                        if(isOnlineUser(option)){
                            if(isValidMessage(msg)){
                                if(option != name){
                                    lastMessageReciever = option;
                                    // send message to server where only that user will be sent it
                                    webSocket.send("{\"CMD\":\"MESSAGEUSER\",\"FROM\":\""+name+"\",\"FROMID\":\""+sessionId+"\",\"TO\":\""+option+"\",\"PM\":\""+msg+"\",\"ROOM\":\""+room+"\"}");
                                    document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"pm-sender\">" + name + "</span>:</p></div><p><span class=\"message-msg-pm-sender\"> " + msg + "</span></p></div>";
                                }else{
                                    document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"server\">Server :</span></p></div><div class=\"message-msg \"><p><span class=\"server\">You can not send a message to yourself.</span><p></div></div>";
                                }
                            }else{
                                document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"server\">Server :</span></p></div><div class=\"message-msg \"><p><span class=\"server\">Invalid message.</span><p></div></div>";
                            }

                        }else{
                            document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"server\">Server :</span></p></div><div class=\"message-msg \"><p><span class=\"server\">User "+option+" is not online.</span><p></div></div>";
                        }
                        break;
                    case "rules":
                        document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"server\">Server :</span></p></div><div class=\"message-msg \"><p><span class=\"server\">Rules: 1) Do not spam 2) Be polite to other users 3) Do not use vulgar language.</span><p></div></div>";
                        break;
                    case "mutelist":
                        if(muteList.length > 0){
                            var muteListString = "";
                            for(var i = 0, size = muteList.length; i<size; i++){
                                muteListString += muteList[i] + " ";
                            }
                            document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"server\">Server :</span></p></div><div class=\"message-msg \"><p><span class=\"server\">Users on your mute list: "+muteListString+".</span><p></div></div>";
                        }else{
                            document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"server\">Server :</span></p></div><div class=\"message-msg \"><p><span class=\"server\">No users are muted.</span><p></div></div>";
                        }

                        break;
                    case "unmute":
                        if(option != null && isMuted(option)){
                            removeUserFromMutedList(option);
                            document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"server\">Server :</span></p></div><div class=\"message-msg \"><p><span class=\"server\">"+option+" was removed from mute list.</span><p></div></div>";
                        }else{
                            document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"server\">Server :</span></p></div><div class=\"message-msg \"><p><span class=\"server\">Please specify a user from your mute list to unmute.</span><p></div></div>";
                        }
                        break;
                    case "mute":
                        if(option == null){
                            document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"server\">Server :</span></p></div><div class=\"message-msg \"><p><span class=\"server\">Please choose a user to mute and type /mute \"username\".</span><p></div></div>";
                        }else if(isMuted(option)){
                            document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"server\">Server :</span></p></div><div class=\"message-msg \"><p><span class=\"server\">"+option+" is already on mute list.</span><p></div></div>";
                        }else{
                            muteList.push(option);
                            document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"server\">Server :</span></p></div><div class=\"message-msg \"><p><span class=\"server\">"+option+" was added to mute list.</span><p></div></div>";
                        }
                        break;
                    case "clear":
                        document.getElementById("messages").innerHTML = "";
                        break;
                    case "commands":
                        document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"server\">Server :</span></p></div><div class=\"message-msg \"><p><span class=\"server\">Available commands: commands, themes, theme, users, msg, tell, t, mute, unmute, mutelist, rules, clear.</span><p></div></div>";
                        break;

                    case "themes":
                        document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"server\">Server :</span></p></div><div class=\"message-msg \"><p><span class=\"server\">Available themes: dos, doslight. Select theme using /theme \"themename\"</span><p></div></div>";
                        break;

                    case "theme":

                            if(option == "dos" || option =="doslight"){
                                changeTheme(option);
                            }else {
                                document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"server\">Server :</span></p></div><div class=\"message-msg \"><p><span class=\"server\">Unrecognised option: " + option + ". Please type /themes for a list of themes.</span><p></div></div>";
                            }
                        break;
                    case "users":

                        document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"server\">Server :</span></p></div><div class=\"message-msg \"><p><span class=\"server\">Users online: "+onlineUserList+"</span><p></div></div>";

                        break;
                    default:
                        document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"server\">Server :</span></p></div><div class=\"message-msg \"><p><span class=\"server\">Unrecognised command: "+cmd+". Please type /commands for a list of commands.</span><p></div></div>";
                        break;
                }
            }
            send();
            $cont[0].scrollTop = $cont[0].scrollHeight;
            lastMessage = $("#message").val();
            $("#message").val('');

        }
        if(e.keyCode === 38){
            $("#message").val(lastMessage);
        }

    });

    webSocket.onerror = function(event) {

    };
    webSocket.onclose = function(event) {

        document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"server\">Server :</span></p></div><div class=\"message-msg \"><p><span class=\"server\">Disconnected.</span><p></div></div>";
        /*setTimeout(function(){
            webSocket = new WebSocket(url);
        }, 3000);*/


    };

    webSocket.onopen = function(event) {

    };

    webSocket.onmessage = function(event) {

        // incoming messages are always JSON format
        var json = JSON.parse(event.data);

        if(json.hasOwnProperty("MESSAGEUSER")){
            document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"pm\">" + json.FROM + "</span>:</p></div><div class=\"message-msg-pm\"><p> " + json.MESSAGEUSER + "</p></div></div>";
        }

        if(json.hasOwnProperty("SESSIONIDMESSAGE")){

            if(!isMuted(json.USERNAME)){
                if(json.SESSIONIDMESSAGE.toString() == sessionId){
                    document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"you\">" + json.USERNAME + "</span>:</p></div><div class=\"message-msg \"><p> " + json.MESSAGE + "</p></div></div>";

                }else{
                    document.getElementById("messages").innerHTML += "<div class=\"message-wrapper\"><div class=\"message-name \"><p><span class=\"sender\">" + json.USERNAME + "</span> : </p></div><div class=\"message-msg \"><p>" + json.MESSAGE + "</p></div></div>";
                }
            }
        }

        if(json.hasOwnProperty("NOTIFYOFNEWUSER")){

            document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"server\">Server :</span></p></div><div class=\"message-msg \"><p><span class=\"server\">" + json.NOTIFYOFNEWUSER + " joined the room.</span><p></div></div>";
            onlineUserList = onlineUserList + " " + json.NOTIFYOFNEWUSER;
        }

        if(json.hasOwnProperty("USERLEFTNAME")){

            webSocket.send("{\"CMD\":\"USERLEFT\",\"USERLEFTNAME\":\"" + json.USERLEFTNAME + "\",\"ROOM\":\""+json.ROOM+"\"}");


        }

        if(json.hasOwnProperty("USERLEFT")){

            document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"server\">Server :</span></p></div><div class=\"message-msg \"><p><span class=\"server\">" + json.USERLEFT + " left the room.</span></p></div></div>";
            onlineUserList = onlineUserList.replace(json.USERLEFT, "");
        }

        // if json has SESSIONID then request a list of online users
        if(json.hasOwnProperty("SESSIONID")){
            sessionId = json.SESSIONID;
            webSocket.send("{\"CMD\":\"ONLINEUSERS\",\"SESSIONID\":\""+sessionId+"\",\"ROOM\":\""+room+"\"}");

        }

        if(json.hasOwnProperty("ONLINEUSERS")){

            if(usernameExists(name, json)){
                name = window.prompt("Username already in use: \nEnter a different username.\nInvalid characters: (\",<#>$)\nBetween 1-15 characters", "");
                webSocket.send("{\"CMD\":\"ONLINEUSERS\",\"SESSIONID\":\""+sessionId+"\",\"ROOM\":\""+room+"\"}");
            }else{
                // update list of online users
                onlineUserList = updateOnlineUserList(json) + name;

                // send user details (session id, room, username)
                webSocket.send("{\"CMD\":\"ADDUSER\",\"SESSIONID\":\""+sessionId+"\",\"USERNAME\":\""+name+"\",\"ROOM\":\""+room+"\"}");
            }


        }

        if(json.hasOwnProperty("RSP")){

            if(json.RSP == "WELCOME"){
                document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"server\">Server :</span></p></div><div class=\"message-msg \"><p><span class=\"server\"> Users online: " + onlineUserList + "</span></p></div></div>";


                webSocket.send("{\"CMD\":\"NOTIFYOFNEWUSER\",\"USERNAME\":\""+name+"\",\"ROOM\":\""+room+"\",\"SESSIONID\":\""+sessionId+"\"}");
            }
        }
        $cont[0].scrollTop = $cont[0].scrollHeight;
    };

    function isOnlineUser(option){
        var onlineUserArray = onlineUserList.split(" ");
        for(var i = 0, size = onlineUserArray.length; i<size; i++){
            if(onlineUserArray[i] == option){
                return true;
            }
        }
        return false;
    }

    function removeUserFromMutedList(username){
        for(var i = 0, size = muteList.length; i<size; i++){
            if(muteList[i] == username){
                muteList.splice(i,1);
            }
        }
    }

    function isMutedIndex(username){
        for(var i = 0, size = muteList.length; i<size; i++){
            if(muteList[i] == username){
                return i;
            }
        }
    }

    function isMuted(username){
        for(var i = 0, size = muteList.length; i<size; i++){
            if(muteList[i] == username){
                return true;
            }
        }
    }

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
        if(fname.length == 0 || fname.length > 15){
            return false;
        }
        for (var i = 0, len = fname.length; i < len; i++) {

            if(fname.charAt(i) == ' ' || fname.charAt(i) == '<' || fname.charAt(i) == '#' || fname.charAt(i) == '>' || fname.charAt(i) =='$' || fname.charAt(i) == '\'' || fname.charAt(i) == '"'){
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
        if(msg.length > 0 && msg.charAt(0) != '/')return true;
        return false;
    }

    function sanitizeMessage(msg){

        return msg.replace("\"", "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#x27;");
    }

    function changeTheme(option){

        var link = document.getElementById("theme-link");
        link.href="../css/themes/"+option+".css";

        document.getElementById("messages").innerHTML += "<div class=\"message-wrapper \"><div class=\"message-name \"><p><span class=\"server\">Server :</span></p></div><div class=\"message-msg \"><p><span class=\"server\">Theme changed to " + option + ".</span><p></div></div>";
    }
});