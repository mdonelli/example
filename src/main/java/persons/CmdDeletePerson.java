package persons;

import utils.Command;
import utils.Validation;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CmdDeletePerson extends Command {

    public CmdDeletePerson(HttpServletRequest request) {
        super(request);
    }

    @Override
    protected List<Validation> getValidation() {
        return new ArrayList<>(Arrays.asList(
                new Validation("idPerson", Validation.INTEGER, true)
        ));
    }

    @Override
    protected void executeOperation() throws Exception {
        Person.deletePersonById(Integer.parseInt(this.getRequest().getParameter("idPerson")));
    }

}
