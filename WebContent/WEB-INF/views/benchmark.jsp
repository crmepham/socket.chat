<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<!DOCTYPE html>
<html lang="en-US">
<head>
<title>socket.chat</title>
<meta name="description"
	content="Websocket benchmarking test">
<meta name="author" content="Chris Mepham">
<meta name="keywords" content="websocket, html5, html, 5, socket, chat, http, http3, ws, wss">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://socket.chat/css/bootstrap.min.css" type="text/css">
<link rel="stylesheet" href="http://localhost:8080/websocket-chat/css/benchmark.css" type="text/css">

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
			<div class="col-md-12 centerText header">
				<h1>AJAX HTTP POST vs HTML5 Websocket API</h1>
			</div>
		</div>
		<div class="row paddingTop">
			
			<div class="col-md-12 centerText testContainer">
				<a href="#" class="button" class="randomize-button" id="startTest">START TEST</a>
				<div class="notify"></div>
				<div class="spinnerContainer"><img class="spinner" src="../img/loading.gif" alt="loading..."></div>
			</div>
		</div>
		<div class="row paddingTop resultsRow">
			<h1>Results</h1><br><br>
		</div>
		<div class="row resultsRow">
			<div class="col-md-4 resultsColumn">
				<h3>AJAX</h3>
				<p>Completed all tests in <b><span class=" ajaxTotalTime"></span></b>s</p>
				<p>Request/reponse tests took <b><span class=" ajaxRrTotalTime"></span></b>s</p>
				<p>Concurrency tests took <b><span class=" ajaxCTotalTime"></span></b>s</p>
			</div>
			<div class="col-md-4 resultsColumn">
				<h3>Differences</h3>
				<p><b><span class=" totalTimeDiff"></span>%</b></p>
				<p><b><span class=" rrTimeDiff"></span>%</b></p>
				<p><b><span class=" cTimeDiff"></span>%</b></p>
			</div>
			<div class="col-md-4 resultsColumn">
				<h3>WebSockets</h3>
				<p>Completed all tests in <b><span class=" websocketTotalTime"></span></b>s</p>
				<p>Request/reponse tests took <b><span class=" websocketRrTotalTime"></span></b>s</p>
				<p>Concurrency tests took <b><span class=" websocketCTotalTime"></span></b>s</p>
			</div>
		</div>
	</div>


	<script
		src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	<script src="http://localhost:8080/websocket-chat/js/benchmark.js"></script>
	<script src="https://socket.chat/js/bootstrap.min.js"></script>
</body>
</html>