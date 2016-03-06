package chat.socket;
import org.apache.commons.io.FileUtils;
import org.json.JSONException;
import org.json.JSONObject;

import dao.DAO;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint(value = "/server")
public class Server{
	
	private static ArrayList<Session> sessionList = new ArrayList<Session>();
	private static List<String[]> userList = new ArrayList<String[]>();

	@OnError
	public void onError(Session session, Throwable t) {
		sessionList.remove(session);
		t.printStackTrace();
	}

	@OnOpen
	public void onOpen(Session session) {
		try {
			sessionList.add(session);
			session.setMaxIdleTimeout(43200000);
			session.getBasicRemote().sendText("ready");
			
		} catch (IOException e) {
		}
	}

	@OnClose
	public void onClose(Session session) {
		sessionList.remove(session);
	}

	@OnMessage
	public void onMessage(String msg) throws JSONException {
		
		String output = "";
		if(msg.contains("file")) {
			String iteration = msg.split(",")[1];
			try {
				URL resource = getClass().getResource("/");
				String path = resource.getPath();
				String absoluteDiskPath = path + "../../resources/file"+iteration+".txt";
				output = FileUtils.readFileToString(new File(absoluteDiskPath));
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
		if(msg.contains("Lorem")) {
			output = "received";
		}
		
		if(msg.equals("start")) {
			output = "ready";
		}
		
		if(msg.equals("concurrency")) {
			output = "concurrency";
		}
		
		for (int i = 0, size = sessionList.size(); i < size; i++) {
			try {
				sessionList.get(i).getBasicRemote().sendText(output);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}