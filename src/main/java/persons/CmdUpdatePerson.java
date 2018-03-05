package persons;

import utils.Validation;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public class CmdUpdatePerson extends CmdInsertPerson {

    public CmdUpdatePerson(HttpServletRequest request) {
        super(request);
    }

    @Override
    protected List<Validation> getValidation() {
        List<Validation> validation = super.getValidation();
        validation.add(new Validation("idPerson", Validation.INTEGER, true));
        return validation;

    }

    @Override
    protected void decode() throws Exception{
        super.decode();
        this.getPerson().setIdPerson(Integer.parseInt(this.getRequest().getParameter("idPerson")));
    }
}
