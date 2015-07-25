package chat.oldschool;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint(value = "/wschat")
public class Server{

    Session userSession = null;

    //notice:not thread-safe
    private static ArrayList<Session> sessionList = new ArrayList<Session>();
    private static List<String[]> userList = new ArrayList<String[]>();

    @OnError
    public void onError(Session session, Throwable t){
        sessionList.remove(session);
    }


    @OnOpen
    public void onOpen(Session session){
        this.userSession = session;
        try{
            // add new user to list of users
            sessionList.add(session);

            // send new user their session id
            session.getBasicRemote().sendText("{\"SESSIONID\":\""+ session.getId() +"\"}");

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
                userThatleft = userList.get(i)[1];
                userThatLeftRoom = userList.get(i)[2];
                userList.remove(i);
                break;
            }
        }

        try{

            for(int j = 0, jsize = userList.size(); j<jsize; j++) {
                if(!userList.get(j)[2].equals(userThatLeftRoom)) continue;
                sessionList.get(j).getBasicRemote().sendText("{\"USERLEFT\":\""+userThatleft+"\"}");
            }

        }catch(Exception e){}
    }

    @OnMessage
    public void onMessage(String msg) throws JSONException {

        JSONObject json = new JSONObject(msg.trim());

        //userList.add(new String[]{"1","username","room1"});
        Boolean broadcast = false;
        int userId = 0;
        String room = null;
        String jsonString = null;

        try{

            if(json.has("CMD")){
                String value = json.getString("CMD");

                switch(value){
                    case "USERLEFT":
                        jsonString = "{\"USERLEFT\":\""+json.getString("USERLEFTNAME")+"\"}";
                        room = json.getString("ROOM");
                        broadcast = true;
                        break;
                    case "PING":
                        // no action necessary
                        // client pings server to keep session alive
                        // needs testing
                        break;
                    case "MESSAGE":
                        jsonString = "{\"MESSAGE\":\""+json.getString("BODY")+"\",\"USERNAME\":\""+json.getString("USERNAME")+"\"}";
                        userId = Integer.parseInt(json.getString("SESSIONID"));
                        room = json.getString("ROOM");
                        broadcast = true;
                        break;
                    case "ONLINEUSERS":

                        jsonString = buildOnlineUserListJson(userList);
                        userId = Integer.parseInt(json.getString("SESSIONID"));
                        broadcast = false;
                        break;
                    case "ADDUSER":

                        userList.add(new String[]{json.getString("SESSIONID"), json.getString("USERNAME"), json.getString("ROOM")});
                        jsonString = "{\"RSP\":\"WELCOME\"}";
                        userId = Integer.parseInt(json.getString("SESSIONID"));
                        broadcast = false;
                        break;
                    case "NOTIFYOFNEWUSER":
                        String username = json.getString("USERNAME");
                        jsonString = "{\"NOTIFYOFNEWUSER\":\""+username+"\"}";
                        room = json.getString("ROOM");
                        broadcast = true;
                        break;
                }
            }

            // send to one user or all users in this room
            if(jsonString != null){
                if(broadcast){

                    for(int j = 0, jsize = userList.size(); j<jsize; j++) {
                        if(!userList.get(j)[2].equals(room)) continue;
                        sessionList.get(j).getBasicRemote().sendText(jsonString);
                    }

                }else{

                    for(Session user : sessionList){
                        if(Integer.parseInt(user.getId()) == userId){
                            user.getBasicRemote().sendText(jsonString);
                            break;
                        }
                    }
                }
            }
        }catch(IOException e){}
    }

    private String buildOnlineUserListJson(List<String[]> list){
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\"ONLINEUSERS\":");
        sb.append("[");

        for(int i = 0, size = list.size(); i <size; i++){

            String[] user = list.get(i);

                if(i == size-1){
                    sb.append("{\"SESSIONID\":\"" + user[0] + "\",\"USERNAME\":\"" + user[1] + "\",\"ROOM\":\"" + user[2] + "\"}");
                }else{
                    sb.append("{\"SESSIONID\":\"" + user[0] + "\",\"USERNAME\":\"" + user[1] + "\",\"ROOM\":\"" + user[2] + "\"},");
                }
        }

        sb.append("]}");
        return sb.toString();
    }
}
