package utils;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public class Validation {

    public static final String STRING = "string";
    public static final String INTEGER = "integer";

    private String name;
    private String type;
    private boolean isMandatory;

    public Validation(String name, String type, boolean isMandatory) {
        this.name = name;
        this.type = type;
        this.isMandatory = isMandatory;
    }

    public static void validateRequest(HttpServletRequest request, List<Validation> validations) throws Exception {

        for (Validation validation: validations) {
            validation.validate(request.getParameter(validation.getName()));
        }

    }

    public void validate (String value) throws Exception {
        if (value == null) {
            throw new Exception ("Expected parameter not found: " + this.getName());
        }
        if (this.isMandatory && value.isEmpty()) {
            throw new Exception ("Parameter " + this.getName() + " is mandatory");
        }

        switch (this.getType()) {
            case Validation.STRING:
                this.validateString(value);
                break;
            case Validation.INTEGER:
               this.validateInteger(value);
                break;
            default:
                throw new Exception("Unknown validation type: " + this.getType());
        }
    }

    protected void validateString(String value) throws Exception {
        //no need for extra validation
    }

    protected void validateInteger(String value) throws Exception {
        if (!value.isEmpty()) {
            try {
                Integer.parseInt(value);
            } catch (Exception e) {
                throw new Exception("Cannot convert parameter " + this.getName() + " to integer");
            }
        }
    }



    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isMandatory() {
        return isMandatory;
    }

    public void setMandatory(boolean mandatory) {
        isMandatory = mandatory;
    }
}
