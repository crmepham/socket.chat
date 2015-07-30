$(document).ready( function(){
    $("#create-room-name").focus();

    $("#create-room-form").submit(function(e){
        e.preventDefault();
       var room = $("#create-room-name").val();
        window.location = "http://socket.chat/r/"+room+"";
    });
});