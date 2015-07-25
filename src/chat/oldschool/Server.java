package chat.oldschool;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint(value = "/wschat")
public class Server{

    Session userSession = null;

    //notice:not thread-safe
    private static ArrayList<Session> sessionList = new ArrayList<Session>();
    private static List<String[]> userList = new ArrayList<String[]>();


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

        int id = Integer.parseInt(session.getId());
        String userThatleft = null;

        sessionList.remove(session);

        System.out.println("here1");
        for(int i = 0, size = userList.size(); i < size; i++){

            if(Integer.parseInt(userList.get(i)[0]) == id){ //////// compile error here ///////////////
                userThatleft = userList.get(i)[1];
                userList.remove(i);
            }
        }
        System.out.println("here2");
        try{
            //asynchronous communication
            for(Session user : sessionList){
                user.getBasicRemote().sendText("{\"USERLEFT\":\""+userThatleft+"\"}");
            }

        }catch(IOException e){}
    }

    @OnMessage
    public void onMessage(String msg) throws JSONException {

        JSONObject json = new JSONObject(msg.trim());

        //userList.add(new String[]{"1","username","room1"});
        Boolean singleUser = true;
        int userId = 0;
        String jsonString = null;
        try{

            if(json.has("CMD")){
                String value = json.getString("CMD");

                switch(value){
                    case "ONLINEUSERS":

                        jsonString = buildOnlineUserListJson(userList);
                        singleUser = true;
                        userId = Integer.parseInt(json.getString("SESSIONID"));
                        break;
                    case "ADDUSER":

                        userList.add(new String[]{json.getString("SESSIONID"), json.getString("USERNAME"), json.getString("ROOM")});
                        userId = Integer.parseInt(json.getString("SESSIONID"));
                        jsonString = "{\"RSP\":\"WELCOME\"}";
                        singleUser = true;
                        System.out.print("here1");
                        break;
                }
            }

            // send to one user or all users
            if(singleUser){

                for(Session user : sessionList){
                    if(Integer.parseInt(user.getId()) == userId){
                        user.getBasicRemote().sendText(jsonString);
                        System.out.print("here2");
                        break;
                    }
                }

            }else{

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
