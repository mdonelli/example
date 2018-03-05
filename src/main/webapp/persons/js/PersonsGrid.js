function PersonsGrid() {

    var cfg = {
        renderTo: $(document.body),
        width: 900,
        height: 500,
        title: "Persons Grid",
        model: new PersonModel(),
        columns: []
    };

    Grid.call(this, cfg);
};

PersonsGrid.prototype = Object.create(Grid.prototype);

PersonsGrid.prototype.constructor = PersonsGrid;

PersonsGrid.prototype.initHandlers = function() {
    this.createRecordHandler = this.createPerson.bind(this);
    this.updateRecordHandler = this.updatePerson.bind(this);
    this.deleteRecordHandler = this.deletePerson.bind(this);
};

PersonsGrid.prototype.initListeners = function() {
    this.view.createRecordEvent.addListener(this.createRecordHandler);
    this.view.updateRecordEvent.addListener(this.updateRecordHandler);
    this.view.deleteRecordEvent.addListener(this.deleteRecordHandler);
};

PersonsGrid.prototype.createPerson = function(sender, args) {
    this.model.createPerson(args.name, args.lastName, args.oib, args.age);
};

PersonsGrid.prototype.updatePerson = function(sender, args) {
    this.model.updatePerson(args.idPerson, args.name, args.lastName, args.oib, args.age);
};

PersonsGrid.prototype.deletePerson = function(sender, args) {
    this.model.deletePerson(args.idPerson);
};