<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html lang="en-US" >
<head>
  <meta charset="ISO-8859-1">
  <title>r/${room}</title>
  <meta name="description" content="old school, DOS style, secure and un-tracked chat.">
  <meta name="author" content="Chris Mepham">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="../css/bootstrap.min.css" type="text/css">
  <link rel="stylesheet" href="../css/main.css" type="text/css">
  <link id="theme-link" rel="stylesheet" href="../css/themes/dos.css" type="text/css">

  <!--[if lt IE 9]>
  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
  <![endif]-->
</head>
<body>
  <div id="room" class="hidden">${room}</div>
  <div class="main-container maintainSize">
    <div class="container ">
      <div class="row">
        <div class="col-xs-12 col-md-10 " id="messages"></div>
        <div class="col-md-2 hidden-xs hidden-sm" id="online-users">
          <h1><a href="http://socket.chat">Socket.chat</a></h1>
          <span class="online-users-room">r/${room}</span>
          <h2>Users online</h2>
          <div id="onlineUserListWrapper"></div>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 send-message"><input type="text" name="message" id="message" placeholder="message.."></div>
      </div>
  </div>
    </div>
  <!-- Latest compiled and minified JavaScript -->
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
  <script src="../js/jquery.js"></script>
  <script src="../js/client.js"></script>
</body>
</html>
