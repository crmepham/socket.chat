<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en-US" >
<head>
  <meta charset="ISO-8859-1">
  <title>socket.chat</title>
  <meta name="description" content="Simple, private and secure chat rooms.">
  <meta name="author" content="Chris Mepham">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="css/bootstrap.min.css" type="text/css">
  <link rel="stylesheet" href="css/index.css" type="text/css">

  <!--[if lt IE 9]>
  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
  <![endif]-->
</head>
<body>
<div class="container">
  <div class="row">
    <div class="col-xs-0 col-md-1"></div>
    <div class="intro col-xs-12 col-md-10 center padding-top">
      <h1 class="hidden-xs">Welcome to socket.chat</h1>
      <h2 class="hidden-sm hidden-md hidden-lg small-title">Welcome to socket.chat</h2>
      <h2>Simple, private and secure chat rooms</h2>
      <br><br>
      <form id="create-room-form">
        <input type="text" name="room" id="create-room-name" placeholder="create a room"><input type="submit" name="submit" id="create-room-submit" value="go to room">
      </form>
      <br><br><br>
      <form id="random-room-form">
        <input type="submit" name="submit" id="random-room-submit" value="Send me to a random room">
      </form>
      <br><br>
      <h3>or join one of the community chat rooms</h3><br>
      <p><a href="http://socket.chat/r/lobby">r/lobby</a>, <a href="http://socket.chat/r/sports">r/sports</a>, <a href="http://socket.chat/r/music">r/music</a>, <a href="http://socket.chat/r/technology">r/technology</a>, <a href="http://socket.chat/r/programming">r/programming</a>, <a href="http://socket.chat/r/games">r/games</a>, <a href="http://socket.chat/r/meta">r/meta</a>, <a href="http://socket.chat/r/education">r/education</a></p>
      <br><br><br>
      <p>In a chat room type /help for a list of commands</p>
      <p>No message data is stored.</p>
      <p>This software is free for anyone to copy and redistribute.</p>
      <p>Github: <a href="https://github.com/final60/websocket-chat">https://github.com/final60/websocket-chat</a></p>
    </div>
    <div class="col-xs-0 col-md-1"></div>
  </div>
</div>
<!-- Latest compiled and minified JavaScript -->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script src="js/index.js"></script>
</body>
</html>