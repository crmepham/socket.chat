<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<!DOCTYPE html>
<html lang="en-US">
<head>
<title>socket.chat</title>
<meta name="description"
	content="Simple, private and secure chat rooms.">
<meta name="author" content="Chris Mepham">
<meta name="keywords" content="websocket, html5, html, 5, socket, chat, http, http3, ws, wss">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://socket.chat/css/bootstrap.min.css" type="text/css">
<link rel="stylesheet" href="https://socket.chat/css/index.css" type="text/css">

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
	<div class="container">
		<div class="row">
			<div class="col-xs-12 textAlignMiddle">
				<a href="https://socket.chat"><img src="img/logo-main.gif"
					alt="websocket chat" id="logo"></a><span id="beta"></span>
				<h2>Simple, private and secure chat rooms</h2>
				<h2 class="hidden-sm hidden-md hidden-lg small-title">Welcome to socket.chat</h2>
				<h1 class="hidden-xs">Welcome to socket.chat</h1><br><br>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-12 textAlignMiddle overflowAuto">
				<form class="create-room-form hidden-sm hidden-md hidden-lg">
					<input type="text" name="room"  class="col-xs-8 create-room-name" id="create-room-name-small" 
					placeholder="create a room"><input type="submit" name="submit" class="col-xs-4 create-room-submit" value="GO">
				</form>
				<form class="create-room-form hidden-xs">
					<input type="text" name="room" class="create-room-name" id="create-room-name-large" 
					placeholder="create a room"><input type="submit" name="submit" class="create-room-submit" value="GO">
				</form>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-12 textAlignMiddle overflowAuto hidden-xs">
				<a href="#" class="button" class="randomize-button" id="randomize-large">RANDOMIZE</a>
			</div>
			<div class="col-xs-12 textAlignMiddle overflowAuto hidden-sm hidden-md hidden-lg">
				<a href="#" class="button" class="randomize-button" id="randomize">RANDOMIZE</a>
			</div>
		</div>
		<div class="row fixedRandomHeight">
			<div class="col-xs-12 textAlignMiddle overflowAuto">
				<a href="#" class="button hidden-xs moveable" id="questionLarge">?</a>
				<a href="#" class="button hidden-sm hidden-md hidden-lg moveable" id="questionSmall">?</a>
			</div>
		</div>
		
		<div class="row">
			<div class="col-xs-12 overflowAuto moveable" id="infoContainer">
				<div class="mod-border">
					<h2>What is socket.chat?</h2>
					<p>Socket.chat enables secure, private and non-tracked chat rooms. Unlike most chat room services, socket.chat doesn't make you register, doesn't
					retain your personal information or messages, and doesn't leave any cookies on your computer.</p>
				</div>
				<div class="mod-border">
					<h2>How is it "private and secure"?</h2>
					<p>Socket.chat doesn't list any rooms. You can create a room name containing any alpha-numeric characters and spaces.</p>
					<p>Socket.chat uses the encryption protocols HTTPS/WSS and a strong modern cypher suite. This ensures that the messages you send are secure from "man in the middle" attacks.
					<p>Finally, Socket.chat doesn't retain any personal information about it's users both locally or in our database. So your chat's are private, untracked and secure.</p>
				</div>
				<div class="mod-border">
					<h2>Some useful information</h2>
					<p>When in a chat room type /help for a list of commands.</p>
					<p>To report any bugs or request features please create a new issue <a href="https://github.com/final60/websocket-chat/issues">here</a>.</p>
				</div>
				<div class="col-xs-12 textAlignMiddle overflowAuto hidden-xs">
					<a href="https://socket.chat/page/benchmark" class="button benchmark" >BENCHMARK</a>
				</div>
			</div>
		</div>
	</div>
	<script
		src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	<script src="https://socket.chat/js/index.js"></script>
	<script src="https://socket.chat/js/bootstrap.min.js"></script>
</body>
</html>