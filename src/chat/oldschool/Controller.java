package chat.oldschool;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class HomeController
 * Used to controller data flow from models to view
 * used for view navigation
 */
@WebServlet("/Controller")
public class Controller extends HttpServlet {

    // class fields
    private static final long serialVersionUID = 1L;
    private static final String views = "/WEB-INF/views/";

    public Controller(){

    }

    // used to handle any get requests i.e. webpage navigation
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String view = "index.jsp";
        String room = "";

        if(request.getParameterMap().containsKey("r")){
            room = request.getParameter("r");
            view = "client.jsp";
        }

        // add parameter to request scope
        request.setAttribute("room", room);

        // redirect to desired webpage and forward request attributes
        RequestDispatcher rd = getServletContext().getRequestDispatcher(views + view);
        rd.forward(request, response);
    }
}














