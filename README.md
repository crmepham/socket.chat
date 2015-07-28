# Websocket Chat (Alpha)
Chat service using Websockets.
<h3>How to use</h3>
<p>You can join of the commnutiy chat rooms by navigation to <a href="http://socket.chat">socket.chat</a> and
clicking on one of the rooms listed.</p>
<p>You can create your own private chat room using using the following URI format: socket.chat/r/ <any alpha-numeric characters and spaces>. For 
example: socket.chat/r/my private chat room</p>
<h3>Current features:</h3>
<ul>
  <li>Join any room</li>
  <li>Create any room</li>
  <li>Change theme</li>
  <li>See who else is this room</li>
  <li>Message another user in this room</li>
  <li>Mute another user in this room</li>
  <li>Chat rooms are not listed anywhere, so no one will find your chat room</li>
  <li>Message history is not stored</li>
</ul>

<h3>Chat commands:</h3>
<ul>
  <li><b>/commands</b> - displays a list of available commands</li>
  <li><b>/themes</b> - displays a list of available themes</li>
  <li><b>/theme <themename></b> - changes to specified theme</li>
  <li><b>/users</b> - displays a list of users in this chat room</li>
  <li><b>/msg /tell /t <username> <message></b> - sends a private message to specified user in this room</li>
  <li><b>/mute <username></b> - mutes specified user in this room</li>
  <li><b>/unmute <username></b> - unmutes specified user in this room</li>
  <li><b>/mutelist</b> - displays a list muted users in this room</li>
  <li><b>/rules</b> - displays a list socket.chat rules</li>
  <li><b>/clear</b> - clears the chat history</li>
</ul>

<h3>Features to add:</h3>

<p><b>General:</b></p>
<ul>
  <li><s><i>Valid username</i></s></li>
  <li><s><i>Prevent duplicate usernames</i></s></li>
  <li><s><i>Add chat rooms</i></s></li>
  <li><s><i>Add room name to page title</i></s></li>
  <li>Add unread message count to title</li>
  <li><s><i>Display online users on successful login</i></s></li>
  <li><s><i>Themes (dark, light, modern, etc.)</i></s></li>
  <li><s><i>Notify room when user joins</i></s></li>
  <li><s><i>Notify room when user leaves</i></s></li>
  <li>Implement HTTPS</li>
  <li>Implement secure websockets</li>
</ul>

<p><b>Commands:</b></p>
<ul>
  <li><s><i>Change theme</i></s></li>
  <li><s><i>Mute user</i></s></li>
  <li><s><i>Show online users</i></s></li>
  <li><s><i>Clear chat history</i></s></li>
  <li><s><i>Private message another user in this room</i></s></li>
  <li><s><i>Show rules</i></s></li>
</ul>

<p><b>Issues:</b></p>
<ul>
  <li><s><i>Allow only numbers, letters and spaces in room names</i></s></li>
  <li><s><i>Server notifies user when a user leaves a different room</i></s></li>
  <li><s><i>Online user list shows users from all rooms</i></s></li>
  <li><s><i>User unable to send message if first user in new chat room</i></s></li>
  <li><s><i>Client notifies user they have joined (redundant)</i></s></li>
  <li><s><i>Username should only be taken if in same room</i></s></li>
</ul>
