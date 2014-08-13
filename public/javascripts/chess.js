WebSocketMethods =
{
	set: function()
	{
		for(var i=0; i<arguments.length; i++)
		{
			var square = arguments[i].split('=')[0];
			var piece = arguments[i].split('=')[1];
			
			$('#' + square).empty().append('<div class="chess-piece ' + piece + '"></div>');
		}
	},
	player: function(color)
	{
		if(color == 'white')
			$('.board').removeClass('flip');
		else if(color == 'black')
			$('.board').addClass('flip');
	}
}


$(function()
{
	socket = new WebSocket(webSocketUrl);
	
	socket.onmessage = function(event)
	{
		var statements = event.data.split(';');
		
		for(var i=0; i<statements.length; i++)
		{
			var method = statements[i].split(':')[0].trim();
			var params = statements[i].split(':')[1].split(',').map(function(s) { return s.trim() });
			
			WebSocketMethods[method].apply(null, params);
		}
	};
	
	socket.onopen = function() { socket.send('setup') };
});