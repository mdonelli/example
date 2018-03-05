var AJAX = {

    call: function(url, params, callback) {

        $.post(url, params, function(result, status){
                if (status == "success") {
                    if (result.success == "true") {
                        var response =  result.data != null ? JSON.parse(result.data) : null;
                        callback.call(this, true, response);
                    } else {
                        callback.call(this, false, result.error);
                    }
                } else {
                    alert("Ajax request failed: " + status);
                }
        }, "json");
    }
}