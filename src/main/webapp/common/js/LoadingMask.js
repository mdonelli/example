LoadingMask = function(targetEl) {

    this.targetEl = targetEl;

    this.init();

}

LoadingMask.prototype = {

    init: function() {

        this.maskEl = $("<div></div>").attr("class", "loadingMask").hide().append($("<div></div>").attr("class","spinner"));
        $("body").append(this.maskEl);
    },

    show: function() {

        $(this.maskEl).width($(this.targetEl).outerWidth());
        $(this.maskEl).height($(this.targetEl).outerHeight());

        var offset = $(this.targetEl).offset();

        $(this.maskEl).show().offset({
            top: offset.top,
            left: offset.left
        });
    },

    hide: function() {
        $(this.maskEl).hide();
    }
}