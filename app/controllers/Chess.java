package controllers;

import play.libs.F.*;
import play.mvc.*;

import views.html.*;

import java.util.ArrayList;
import java.util.HashMap;

public class Chess extends Controller
{
	
	public static Result index()
	{
		return ok( chess.render() );
	}

	public static WebSocket<String> socket()
	{
		return new WebSocket<String>()
		{
			// Called when the Websocket Handshake is done.
			public void onReady(WebSocket.In<String> in, final WebSocket.Out<String> out)
			{
				Game game = new Game();
				games.put("" + count, game);
				
				session("game", "" + count++);
				
				in.onMessage(new Callback<String>()
				{
					public void invoke(String event)
					{
						if( event.equals("setup") )
						{
							out.write("set:h1=br,h2=bn,h3=bb,h4=bq,h5=bk,h6=bb,h7=bn,h8=br," +
									"g1=bp,g2=bp,g3=bp,g4=bp,g5=bp,g6=bp,g7=bp,g8=bp," +
									"a1=wr,a2=wn,a3=wb,a4=wq,a5=wk,a6=wb,a7=wn,a8=wr," +
									"b1=wp,b2=wp,b3=wp,b4=wp,b5=wp,b6=wp,b7=wp,b8=wp");
						}
						else
						{
							
						}
					}
				});

				// When the socket is closed.
				in.onClose(new Callback0()
				{
					public void invoke()
					{
						System.out.println("Disconnected");
					}
				});
			}
		};
	}
	
	
	private static class Game
	{
		
	}
	
	private static int count;
	private static HashMap<String, Game> games = new HashMap<String, Game>();
}
