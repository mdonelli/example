FieldValidation = {

    invalidCss: "invalidField",

    create: function(el, css) {

        var element = (el instanceof jQuery) ? el.get(0) : el;
        var field = (el instanceof jQuery) ? el : $(el);

        var cssName = (css || this.invalidCss);

        //get whether the field is valid or not. calling isValid on field without validator property will cause exception.
        element.isValid = function() {
            return (this.validator(field.val()) === true);
        };

        //return the result of validator function and set invalidCss on the field.
        element.validate = function() {

           var result = this.validator(field.val());

           if (result === true) {
                field.removeClass(cssName);
           } else {
                field.addClass(cssName);
           }

           return result;
        };

        //bind validation check to input field event
        if (field.attr("type") === "text") {
        field.on('input', function() {
            element.validate(field.val());
        });
        }
    }
};
