$(document).ready(function () {

    // get room name
    var room = document.getElementById("room").innerHTML;

    // get username
    var name = window.prompt("Enter username:", "");
    
    // send user back to homepage if they press cancel
    if(!name){
    	window.location.href = "http://socket.chat";
    }
    
    name = formatString(name);
    
    //validate username
    while (!isValidUsername(name)) {
        name = window.prompt("Enter username\nInvalid characters: (\",<#>$)\nBetween 1-15 characters", "");
        name = formatString(name);
    }

    // keep message window at bottom (most recent messages)
    var $cont = $('#messages');

    // store users session id locally
    var sessionId = 0;

    // store jsonUserList
    var onlineUserList = "";

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

    var themes = ["dos", "doslight"];

    //var url = "ws://crmepham.no-ip.biz:8080/WebSocketChat/server";
    var url = "ws://localhost:8080/WebSocketChat/server";

    // stores active interval for auto reconnect
    var reconnect;

    // stores Websocket object
    var ws = null;

    // timer counts up to 900 seconds.
    var afkTimer = 0;

    var afkTrigger = 900; // 15 minutes

    var afkNotified = false;

    // open connection to server
    start(url);

    function start(url) {
        ws = new WebSocket(url);

        setInterval(function () {
            ++afkTimer;

            if(afkTimer > afkTrigger){
                // send message to other users that this user is AFK
                if(!afkNotified){
                    ws.send(JSON.stringify({cmd:'notifyOfAfkUser', username:name, sessionId:sessionId, room:room}));
                    afkNotified = true;
                }
            }
        }, 1000);
        
        setInterval(function () { ws.send(JSON.stringify({cmd:'ping', sessionId:sessionId, room:room})); }, 1000);

        ws.onopen = function (event) {

            if (reconnect) {
                window.clearInterval(reconnect);
                // update user list
                ws.send(JSON.stringify({cmd:'onlineUsers', sessionId:sessionId, room:room}));
                reconnect = 0;
                print("server", "server:", "reconnect successful");
            }
        };

        ws.onclose = function (event) {

            if (!reconnect) {
                reconnect = setInterval(function () {
                    start(url)
                }, 3000);
                print("server", "server:", "disconnected. Attempting to reconnect...");
            }

        };

        ws.onmessage = function (event) {

            // incoming messages are always JSON format
            var json = JSON.parse(event.data);

            if (json.hasOwnProperty("messageUser")) {

                print("recieved-pm", json.from, json.messageUser);
                updateNotificationTitle();

            }
            
            if (json.hasOwnProperty("sessionIdMessage")) {

                if (!isMuted(json.username)) {
                    if (json.sessionIdMessage.toString() == sessionId) {

                        print("you", json.username, json.message);

                    } else {

                        print("sender", json.username, json.message);
                        updateNotificationTitle();
                    }
                }
            }

            if (json.hasOwnProperty("notifyOfNewUser")) {

                print("server", "server:", json.notifyOfNewUser + " joined the room.");
                onlineUserList += " " + json.notifyOfNewUser;
                buildOnlineUserListGUI(onlineUserList);
            }

            if (json.hasOwnProperty("userLeftName")) {
                ws.send(JSON.stringify({cmd:'userLeft', userLeftName:json.userLeftName, room:json.room}));
            }

            if (json.hasOwnProperty("userLeft")) {
                print("server", "server:", json.userLeft + " left the room.");
                var removedList = removeUserFromOnlineList(onlineUserList, json.userLeft);
                onlineUserList = removedList;
                buildOnlineUserListGUI(removedList);
            }

            // if json has SESSIONID then request a list of online users
            if (json.hasOwnProperty("sessionId")) {
                sessionId = json.sessionId;
                ws.send(JSON.stringify({cmd: 'onlineUsers', sessionId: sessionId, room: room}));
            }

            if (json.hasOwnProperty("onlineUsers")) {
                if (usernameExists(name, json) || name == null) {
                    name = window.prompt("Username already in use: \nEnter a different username.\nInvalid characters: (\",<#>$)\nBetween 1-15 characters", "");
                    if(!name){
                    	window.location.href = "http://socket.chat";
                    }
                    name = formatString(name);
                    ws.send(JSON.stringify({cmd:'onlineUsers', sessionId:sessionId, room:room}));
                } else {
                    // update list of online users
                    onlineUserList = updateOnlineUserList(json) + name;
                    buildOnlineUserListGUI(onlineUserList);

                    // send user details (session id, room, username)
                    ws.send(JSON.stringify({cmd:'addUser', sessionId:sessionId, username:name, room:room}));
                }
            }

            if(json.hasOwnProperty("notifyOfAfkUser")){
                //print("server", "server", json.notifyOfAfkUser + " is afk.");

                // rebuild online user list
                onlineUserList = updateOnlineUserListAfkUser(json.notifyOfAfkUser);
                buildOnlineUserListGUI(onlineUserList);
            }

            if(json.hasOwnProperty("notifyOfAfkReturnedUser")){
                print("server", "server:", json.notifyOfAfkReturnedUser + " has returned.");

                // rebuild online user list
                onlineUserList = updateOnlineUserListAfkReturnedUser(json.notifyOfAfkReturnedUser);
                buildOnlineUserListGUI(onlineUserList);
            }

            if (json.hasOwnProperty("rsp")) {

                if (json.rsp == "welcome") {

                    print("server", "server:", "Users online: " + onlineUserList);
                    ws.send(JSON.stringify({cmd:'notifyOfNewUser', username:name, room:room, sessionId:sessionId}));
                }
            }

            viewLatestMessage();
        };
    }

    // focus message input
    $("#message-input").focus();

    // reset AFK timer
    $(window).mousemove(function(){userIsActive();});

    // clear notification counter when on window
    $(window).focus(function () {
        userIsActive();
        document.title = "r/" + room;
        notificationCounter = 0;
    });

    $("#theme-selector").on("change", function(){
        var value = $(this).val();
        changeTheme(value);
        $("#message-input").focus();
    });

    $(".message-name, .username-link").live("click", function (e) {
        e.preventDefault();

        var name = $(this).text();
        $("#message-input").val("/tell " + name + " ");
        $("#message-input").focus();
    });

    // push TAB to quickly reply to pm
    $("#message-input").bind('keydown', function (e) {

        if (e.keyCode === 9) {
            e.preventDefault();
            if (lastMessageReciever == "") {
                $("#message-input").val("/tell ");
            } else {
                $("#message-input").val("/tell " + lastMessageReciever + " ");
            }
        }
    });

    $("#message-input").bind('keyup', function (e) {
        userIsActive();
        // when user presses RETURN to send message
        if (e.keyCode === 13) { // 13 is enter key

            var message = $("#message-input").val().trim();

            // if first character is forward slash then it is a command
            if (message.charAt(0) == '/') {
                var message = message.replace(/\//g, "");
                var cmds = message.split(" ");
                var cmd = cmds[0];
                var option = cmds[1];
                var serverMessage = "";
                var muteListString = "";
                var notServer = false;
                var noPrint = false;

                switch (cmd) {
                    case "tell":
                        var msg = getMessageFromCommand(cmds);

                        if (isOnlineUser(option)) {
                            if (isValidPrivateMessage(option, msg)) {
                                lastMessageReciever = option;
                                ws.send(JSON.stringify({cmd:'messageUser', from:name, fromId:sessionId, to:option, pm:msg, room:room}));
                                notServer = true;
                                serverMessage = "[" + option + "] " + msg;
                            } else {
                                serverMessage = "Unable to send PM. Either you are trying to PM yourself, or your message is invalid.";
                            }
                        } else {
                            serverMessage = "That user is not online.";
                        }

                        break;
                    case "rules":
                        serverMessage = "Rules: 1) Do not spam 2) Be polite to other users 3) Do not use vulgar language.";
                        break;
                    case "mutelist":
                        if (muteList.length > 0) {
                            muteListString = buildMuteListString();

                            serverMessage = "Users on your mute list: " + muteListString + ".";
                        } else {
                            serverMessage = "No users are muted.";
                        }
                        break;
                    case "unmute":
                        if (isUnmuteable(option)) {
                            removeUserFromMutedList(option);
                            serverMessage = option + " was removed from mute list.";
                        } else {
                            serverMessage = "Please specify a user from your mute list to unmute.";
                        }
                        break;
                    case "mute":
                        if (option == null) {
                            serverMessage = "Please choose a user to mute and type /mute \"username\".";
                        } else if (isMuted(option)) {
                            serverMessage = option + " is already on mute list.";
                        } else {
                            muteList.push(option);
                            serverMessage = option + " was added to mute list.";
                        }
                        break;
                    case "clear":
                        noPrint = true;
                        document.getElementById("messages").innerHTML = "";
                        break;
                    case "help":
                        serverMessage = "Available commands: help, themes, theme, users, tell, mute, unmute, mutelist, rules, clear.";
                        break;

                    case "themes":
                        serverMessage = "Available themes: dos, doslight. Select theme using /theme \"themename\"";
                        break;

                    case "theme":
                        if (isValidTheme(option)) {
                            changeTheme(option);
                            serverMessage = "Theme changed to " + option + ".";
                        } else {
                            serverMessage = "Unrecognised theme: " + option + ". Please type /themes for a list of themes.";
                        }
                        break;
                    case "users":
                        serverMessage = "Users online: " + onlineUserList + ".";
                        break;
                    default:
                        serverMessage = "Unrecognised command: " + cmd + ". Please type /commands for a list of commands.";
                        break;
                }
                if (!noPrint) {
                    if (notServer) {
                        print("sent-pm", name, serverMessage);
                    } else {
                        print("server", "server:", serverMessage);
                    }
                }
            }

            send();
            viewLatestMessage();
            clearMessageInput();
        }
        if (e.keyCode === 38) {
            $("#message-input").val(lastMessage);
        }
    });

    function userIsActive(){
        if(afkNotified == true){
            ws.send(JSON.stringify({cmd:'notifyOfAfkReturnedUser', username:name, sessionId:sessionId, room:room}));
            afkNotified = false;
        }
        afkTimer = 0;
    }

    function isOnlineUser(option) {
        var onlineUserArray = onlineUserList.split(" ");
        for (var i = 0, size = onlineUserArray.length; i < size; i++) {
            if (onlineUserArray[i] == option) {
                return true;
            }
        }
        return false;
    }

    function clearMessageInput() {
        lastMessage = $("#message-input").val();
        $("#message-input").val('');
    }

    function viewLatestMessage() {
        $cont[0].scrollTop = $cont[0].scrollHeight;
    }

    function isValidTheme(option) {
        for (var i = 0, size = themes.length; i < size; i++) {
            if (themes[i] == option) {
                return true;
            }
        }
        return false;
    }

    function isUnmuteable(option) {
        if (option != null && isMuted(option)) {
            return true;
        }
        return false;
    }

    function buildMuteListString() {
        var muteListString = "";
        for (var i = 0, size = muteList.length; i < size; i++) {
            muteListString += muteList[i] + " ";
        }
        return muteListString;
    }

    function isValidPrivateMessage(option, msg) {
        if (isValidMessage(msg) && option != name) {
            return true;
        }
        return false;
    }

    function getMessageFromCommand(cmds) {
        var count = cmds.length;
        var msg = "";
        for (var i = 2; i < count; i++) {
            if (i == count - 1) {
                msg += cmds[i];
            } else {
                msg += cmds[i] + " ";
            }
        }
        return msg;
    }

    function print(cssClass, name, message) {


        switch (cssClass) {
            case "you":
                document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"" + cssClass + "\" href=\"#\">" + name + "</a></div><div class=\"message-msg\"><p class=\"message-text\">" + message + "</div></div>";
                break;
            case "sender":
                document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"" + cssClass + "\" href=\"#\">" + name + "</a></div><div class=\"message-msg\"><p class=\"message-text\">" + message + "</div></div>";
                break;
            default:
                document.getElementById("messages").innerHTML += "<div class=\"message-container \"><div class=\"message-name \"><a class=\"" + cssClass + "\" href=\"#\">" + name + "</a></div><div class=\"message-msg\"><p class=\"" + cssClass + "\">" + message + "</div></div>";
                break;
        }
    }

    function updateNotificationTitle() {
        notificationCounter += 1;
        document.title = "(" + notificationCounter + ") " + "r/" + room;
    }

    function removeUserFromOnlineList(onlineUserList, userThatLeft) {

        var stringArray = onlineUserList.split(" ");
        var output = "";
        for (var i = 0, size = stringArray.length; i < size; i++) {
            if (stringArray[i] == userThatLeft) continue;
            if (stringArray[i] == "[afk]"+userThatLeft) continue;
            output += stringArray[i] + " ";
        }

        return output.trim();
    }

    function buildOnlineUserListGUI(onlineUserList) {
        var stringArray = onlineUserList.split(" ");
        var output = "<ul>";
        for (var i = 0, size = stringArray.length; i < size; i++) {
            output += "<li><a href=\"#\" class=\"username-link\">" + stringArray[i] + "</a></li>";
        }
        output += "</ul>";

        document.getElementById("onlineUserListWrapper").innerHTML = output;
    }

    function removeUserFromMutedList(username) {
        for (var i = 0, size = muteList.length; i < size; i++) {
            if (muteList[i] == username) {
                muteList.splice(i, 1);
            }
        }
    }

    function isMuted(username) {
        for (var i = 0, size = muteList.length; i < size; i++) {
            if (muteList[i] == username) {
                return true;
            }
        }
    }

    function updateOnlineUserListAfkUser(username){
        var stringArray = onlineUserList.split(" ");
        var output = "";
        for (var i = 0, size = stringArray.length; i < size; i++) {
            if(stringArray[i] == username){
                stringArray[i] = "[afk]"+username;
            }
            output += stringArray[i] + " ";
        }
        return output;
    }

    function updateOnlineUserListAfkReturnedUser(username){
        var stringArray = onlineUserList.split(" ");
        var output = "";
        for (var i = 0, size = stringArray.length; i < size; i++) {
            if(stringArray[i] == "[afk]" + username){
                stringArray[i] = username;
            }
            output += stringArray[i] + " ";
        }
        return output;
    }

    function updateOnlineUserList(json) {
        var list = "";
        for (var i in json.onlineUsers) {
            list += json.onlineUsers[i].username + " ";
        }
        return list;
    }

    function usernameExists(name, json) {

        for (var i in json.onlineUsers) {
            if (json.onlineUsers[i].username == name || json.onlineUsers[i].username == "[afk]"+name) return true;
        }

        return false;
    }
    
    function formatString(name) {
    	name = name.trim();
    	name = name.replace(/\s/g, '');
    	return name;
    }
    
    function isValidUsername(name) {
        if (name.length == 0 || name.length > 15 || name == "&nbsp;") {
            return false;
        }
        for (var i = 0, len = name.length; i < len; i++) {

            if (name.charAt(i) == ' ' || name.charAt(i) == '<' || name.charAt(i) == '#' || name.charAt(i) == '>' || name.charAt(i) == '$' || name.charAt(i) == '\'' || name.charAt(i) == '"' || name.charAt(i) == ',') {
                return false;
            }

        }
        return true;
    }

    function send() {

        var msg = document.getElementById('message-input').value;
        msg = sanitizeMessage(msg);
        if (isValidMessage(msg)) {
            msg = linkify(msg);
            ws.send(JSON.stringify({cmd:'message', body:msg, room:room, sessionId:sessionId, username:name}));
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

    function isValidMessage(msg) {
        msg = msg.trim();
        if (msg.length > 0 && msg.charAt(0) != '/')return true;
        return false;
    }

    function sanitizeMessage(msg) {

        return msg.replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#x27;");
    }

    function changeTheme(option) {

        var link = document.getElementById("theme-link");
        link.href = "../css/themes/" + option + ".css";
    }
});