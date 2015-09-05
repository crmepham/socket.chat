package chat.oldschool;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint(value = "/server")
public class Server{

    //notice:not thread-safe
    private static ArrayList<Session> sessionList = new ArrayList<Session>();
    private static List<String[]> userList = new ArrayList<String[]>();

    @OnError
    public void onError(Session session, Throwable t){
        sessionList.remove(session);
    }


    @OnOpen
    public void onOpen(Session session){
        try{
            // add new user to list of users
            sessionList.add(session);

            // send new user their session id
            session.getBasicRemote().sendText("{\"sessionId\":\""+ session.getId() +"\"}");


        }catch(IOException e){}
    }

    @OnClose
    public void onClose(Session session){

        String id = session.getId();
        String userThatleft = null;
        String userThatLeftRoom = null;

        sessionList.remove(session);

        for(int i = 0, size = userList.size(); i < size; i++){

            if(userList.get(i)[0].equals(id)){
                userThatleft = formatIfUserWasAfk(userList.get(i)[1]);
                userThatLeftRoom = userList.get(i)[2];
                userList.remove(i);
                break;
            }
        }

        try{

            for(int j = 0, jsize = userList.size(); j<jsize; j++) {
                if(!userList.get(j)[2].equals(userThatLeftRoom)) continue;
                sessionList.get(j).getBasicRemote().sendText("{\"userLeft\":\""+userThatleft+"\"}");
            }

        }catch(Exception e){}
    }

    @OnMessage
    public void onMessage(String msg) throws JSONException {

        JSONObject json = new JSONObject(msg.trim());

        //userList.add(new String[]{"1","username","room1"});
        Boolean broadcast = false;
        String userId = "-1";
        String room = null;
        String jsonString = null;

        try {
            if (json.has("cmd")) {
                switch (json.getString("cmd")) {
                    case "userLeft":
                        jsonString = "{\"userLeft\":\"" + json.getString("userLeftName") + "\"}";
                        room = json.getString("room");
                        broadcast = true;
                        break;
                    case "ping":
                        // no action necessary
                        // client pings server to keep session alive
                        // needs testing
                        break;
                    case "message":
                        jsonString = "{\"message\":\"" + json.getString("body") + "\",\"username\":\"" + json.getString("username") + "\",\"sessionIdMessage\":\"" + json.getString("sessionId") + "\"}";
                        userId = json.getString("sessionId");
                        room = json.getString("room");
                        broadcast = true;
                        break;
                    case "onlineUsers":
                        room = json.getString("room");
                        jsonString = buildOnlineUserListJson(userList, room);
                        userId = json.getString("sessionId");
                        broadcast = false;
                        break;
                    case "addUser":
                        userList.add(new String[]{json.getString("sessionId"), json.getString("username"), json.getString("room")});
                        jsonString = "{\"rsp\":\"welcome\"}";
                        userId = json.getString("sessionId");
                        broadcast = false;
                        break;
                    case "notifyOfNewUser":
                        String username = json.getString("username");
                        jsonString = "{\"notifyOfNewUser\":\"" + username + "\"}";
                        room = json.getString("room");
                        userId = json.getString("sessionId");
                        broadcast = true;
                        break;
                    case "messageUser":
                        jsonString = "{\"messageUser\":\"" + json.getString("pm") + "\",\"from\":\"" + json.getString("from") + "\"}";
                        userId = getIdFromUsername(json.getString("to"));
                        room = json.getString("room");
                        broadcast = false;
                        break;
                    case "notifyOfAfkUser":
                        updateUserListAfk("add", json.getString("username"));
                        jsonString = "{\"notifyOfAfkUser\":\""+ json.getString("username") +"\"}";
                        userId = json.getString("sessionId");
                        room = json.getString("room");
                        broadcast = true;
                        break;
                    case "notifyOfAfkReturnedUser":
                        updateUserListAfk("remove", json.getString("username"));
                        jsonString = "{\"notifyOfAfkReturnedUser\":\""+ json.getString("username") +"\"}";
                        userId = json.getString("sessionId");
                        room = json.getString("room");
                        broadcast = true;
                        break;
                }
            }

                // send to one user or all users in this room
                if (jsonString != null) {
                    if (broadcast) {

                        for (int j = 0, jsize = userList.size(); j < jsize; j++) {
                            if (!userList.get(j)[2].equals(room)) continue; // not in this room
                            if (json.getString("cmd").equals("notifyOfNewUser") && userList.get(j)[0].equals(userId)) continue; // don't notify myself that I joined
                            sessionList.get(j).getBasicRemote().sendText(jsonString);
                        }

                    } else {
                        for (int i = 0, size = sessionList.size(); i < size; i++) {
                            if (!sessionList.get(i).getId().equals(userId)) continue;
                            sessionList.get(i).getBasicRemote().sendText(jsonString);
                            break;
                        }
                    }
                }


        }catch(IOException e){}
    }

    private String formatIfUserWasAfk(String username){
        return (username.charAt(0) == '[') ? username.substring(5): username;
    }

    private void updateUserListAfk(String action, String username){
        for(int i = 0, size = userList.size(); i<size; i++){

            if(userList.get(i)[1].equals(username)) {
                if (action.equals("add")) {
                    userList.get(i)[1] = "[afk]" + userList.get(i)[1];
                    break;

                }
                if (action.equals("remove")) {
                    userList.get(i)[1] = userList.get(i)[1].substring(0, 5) + username;
                    break;

                }
            }
        }
    }

    private String getIdFromUsername(String username){
        for(int i = 0, size = userList.size(); i<size; i++){
            if(userList.get(i)[1].equals(username)) return userList.get(i)[0];
        }
        return "-1";
    }

    private String buildOnlineUserListJson(List<String[]> list, String room){
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\"onlineUsers\":");
        sb.append("[");

        for(int i = 0, size = list.size(); i <size; i++){

            String[] user = list.get(i);
            if(!user[2].equals(room)) continue;

                if(i == size-1){
                    sb.append("{\"sessionId\":\"" + user[0] + "\",\"username\":\"" + user[1] + "\",\"room\":\"" + user[2] + "\"}");
                }else{
                    sb.append("{\"sessionId\":\"" + user[0] + "\",\"username\":\"" + user[1] + "\",\"room\":\"" + user[2] + "\"},");
                }
        }

        sb.append("]}");
        return sb.toString();
    }
}
