$(document).ready(function () {
    $("#create-room-name").focus();

    $("#create-room-form").submit(function (e) {
        e.preventDefault();
        var room = $("#create-room-name").val();
        if (isValidRoomName(room)) {
            window.location = "http://socket.chat/r/" + room + "";
        } else {
            alert("Unable to create room\nPermitted characters: A-Z, a-z, 0-9, _, - and space.");
        }


    });

    function isValidRoomName(room) {
        var regex = new RegExp("^([A-Za-z0-9_\ -]+)$");
        return regex.test(room);
    }
});