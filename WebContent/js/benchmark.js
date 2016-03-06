var testing = false;

var totalStartTime = 0;
var totalElapsedTime = 0;



var totalAjaxStartTime = 0;
var totalAjaxElapsedTime = 0;

var totalAjaxRrStartTime = 0;
var totalAjaxRrElapsedTime = 0;

var totalAjaxCStartTime = 0;
var totalAjaxCElapsedTime = 0;


var individualAjaxRrTestsTime = new Array();


var totalWebsocketsStartTime = 0;
var totalWebsocketsElapsedTime = 0;

var totalWebsocketsRrStartTime = 0;
var totalWebsocketsRrElapsedTime = 0;

var totalWebsocketsCStartTime = 0;
var totalWebsocketsCElapsedTime = 0;


var individualWebsocketsRrTestsTime = new Array();

var connected = false;
var concurrencyResponseCount = 0;

$(document).ready(function(){
	$('#startTest').on('click', function(e){
		e.preventDefault();
		$(this).hide();
		startTest();
	});
});

function startTest() {
	testing = true;
	toggleLoadingIcon();
	testRequestResponse();
}

function testRequestResponse() {
	notify('Starting request/response test');
	totalStartTime = new Date();
	totalAjaxStartTime = new Date();
	totalAjaxRrStartTime = new Date();
	httpPost('start', 0);
}

function httpPost(cmd, iteration) {
	var ajaxRrStartTime = new Date();
	$.post('http://localhost:8080/websocket-chat/post', {cmd:cmd}, function(data){
		switch(data) {
		case "ready":
			// get file as string
			notify('Retreiving file');
			httpPost('file,' + (iteration+1), iteration);
			break;
		case "received":
			individualAjaxRrTestsTime[iteration] = new Date() - ajaxRrStartTime;
			if(iteration == 9) {
				totalAjaxRrElapsedTime = new Date() - totalAjaxRrStartTime;
				notify('Completed AJAX request/reponse test ' + (iteration + 1) + ' of 10');			
				testAjaxConcurrency();
			}else{
				notify('Completed AJAX request/reponse test ' + (iteration + 1) + ' of 10');			
				httpPost('start', ++iteration);
				break;
			}
		case "concurrency":
			if(iteration == 2999) {
				notify('Received AJAX response ' + (iteration + 1) + ' of 3000');
				// record total time for rr test
				//ajaxTime = new Date().getTime() - ajaxTime;
				//ajaxCTests = new Date().getTime() - ajaxCTests;
				totalAjaxCElapsedTime = new Date() - totalAjaxCStartTime;
				totalAjaxElapsedTime = new Date() - totalAjaxStartTime;
				// test websockets
				testWebSockets();
			}else{
				notify('Received AJAX response ' + (iteration + 1) + ' of 3000');
				httpPost('concurrency', ++iteration);
			}
			break;
		}
		
		if(data.indexOf('Lorem') > -1) {
			//notify('Sending file');
			httpPost('Lorem', iteration);
		}
		
	});
}

function testWebSockets() {
	notify('Starting WebSockets test');
	totalWebsocketsStartTime = new Date();
	totalWebsocketsRrStartTime = new Date();
	if(!connected){
		startWebSocket();
		connected = true;
	}
}

function startWebSocket() {
	var url = "ws://localhost:8080/websocket-chat/server";
	var socket = new WebSocket(url);
	var iteration = 0;
	var websocketsRrStartTime = new Date();
	
	socket.onopen = function (event) {
         notify('Websocket connection established');
     };

     socket.onclose = function (event) {
    	 notify('Websocket connection closed unexpectedly');
    	 connected = false;
     };

     socket.onmessage = function (event) {
         if (event.data.indexOf('ready') > -1) {
        	 notify('Retreiving file');
        	 socket.send('file,'+(iteration+1));
         }
         
         if(event.data.indexOf('Lorem') > -1) {
      		//notify('Sending file');
      		socket.send('Lorem');
      	 }
         
         if(event.data.indexOf('concurrency') > -1) {
       		concurrencyResponseCount++;
       		notify('Received response ' + (concurrencyResponseCount + 1) + ' of 3000');
       		if(concurrencyResponseCount == 2999) {
       			concurrencyResponseCount = 0;
       			totalWebsocketsCElapsedTime = new Date() - totalWebsocketsCStartTime;
       			totalWebsocketsElapsedTime = new Date() - totalWebsocketsStartTime;
       			totalElapsedTime = new Date() - totalStartTime;
       			notify('Complete Websockets concurrency test');
       			setTimeout(function(){
       				connected = false;
	       			testing = false;
	       			
	       			var ajaxTotalSeconds = (totalAjaxElapsedTime/1000) % 60;
	       			var ajaxTotalRrSeconds = (totalAjaxRrElapsedTime/1000) % 60;
	       			var ajaxTotalCSeconds = (totalAjaxCElapsedTime/1000) % 60;
	       			
	       			$('.ajaxTotalTime').empty().append(ajaxTotalSeconds.toFixed(3));
	       			$('.ajaxRrTotalTime').empty().append(ajaxTotalRrSeconds.toFixed(3));
	       			$('.ajaxCTotalTime').empty().append(ajaxTotalCSeconds.toFixed(3));
	       			
	       			var websocketsTotalSeconds = (totalWebsocketsElapsedTime/1000) % 60;
	       			var websocketsTotalRrSeconds = (totalWebsocketsRrElapsedTime/1000) % 60;
	       			var websocketsTotalCSeconds = (totalWebsocketsCElapsedTime/1000) % 60;
	       			
	       			$('.websocketTotalTime').empty().append(websocketsTotalSeconds.toFixed(3));
	       			$('.websocketRrTotalTime').empty().append(websocketsTotalRrSeconds.toFixed(3));
	       			$('.websocketCTotalTime').empty().append(websocketsTotalCSeconds.toFixed(3));
	       			
	       			var highestNumber = 0;
	       			var percentage = 0;
	       			var diff = 0;
	       			
	       			if(ajaxTotalSeconds > websocketsTotalSeconds){
	       				diff = ajaxTotalSeconds - websocketsTotalSeconds;
	       				percentage = diff / ajaxTotalSeconds * 100;
	       				
	       			}else{
	       				diff = websocketsTotalSeconds - ajaxTotalSeconds;
	       				percentage = diff / websocketsTotalSeconds * 100;
	       			}
	       			$('.totalTimeDiff').empty().append(percentage.toFixed(3));
	       			
	       			if(ajaxTotalRrSeconds > websocketsTotalRrSeconds){
	       				diff = ajaxTotalRrSeconds - websocketsTotalRrSeconds;
	       				percentage = diff / ajaxTotalRrSeconds * 100;
	       				
	       			}else{
	       				diff = websocketsTotalRrSeconds - ajaxTotalRrSeconds;
	       				percentage = diff / websocketsTotalRrSeconds * 100;
	       			}
	       			$('.rrTimeDiff').empty().append(percentage.toFixed(3));
	       			
	       			if(ajaxTotalCSeconds > websocketsTotalCSeconds){
	       				diff = ajaxTotalCSeconds - websocketsTotalCSeconds;
	       				percentage = diff / ajaxTotalCSeconds * 100;
	       				
	       			}else{
	       				diff = websocketsTotalCSeconds - ajaxTotalCSeconds;
	       				percentage = diff / websocketsTotalCSeconds * 100;
	       			}
	       			$('.cTimeDiff').empty().append(percentage.toFixed(3));
	       			
	       			toggleLoadingIcon();
	       			
       			}, 2000);
       		}
       	 }
         
         if(event.data.indexOf('received') > -1) {
      		individualWebsocketsRrTestsTime[iteration] = new Date() - websocketsRrStartTime;
      		
      		if(iteration == 9) {
      			totalWebsocketsRrElapsedTime = new Date() - totalWebsocketsRrStartTime;
      			notify('Completed websockets request/response test ' + (iteration + 1) + ' of 10');
  				// test websocket concurrency
  				testWebSocketConcurrency(socket);
      		}else{
      			notify('Completed websockets request/response test ' + (iteration + 1) + ' of 10');				
      			socket.send('start');
      			iteration++;
      		}
      	 }
     }
     
     socket.onerror = function (event) {
    	 notify(event.data);
     };
}

function testWebSocketConcurrency(socket) {
	totalWebsocketsCStartTime = new Date();
	notify('Starting concurrency test');
	for(var i = 0; i < 2999; i++) {
		socket.send('concurrency');
	}
}

function testAjaxConcurrency() {
	totalAjaxCStartTime = new Date();
	notify('Starting concurrency test');
	httpPost('concurrency', 0);
	
}

function notify(msg) {
	var notify = $('.notify');
	notify.empty();
	notify.append('<p>' + msg + '</p>');
}

function toggleLoadingIcon(){
	var spinner = $('.spinnerContainer');
	var notify = $('.notify');
	var startTest = $('#startTest');
	var resultsRow = $('.resultsRow');
	if(testing) {
		spinner.show();
		notify.show();
		startTest.hide();
		resultsRow.hide();
	}else{
		spinner.hide();
		notify.hide();
		startTest.show();
		resultsRow.fadeIn(3000);
	}
}