package persons;

import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import utils.JsonUtils;

public class CntrPersons extends HttpServlet {
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter output = response.getWriter();
        try {

            String type = request.getParameter("type");
            String action = request.getParameter("action");

            if ("".equals(type) || "".equals(action)) {
                throw new Exception("Invalid parameters");
            }

            switch (type) {
                case "person":

                    switch (action) {

                        case "loadAll":
                            CmdLoadAllPersons cmdLoadAll = new CmdLoadAllPersons(request);
                            cmdLoadAll.execute();
                            output.print(JsonUtils.jsonResponse(cmdLoadAll.toJsonString()));
                            break;
                        case "insert":
                            CmdInsertPerson cmdInsert = new CmdInsertPerson(request);
                            cmdInsert.execute();
                            output.print(JsonUtils.jsonResponse(cmdInsert.toJsonString()));
                            break;
                        case "update":
                            CmdUpdatePerson cmdUpdate = new CmdUpdatePerson(request);
                            cmdUpdate.execute();
                            output.print(JsonUtils.jsonResponse(cmdUpdate.toJsonString()));
                            break;
                        case "delete":
                            CmdDeletePerson cmdDelete = new CmdDeletePerson(request);
                            cmdDelete.execute();
                            output.print(JsonUtils.jsonOk());
                            break;
                        default:
                            throw new Exception("Invalid action parameter: " + action);

                    }

                    break;

                    default:
                        throw new Exception("Invalid type parameter: " + type);
            }

        } catch(Exception e) {
            output.print(JsonUtils.jsonError(e.getMessage()));
        }

    }
}