<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en-US">
<head>
    <title>r/${room}</title>
    <meta name="description" content="Simple, private and secure chat rooms.">
    <meta name="author" content="Chris Mepham">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://socket.chat/css/bootstrap.min.css" type="text/css">
    <link rel="stylesheet" href="https://socket.chat/css/main.css" type="text/css">
    <link id="theme-link" rel="stylesheet" href="https://socket.chat/css/themes/dos.css" type="text/css">

<!--  favicons -->

<link rel="apple-touch-icon" sizes="57x57" href="https://socket.chat/img/icons/apple-touch-icon-57x57.png">
<link rel="apple-touch-icon" sizes="60x60" href="https://socket.chat/img/icons/apple-touch-icon-60x60.png">
<link rel="apple-touch-icon" sizes="72x72" href="https://socket.chat/img/icons/apple-touch-icon-72x72.png">
<link rel="apple-touch-icon" sizes="76x76" href="https://socket.chat/img/icons/apple-touch-icon-76x76.png">
<link rel="apple-touch-icon" sizes="114x114" href="https://socket.chat/img/icons/apple-touch-icon-114x114.png">
<link rel="apple-touch-icon" sizes="120x120" href="https://socket.chat/img/icons/apple-touch-icon-120x120.png">
<link rel="apple-touch-icon" sizes="144x144" href="https://socket.chat/img/icons/apple-touch-icon-144x144.png">
<link rel="apple-touch-icon" sizes="152x152" href="https://socket.chat/img/icons/apple-touch-icon-152x152.png">
<link rel="apple-touch-icon" sizes="180x180" href="https://socket.chat/img/icons/apple-touch-icon-180x180.png">
<link rel="icon" type="image/png" href="https://socket.chat/img/icons/favicon-32x32.png" sizes="32x32">
<link rel="icon" type="image/png" href="https://socket.chat/img/icons/favicon-194x194.png" sizes="194x194">
<link rel="icon" type="image/png" href="https://socket.chat/img/icons/favicon-96x96.png" sizes="96x96">
<link rel="icon" type="image/png" href="https://socket.chat/img/icons/android-chrome-192x192.png" sizes="192x192">
<link rel="icon" type="image/png" href="https://socket.chat/img/icons/favicon-16x16.png" sizes="16x16">
<link rel="manifest" href="https://socket.chat/img/icons/manifest.json">
<link rel="shortcut icon" href="https://socket.chat/img/icons/favicon.ico">
<meta name="apple-mobile-web-app-title" content="socket.chat">
<meta name="application-name" content="socket.chat">
<meta name="msapplication-TileColor" content="#2b5797">
<meta name="msapplication-TileImage" content="https://socket.chat/img/icons/mstile-144x144.png">
<meta name="msapplication-config" content="https://socket.chat/img/icons/browserconfig.xml">
<meta name="theme-color" content="#ffffff">

    <!--[if lt IE 9]>
    <script src="https://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
</head>
<body>
<div id="room" class="hidden">${room}</div>
<div class="maintainSize" id="main-container">
    <div class="container fullHeight">
        <div class="row heightTop">
            <div class="col-xs-12 col-md-10" id="messages"></div>
            <div class="col-md-2 hidden-xs hidden-sm" id="online-users">
            	<div class="mod-border" id="room-name">
                <h1><a class="header" href="https://socket.chat"><img id="logo-icon" src="https://socket.chat/img/logo-main.gif" alt="socket.chat"></a></h1>
                <span class="online-users-room">r/${room}</span>
                </div>
                <br>
                <div class="mod-border">
                <h2>Notifications</h2>
                <p class="checkboxText"><input type="checkbox" id="timeStampCheckbox" onclick="checkTimestamp()"> Timestamps</p>
                <p class="checkboxText"><input type="checkbox" id="chatAlertCheckbox" onclick="checkTimestamp()"><span class="moveUp"> Chat alert</span></p>
                <p class="checkboxText"><input type="checkbox" id="pmAlertCheckbox" onclick="checkTimestamp()"><span class="moveUp"> PM Alert</span></p>
                <audio controls id="audio">
                	<source src="https://socket.chat/audio/chat-notification.mp3" type="audio/mpeg">
                	<source src="https://socket.chat/audio/chat-notification.wav" type="audio/wav">
                	<source src="https://socket.chat/audio/chat-notification.ogg" type="audio/ogg">
                </audio>
                </div>
                <br>
                <div class="mod-border">
                <h2>Change theme</h2>
                <select id="theme-selector">
                    <option value="dos" selected>dos</option>
                    <option value="doslight">doslight</option>
                </select>
                </div>
                <br>
                <div class="mod-border">
                <h2>Users online</h2>

                <div id="onlineUserListWrapper"></div>
                </div>
                <br>
                <div class="mod-border add"><!--  rejected by google for not enough text content on client webpage -->
                	<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
					<!-- socket.chat -->
					<ins class="adsbygoogle"
					     style="display:block"
					     data-ad-client="ca-pub-7691057862525139"
					     data-ad-slot="5051281206"
					     data-ad-format="auto"></ins>
					<script>
					(adsbygoogle = window.adsbygoogle || []).push({});
					</script>
                </div>
            </div>
        </div>
        <div class="row heightBottom">
            <div class="col-xs-12 no-padding " id="send-message">
                <input type="text" name="message-input" id="message-input" placeholder="message..">
            </div>
        </div>
    </div>
</div>
<!-- Latest compiled and minified JavaScript -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script src="https://socket.chat/js/client.js"></script>
</body>
</html>
