package chat.socket;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;

@WebServlet("/post")
public class PostController extends HttpServlet{
	
	private static final long serialVersionUID = 1L;

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String cmd = req.getParameter("cmd");
		
		PrintWriter out = resp.getWriter();
		if(cmd != null) {
			switch(cmd) {
			case "start":
				out.append("ready");
				break;
			
			case "concurrency":
				out.append("concurrency");
				break;
			}
			
			
			if(cmd.contains("file")) {
				String iteration = cmd.split(",")[1];
				String absoluteDiskPath = getServletContext().getRealPath("/resources/file"+iteration+".txt");
				String contents = FileUtils.readFileToString(new File(absoluteDiskPath));
				out.append(contents);
			}
			
			if(cmd.contains("Lorem")) {
				out.append("received");
			}
		}
		out.close();
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		super.doGet(req, resp);
	}
}
