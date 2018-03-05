package persons;

import org.json.simple.JSONObject;
import utils.Command;
import utils.JsonConvertible;
import utils.Validation;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


public class CmdInsertPerson extends Command implements JsonConvertible{

    private Person person;

    public CmdInsertPerson(HttpServletRequest request) {
        super(request);
    }

    @Override
    protected List<Validation> getValidation() {
        return new ArrayList<>(Arrays.asList(
                new Validation("name", Validation.STRING, true),
                new Validation("lastName", Validation.STRING, true),
                new Validation("oib", Validation.STRING, false),
                new Validation("age", Validation.INTEGER, false)
        )) ;
    }

    @Override
    protected void executeOperation() throws Exception {
        this.decode();
        this.saveToDb();
    }

    protected void decode() throws Exception{
        new Person();

        String ageParam = this.getRequest().getParameter("age");
        String oibParam = this.getRequest().getParameter("oib");

        this.setPerson(new Person(
                this.getRequest().getParameter("name"),
                this.getRequest().getParameter("lastName"),
                oibParam.isEmpty() ? null : oibParam,
                ageParam.isEmpty() ? null : Integer.parseInt(ageParam)
                ));

    }

    protected void saveToDb() throws Exception {
        this.getPerson().save();
    }

    @Override
    public JSONObject getJson() {
        return this.getPerson().getJson();
    }

    protected Person getPerson() {
        return person;
    }

    protected void setPerson(Person person) {
        this.person = person;
    }
}
