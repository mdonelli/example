var PersonController = function (model, view) {
    this.model = model;
    this.view = view;

    this.init();
};

PersonController.prototype = {

    init: function() {
        this.initHandlers();
        this.initListeners();
    },

    initHandlers: function() {
        this.createPersonHandler = this.createPerson.bind(this);
        this.updatePersonHandler = this.updatePerson.bind(this);
        this.deletePersonHandler = this.deletePerson.bind(this);
    },

    initListeners: function() {
        this.view.createPersonEvent.addListener(this.createPersonHandler);
        this.view.updatePersonEvent.addListener(this.updatePersonHandler);
        this.view.deletePersonEvent.addListener(this.deletePersonHandler);
    },

    createPerson: function(sender, args) {
        this.model.createPerson(args.name, args.lastName, args.oib, args.age);
    },

    updatePerson: function(sender, args) {
        this.model.updatePerson(args.idPerson, args.name, args.lastName, args.oib, args.age);
    },

    deletePerson: function(sender, args) {
        this.model.deletePerson(args.idPerson);
    }



}
