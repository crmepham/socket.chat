<i>Note: The server code was re-written in node.js and migrated to <a href="https://github.com/final60/socket.chat.server" alt="socket.chat.server">this repository</a>.</i>

# socket.chat 
<h3>What is socket.chat?</h3>

Socket.chat enables secure, private and non-tracked chat rooms. Unlike most chat room services, socket.chat doesn't make you register, doesn't retain your personal information or messages, and doesn't leave any cookies on your computer.

<h3>How is it "private and secure"?</h3>

Socket.chat doesn't list any rooms. You can create a room name containing any alpha-numeric characters and spaces.

Socket.chat uses the encryption protocols HTTPS/WSS and a strong modern cypher suite. This ensures that the messages you send are secure from "man in the middle" attacks.

Finally, Socket.chat doesn't retain any personal information about it's users both locally or in our database. So your chat's are private, untracked and secure.

<h3>Current features:</h3>
<ul>
  <li>Join any room</li>
  <li>Create any room</li>
  <li>Change theme</li>
  <li>See who else is in this room</li>
  <li>Message another user in this room</li>
  <li>Mute another user in this room</li>
  <li>Chat rooms are not listed anywhere, so no one will find your chat room</li>
  <li>HTTPS and WSS encryption</li>
  <li>Message history is not stored</li>
  <li>Clickable links</li>
  <li>Message notification in title</li>
  <li>Toggle display message timestamps</li>
  <li>Auto AFK toggle after 15 minutes</li>
  <li>Message timestamps</li>
  <li>Audio notification of new chat message</li>
  <li>Audio notification of new private message</li>
</ul>

<h3>Chat commands:</h3>
<ul>
  <li><b>/help</b> - displays a list of available commands</li>
  <li><b>/chatnotify</b> - audio notification of new chat message</li>
  <li><b>/pmnotify</b> - audio notification of new private message</li>
  <li><b>/themes</b> - displays a list of available themes</li>
  <li><b>/theme #themename#</b> - changes to specified theme</li>
    <li><b>/timestamp</b> - toggle message timestamp display</li>
  <li><b>/users</b> - displays a list of users in this chat room</li>
  <li><b>/tell #username# <message></b> - sends a private message to specified user in this room</li>
  <li><b>/mute #username#</b> - mutes specified user in this room</li>
  <li><b>/unmute #username#</b> - unmutes specified user in this room</li>
  <li><b>/mutelist</b> - displays a list muted users in this room</li>
  <li><b>/rules</b> - displays a list socket.chat rules</li>
  <li><b>/clear</b> - clears the chat history</li>
  <li><b>UP ARROW</b> - gets last message sent</li>
  <li><b>TAB</b> - gets last user you private messaged</li>
</ul>
