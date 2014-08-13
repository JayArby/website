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

function dragPieceStart(event)
{
	socket.send( this.parent().attr('id') );
	
	var sz = this.width();
	
	this.parent().addClass('hover valid home');
	
	$('body').append( this.width(sz).height(sz).css('pointer-events', 'none') );
	dragPiece.call(this, event);
}

function dragPiece(event)
{
	var sz = this.width();
	
	this.css( {left: event.clientX-sz/2, top: event.clientY-sz*2/3} );
}

function dropPiece(event)
{
	var target = $('.board-square.hover.valid');
	
	if(target.length == 1)
		target.append( this.removeAttr('style') );
	else
		$('.board-square.home').append( this.removeAttr('style') );
	
	$('.board-square').removeClass('hover valid home');
}

function hoverSquare(event)
{
	$('.board-square.hover').removeClass('hover');
	this.addClass('hover');
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
	
	
	$(document).on('mousedown', '.chess-piece', function(event)
	{
		if(event.button != 0)
			return;
		
		window.drag = $(this);
		
		var dragHandler = dragPieceStart;
		
		$(document).on('mousemove', function(e)
		{
			e.preventDefault();
			e.stopPropagation();
			
			dragHandler.call(window.drag, e);
			dragHandler = dragPiece;
		});
		
		$(document).one('mouseup', function(e)
		{
			dropPiece.call(window.drag, e);
			delete window.drag;
			$(document).off('mousemove');
		});
	})
	
	$(document).on('mouseenter', '.board-square', function(event)
	{
		if(!window.drag)
			return;
		
		hoverSquare.call( $(this), event );
	})
});