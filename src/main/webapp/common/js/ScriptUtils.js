function createContainer(config) {
    var div = $("<div></div>");
    if (config != null) {
        $.each(config, function(attribute, value) {
            $(div).attr(attribute, value);
        });
    }

    return div;
};