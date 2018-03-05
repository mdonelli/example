package utils;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public abstract class Command {

    private HttpServletRequest request;

    public Command(HttpServletRequest request) {
        this.request = request;
    }

    public void execute() throws Exception {
        this.validate();
        this.executeOperation();
    }

    public void validate() throws Exception {
        Validation.validateRequest(this.getRequest(), this.getValidation());
    }

    protected abstract List<Validation> getValidation();

    protected abstract void executeOperation() throws Exception;

    public HttpServletRequest getRequest() {
        return request;
    }
}
