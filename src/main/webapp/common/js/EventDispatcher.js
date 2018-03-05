var Event = function (sender) {
    this.sender = sender;
    this.listeners = [];
}

Event.prototype = {

    addListener: function (listener) {
        this.listeners.push(listener);
    },

    notify: function (args) {
        for (var i = 0; i < this.listeners.length; i += 1) {
            this.listeners[i](this.sender, args);
        }
    },

    removeAllListeners: function() {
        this.listeners = [];
    }

}