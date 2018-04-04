function PersonView(model) {

    this.model = model;
    this.createPersonEvent = new Event(this);
    this.updatePersonEvent = new Event(this);
    this.deletePersonEvent = new Event(this);

    this.init();
}

PersonView.prototype = {

    // init

    init: function() {
        this.initHandlers();
        this.initListeners();
        this.createTableHeader();
        this.createLoadingMask();
    },

    initHandlers: function() {
        this.newPersonBtnHandler = this.newPersonBtnEvent.bind(this);
        this.createPersonBtnHandler = this.createPersonBtnEvent.bind(this);
        this.editPersonBtnHandler = this.editPersonBtnEvent.bind(this);
        this.deletePersonBtnHandler = this.deletePersonBtnEvent.bind(this);
        this.selectPersonEventHandler = this.selectPersonEvent.bind(this);
        this.personsListChangedHandler = this.refreshPersonList.bind(this);
        this.modelLoadingHandler = this.onModelLoad.bind(this);
    },

    initListeners: function() {
        $("#newPersonBtn").click(this.newPersonBtnHandler);
        $("#deletePersonBtn").click(this.deletePersonBtnHandler);

        this.model.recordsChangeEvent.addListener(this.personsListChangedHandler);
        this.model.loadEvent.addListener(this.modelLoadingHandler);
    },

    createTableHeader: function() {
        $("#personsTableHeader").append(this.buildHeaderRow());
    },

    createLoadingMask() {
        this.mask = new LoadingMask($("#mainContainer"));
    },

    buildHeaderRow: function() {

        var items = [
            this.buildHeaderColumn("Name"),
            this.buildHeaderColumn("Last Name"),
            this.buildHeaderColumn("OIB"),
            this.buildHeaderColumn("Age")
        ];

        var row = $("<tr></tr>").append(items);

        return row;
    },

    buildHeaderColumn: function(text) {
        return $("<th></th>").attr("class", "gridTableHeaderColumn").text(text);
    },

    // load / refresh

    onModelLoad: function() {
        this.mask.show();
    },

    refreshPersonList: function(sender, args) {

        $("#personDetailsDiv").empty();
        this.disableDeleteBtn();

        this.createPersonsTableRows();
        this.updateTableHeaderWidth();

        this.mask.hide();
    },

    createPersonsTableRows: function() {

        var tableBody = $("#personsTableBody");
        tableBody.empty();

        var me = this;

        jQuery.each(this.model.getData(), function(index, personData) {
            tableBody.append(me.buildPersonRow(personData));
        });
    },

    buildPersonRow: function(personData) {

        var me = this;

        var items = [
            this.buildTableColumn(personData.name),
            this.buildTableColumn(personData.lastName),
            this.buildTableColumn(personData.oib),
            this.buildTableColumn(personData.age)
        ];

        var row = $("<tr></tr>").attr("class","gridTableRow").on("click", {idPerson: personData.idPerson}, this.selectPersonEventHandler).append(items);

        return row;
    },

    buildTableColumn: function(text) {
        return $("<td></td>").attr("class", "gridTableColumn").text(text);
    },

    updateTableHeaderWidth: function() {
        $("#personsTableHeader").width($("#personsTableBody").innerWidth());
    },

    // insert

    newPersonBtnEvent: function() {
        $("#personDetailsDiv").empty();
        this.disableDeleteBtn();
        $("#personDetailsDiv").append(this.buildNewPersonDetails());
    },

    buildNewPersonDetails: function() {

        var items = this.buildPersonDetails();

        items.push($("<button></button>").attr("type","button").text("Create").click(this.createPersonBtnHandler));

        return items;
    },

    buildPersonDetails: function() {
        return this.buildTexField("name", "Name", function(val){
            return (val == null || val == "") ? "Name is mandatory" : (val.match(/[^a-zšđčćž\-'' ]/gi)) ? "Name contains invalid characters" : true;
            })
           .concat(this.buildTexField("lastName", "Last Name", function(val){
                return (val == null || val == "") ? "Last Name is mandatory" : (val.match(/[^a-zšđčćž\-'' ]/gi)) ? "Last Name contains invalid characters" : true;
                })
           )
           .concat(this.buildTexField("oib", "Oib", function(val){
                return (val == null || val == "") ? true : (val.length != 11 || val.match(/\D/gi)) ? "Oib must be 11 digits" : true;
                })
           )
           .concat(this.buildTexField("age", "Age", function(val){
                return (val == null || val == "") ? true : (val.match(/\D/gi) || val < 1 || val > 121) ? "Age must be 3 or less digits" : true;
                })
           );
    },

    buildTexField: function (id, label, validator) {

        var field = $("<input></input>").attr("type", "text").attr("id", id);
        field.get(0).validator = validator;
        FieldValidation.create(field.get(0));
        return [
            $("<label></label>").attr("for", id).text(label + ":"), field
        ];
    },

    validatePersonDetails: function() {

        var isValid = true;

        jQuery.each($("#personDetailsDiv > input"), function(index, element) {
            if (element.validate && element.validate() !== true) {
                isValid = false;
            }
        });

        return isValid;
    },

    createPersonBtnEvent: function() {
        if (!this.validatePersonDetails()) {
            return;
        }
        this.mask.show();
        this.createPersonEvent.notify({
            name: $("#name").val(),
            lastName: $("#lastName").val(),
            oib: $("#oib").val(),
            age: $("#age").val()
        });
    },

    // update

    selectPersonEvent: function(event) {
        $("#personDetailsDiv").empty();
        $("#personDetailsDiv").append(this.buildUpdatePersonDetails());
        this.fillPersonDetails(this.model.getRecord(event.data.idPerson));

        this.enableDeleteBtn();
    },

    buildHiddenField: function(id) {
        var field = $("<input></input>").attr("type", "hidden").attr("id", "idPerson").val(0);
        field.get(0).validator = function(val) {
            return (val != null && val > 0);
        };
        FieldValidation.create(field.get(0));
        return field;
    },

    buildUpdatePersonDetails: function() {

        var items = this.buildPersonDetails();
        items.push(this.buildHiddenField());

        items.push($("<button></button>").attr("type","button").text("Edit").click(this.editPersonBtnHandler));

        return items;
    },

    fillPersonDetails: function(personData) {
        $("#idPerson").val(personData.idPerson);
        $("#name").val(personData.name);
        $("#lastName").val(personData.lastName);
        $("#oib").val(personData.oib);
        $("#age").val(personData.age);
    },

    editPersonBtnEvent: function() {
        if (!this.validatePersonDetails()) {
            return;
        }
        this.mask.show();
        this.updatePersonEvent.notify({
            idPerson: $("#idPerson").val(),
            name: $("#name").val(),
            lastName: $("#lastName").val(),
            oib: $("#oib").val(),
            age: $("#age").val()
        });
    },

    // delete

    deletePersonBtnEvent: function() {
        this.mask.show();
        this.deletePersonEvent.notify({
            idPerson: $("#idPerson").val()
        });
    },

    disableDeleteBtn: function() {
        $("#deletePersonBtn").prop('disabled', true);
    },

    enableDeleteBtn: function() {
        $("#deletePersonBtn").prop('disabled', false);
    }

}