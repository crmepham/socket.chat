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
    var clicked = false;
    $("#questionLarge, #questionSmall").click(function(){
    	
    	if(clicked){
    		$("html,body").animate({
        		scrollTop: $(window).scrollTop() - 800
    		},2000);
    		$("#infoContainer").hide();
        	clicked = false;
    	}else{
    		$("#infoContainer").css("display","block");
        	$("html,body").animate({
        		scrollTop: $(window).scrollTop() + 800
    		},2000);
        	clicked = true;
    	}
    	
    	
    });
    
    $("#randomize").click(function (e) {
        e.preventDefault();
        var room = makeid();
        window.location = "http://socket.chat/r/" + room + "";
    });

    function isValidRoomName(room) {
    	if (room.replace(/\s/g, '').length == 0) {
    	    return false;
    	}
        var regex = new RegExp("^([A-Za-z0-9_\ -]+)$");
        return regex.test(room);
    }

    function makeid()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
});