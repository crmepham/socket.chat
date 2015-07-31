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

    // store count of new messages not yet seen
    var notificationCounter = 0;

    // if window focused
    var windowFocused = true;

    // clear notification counter when on window
    $(window).focus(function(){
       document.title = "r/"+room;
        notificationCounter = 0;
    });

    // keep connection alive
    window.setInterval(function(){
        webSocket.send("{\"CMD\":\"KEEPALIVE\"}");
    }, 30000);

    // allow user to start typing as soon as page is loaded
    $("#message-input").focus();

    $(".message-name").live("click", function(e){
        e.preventDefault();

        var name = $(this).text();
        $("#message-input").val("/tell " + name + " ");
        $("#message-input").focus();
    });

    $("#message-input").bind('keydown', function(e){

        if(e.keyCode === 9){
            e.preventDefault();
            if(lastMessageReciever == ""){
                $("#message-input").val("/tell ");
            }else{
                $("#message-input").val("/tell "+lastMessageReciever+" ");
            }

        }
    });
    $("#message-input").bind('keyup', function(e) {

        if (e.keyCode === 13) { // 13 is enter key

            var message = $("#message-input").val().trim();

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
                                    document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"sent-pm\" href=\"#\">" + name + ":</a></div><div class=\"message-msg\"><p class=\"sent-pm\"> ["+option+"] " + msg + "</div></div>";
                                }else{
                                    document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"server\" href=\"#\">Server:</a></div><div class=\"message-msg\"><p class=\"server\">You can not send a message to yourself.</div></div>";
                                }
                            }else{
                                document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"server\" href=\"#\">Server:</a></div><div class=\"message-msg\"><p class=\"server\">Invalid message.</div></div>";
                            }

                        }else{
                            document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"server\" href=\"#\">Server:</a></div><div class=\"message-msg\"><p class=\"server\">User "+option+" is not online.</div></div>";
                        }
                        break;
                    case "rules":
                        document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"server\" href=\"#\">Server:</a></div><div class=\"message-msg\"><p class=\"server\">Rules: 1) Do not spam 2) Be polite to other users 3) Do not use vulgar language.</div></div>";
                        break;
                    case "mutelist":
                        if(muteList.length > 0){
                            var muteListString = "";
                            for(var i = 0, size = muteList.length; i<size; i++){
                                muteListString += muteList[i] + " ";
                            }
                            document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"server\" href=\"#\">Server:</a></div><div class=\"message-msg\"><p class=\"server\">Users on your mute list: "+muteListString+".</div></div>";
                        }else{
                            document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"server\" href=\"#\">Server:</a></div><div class=\"message-msg\"><p class=\"server\">No users are muted.</div></div>";
                        }

                        break;
                    case "unmute":
                        if(option != null && isMuted(option)){
                            removeUserFromMutedList(option);
                            document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"server\" href=\"#\">Server:</a></div><div class=\"message-msg\"><p class=\"server\">"+option+" was removed from mute list.</div></div>";
                        }else{
                            document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"server\" href=\"#\">Server:</a></div><div class=\"message-msg\"><p class=\"server\">Please specify a user from your mute list to unmute.</div></div>";
                        }
                        break;
                    case "mute":
                        if(option == null){
                            document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"server\" href=\"#\">Server:</a></div><div class=\"message-msg\"><p class=\"server\">Please choose a user to mute and type /mute \"username\".</div></div>";
                        }else if(isMuted(option)){
                            document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"server\" href=\"#\">Server:</a></div><div class=\"message-msg\"><p class=\"server\">"+option+" is already on mute list.</div></div>";
                        }else{
                            muteList.push(option);
                            document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"server\" href=\"#\">Server:</a></div><div class=\"message-msg\"><p class=\"server\">"+option+" was added to mute list.</div></div>";
                        }
                        break;
                    case "clear":
                        document.getElementById("messages").innerHTML = "";
                        break;
                    case "help":
                        document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"server\" href=\"#\">Server:</a></div><div class=\"message-msg\"><p class=\"server\">Available help: commands, themes, theme, users, tell, mute, unmute, mutelist, rules, clear.</div></div>";
                        break;

                    case "themes":
                        document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"server\" href=\"#\">Server:</a></div><div class=\"message-msg\"><p class=\"server\">Available themes: dos, doslight. Select theme using /theme \"themename\"</div></div>";
                        break;

                    case "theme":

                            if(option == "dos" || option =="doslight"){
                                changeTheme(option);
                            }else {
                                document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"server\" href=\"#\">Server:</a></div><div class=\"message-msg\"><p class=\"server\">Unrecognised option: " + option + ". Please type /themes for a list of themes.</div></div>";
                            }
                        break;
                    case "users":
                        document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"server\" href=\"#\">Server:</a></div><div class=\"message-msg\"><p class=\"server\">Users online: "+onlineUserList+".</div></div>";
                        break;
                    default:
                        document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"server\" href=\"#\">Server:</a></div><div class=\"message-msg\"><p class=\"server\">Unrecognised command: "+cmd+". Please type /commands for a list of commands.</div></div>";
                        break;
                }
            }

            send();
            $cont[0].scrollTop = $cont[0].scrollHeight;
            lastMessage = $("#message-input").val();
            $("#message-input").val('');


        }
        if(e.keyCode === 38){
            $("#message-input").val(lastMessage);
        }

    });

    webSocket.onerror = function(event) {

    };
    webSocket.onclose = function(event) {

        document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"server\" href=\"#\">Server:</a></div><div class=\"message-msg\"><p class=\"server\">Disconnected.</div></div>";
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
            document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"recieved-pm\" href=\"#\">" + json.FROM + "</a></div><div class=\"message-msg\"><p class=\"recieved-pm\">" + json.MESSAGEUSER + "</div></div>";
        }

        if(json.hasOwnProperty("SESSIONIDMESSAGE")){

            if(!isMuted(json.USERNAME)){
                if(json.SESSIONIDMESSAGE.toString() == sessionId){

                    document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"you\" href=\"#\">" + json.USERNAME + "</a></div><div class=\"message-msg\"><p class=\"message-text\">" + json.MESSAGE + "</div></div>";

                }else{
                    document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"sender\" href=\"#\">" + json.USERNAME + "</a></div><div class=\"message-msg\"><p class=\"message-text\">" + json.MESSAGE + "</div></div>";
                    updateNotificationTitle();

                }

            }
        }

        if(json.hasOwnProperty("NOTIFYOFNEWUSER")){

            document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"server\" href=\"#\">Server:</a></div><div class=\"message-msg\"><p class=\"server\">" + json.NOTIFYOFNEWUSER + " joined the room.</div></div>";

            onlineUserList = onlineUserList + " " + json.NOTIFYOFNEWUSER;
            buildOnlineUserListGUI(onlineUserList);
        }

        if(json.hasOwnProperty("USERLEFTNAME")){

            webSocket.send("{\"CMD\":\"USERLEFT\",\"USERLEFTNAME\":\"" + json.USERLEFTNAME + "\",\"ROOM\":\""+json.ROOM+"\"}");


        }

        if(json.hasOwnProperty("USERLEFT")){

            document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"server\" href=\"#\">Server:</a></div><div class=\"message-msg\"><p class=\"server\">" + json.USERLEFT + " left the room.</div></div>";

            var removedList = removeUserFromOnlineList(onlineUserList, json.USERLEFT);
            onlineUserList = removedList;
            buildOnlineUserListGUI(removedList);
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
                buildOnlineUserListGUI(onlineUserList);

                // send user details (session id, room, username)
                webSocket.send("{\"CMD\":\"ADDUSER\",\"SESSIONID\":\""+sessionId+"\",\"USERNAME\":\""+name+"\",\"ROOM\":\""+room+"\"}");
            }


        }

        if(json.hasOwnProperty("RSP")){

            if(json.RSP == "WELCOME"){
                document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"server\" href=\"#\">Server:</a></div><div class=\"message-msg\"><p class=\"server\">Users online: " + onlineUserList + "</div></div>";


                webSocket.send("{\"CMD\":\"NOTIFYOFNEWUSER\",\"USERNAME\":\""+name+"\",\"ROOM\":\""+room+"\",\"SESSIONID\":\""+sessionId+"\"}");

            }
        }
        $cont[0].scrollTop = $cont[0].scrollHeight;
    };

    function updateNotificationTitle(){

        updateNotificationCounter();
        if(notificationCounter > 0){
            document.title = "("+notificationCounter+") " + "r/" + room;
        }else{
            document.title = "r/" + room;
        }

    }

    function updateNotificationCounter(){
        isWindowFocused();
        if(windowFocused){
            notificationCounter = 0;
        }else{
            notificationCounter += 1;
        }

    }

    function isWindowFocused(){
        $(window).focus(function() {
            windowFocused = true;
        }).blur(function() {
            windowFocused = false;
        });
    }
    function removeUserFromOnlineList(onlineUserList, userThatLeft){

        var stringArray = onlineUserList.split(" ");
        var output = "";
        for(var i = 0, size = stringArray.length; i<size; i++){
            if(stringArray[i] == userThatLeft) continue;
            output += stringArray[i] + " ";
        }

        return output.trim();
    }

    function buildOnlineUserListGUI(onlineUserList){
        var stringArray = onlineUserList.split(" ");
        var output = "<ul>";
        for(var i = 0, size = stringArray.length; i<size; i++){
            output += "<li><a href=\"#\" class=\"username-link\">"+stringArray[i]+"</a></li>";
        }
        output += "</ul>";

        document.getElementById("onlineUserListWrapper").innerHTML = output;
    }

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

        var msg = document.getElementById('message-input').value;
        msg = sanitizeMessage(msg);
        if(isValidMessage(msg)){
           msg = linkify(msg);
            //jsonMsg = JSON.stringify({'CMD':'MESSAGE','BODY':msg,'ROOM':room,'SESSIONID':sessionId,'USERNAME':name});
            //alert(jsonMsg);
            //WebSocket.send(jsonMsg);
            //WebSocket.send("{'CMD':'MESSAGE','BODY':'"+msg+"','ROOM':'"+room+"','SESSIONID':'"+sessionId+"','USERNAME':'"+name+"'}");
            webSocket.send("{\"CMD\":\"MESSAGE\",\"BODY\":\""+msg+"\",\"ROOM\":\""+room+"\",\"SESSIONID\":\"" + sessionId + "\",\"USERNAME\":\"" + name + "\"}");
            //document.getElementById("messages").innerHTML += "<p>" + name + ": " + msg + "</p>";
            return false;
        }

    }

    function linkify(inputText) {
        var replacedText, replacePattern1, replacePattern2, replacePattern3;

        //URLs starting with http://, https://, or ftp://
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = inputText.replace(replacePattern1, "<a class='message-link' href='$1' target='_blank'>$1</a>");

        //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, "$1<a class='message-link' href='http://$2' target='_blank'>$2</a>");

        //Change email addresses to mailto:: links.
        replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
        replacedText = replacedText.replace(replacePattern3, "<a class='message-link' href='mailto:$1'>$1</a>");

        return replacedText;
    }

    function isValidMessage(msg){
        msg = msg.trim();
        if(msg.length > 0 && msg.charAt(0) != '/')return true;
        return false;
    }

    function sanitizeMessage(msg){

        return msg.replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#x27;");
    }

    function changeTheme(option){

        var link = document.getElementById("theme-link");
        link.href="../css/themes/"+option+".css";

        document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"server\" href=\"#\">Server:</a></div><div class=\"message-msg\"><p class=\"server\">Theme changed to " + option + ".</div></div>";
    }
});