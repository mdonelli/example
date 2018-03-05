package persons;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import utils.Command;
import utils.JsonConvertible;
import utils.Validation;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

public class CmdLoadAllPersons extends Command implements JsonConvertible {

    private List<Person> persons;

    public CmdLoadAllPersons(HttpServletRequest request) {
        super(request);
    }

    @Override
    protected List<Validation> getValidation() {
        return new ArrayList();
    }

    @Override
    protected void executeOperation() throws Exception {
        this.setPersons(Person.loadAllPersons());
    }

    @Override
    public JSONObject getJson() {

        JSONObject json = new JSONObject();

        JSONArray persons = new JSONArray();
        this.getPersons().forEach(person -> { persons.add(person.getJson()); });

        json.put("persons", persons);

        return json;

    }

    protected List<Person> getPersons() {
        return persons;
    }

    protected void setPersons(List<Person> persons) {
        this.persons = persons;
    }
}
