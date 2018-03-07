function PersonView(model) {

    this.model = model;
    this.createPersonEvent = new Event(this);
    this.updatePersonEvent = new Event(this);
    this.deletePersonEvent = new Event(this);

    this.init();
}

PersonView.prototype = {

    init: function() {
        this.initHandlers();
        this.initListeners();
        this.createGridTableHeader();
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

    createGridTableHeader: function() {
        var table = this.createGridTable().append(this.buildHeaderRow());
        $("#personsTableHeaderDiv").append(table);
    },

    createGridTable: function() {
        return $("<table></table>").attr("class","gridTable");
    },

    createLoadingMask() {
        this.mask = new LoadingMask($("#mainContainer"));
    },

    newPersonBtnEvent: function() {
        $("#personDetailsDiv").empty();
        $("#deletePersonBtn").prop('disabled', true);
        $("#personDetailsDiv").append(this.buildNewPersonDetails());
    },

    buildNewPersonDetails: function() {

        var items = this.buildPersonDetails();

        items.push($("<button></button>").attr("type","button").text("Create").click(this.createPersonBtnHandler));

        return items;
    },

    buildPersonDetails: function() {

        var items = [
            $("<label></label>").attr("for", "nameField").text("Name:"),
            $("<input></input>").attr("type", "text").attr("id", "nameField"),
            $("<label></label>").attr("for", "lastNameField").text("Last name:"),
            $("<input></input>").attr("type", "text").attr("id", "lastNameField"),
            $("<label></label>").attr("for", "oibField").text("Oib:"),
            $("<input></input>").attr("type", "text").attr("id", "oibField"),
            $("<label></label>").attr("for", "ageField").text("Age:"),
            $("<input></input>").attr("type", "text").attr("id", "ageField"),
            $("<input></input>").attr("type", "hidden").attr("id", "idPerson").val(0)
            ];

        return items;

    },

    createPersonBtnEvent: function() {
        this.mask.show();
        this.createPersonEvent.notify({
            name: $("#nameField").val(),
            lastName: $("#lastNameField").val(),
            oib: $("#oibField").val(),
            age: $("#ageField").val()
        });
    },

    selectPersonEvent: function(event) {
        $("#personDetailsDiv").empty();
        $("#personDetailsDiv").append(this.buildUpdatePersonDetails(event.data.idPerson));
        this.fillPersonDetails(this.model.getRecord(event.data.idPerson));

        $("#deletePersonBtn").prop('disabled', false);
    },

    buildUpdatePersonDetails: function(idPerson) {

        var items = this.buildPersonDetails();

        items.push($("<button></button>").attr("type","button").text("Edit").click(this.editPersonBtnHandler));

        return items;
    },

    fillPersonDetails: function(personData) {
        $("#idPerson").val(personData.idPerson);
        $("#nameField").val(personData.name);
        $("#lastNameField").val(personData.lastName);
        $("#oibField").val(personData.oib);
        $("#ageField").val(personData.age);
    },

    editPersonBtnEvent: function() {
        this.mask.show();
        this.updatePersonEvent.notify({
            idPerson: $("#idPerson").val(),
            name: $("#nameField").val(),
            lastName: $("#lastNameField").val(),
            oib: $("#oibField").val(),
            age: $("#ageField").val()
        });
    },

    refreshPersonList: function(sender, args) {

        $("#personDetailsDiv").empty();
        $("#deletePersonBtn").prop('disabled', true);

        this.buildPersonsTable();

        this.mask.hide();
    },

    buildPersonsTable: function() {

        $("#personsTableDiv").empty();

        var table = this.createGridTable();

        var me = this;
        var personsData = this.model.getData();

        jQuery.each(personsData, function(index, personData) {
            table.append(me.buildPersonRow(personData));
        });

        $("#personsTableDiv").append(table);
    },

    buildHeaderRow: function() {

        var items = [
            this.creteGridTableHeaderColumn().text("Name"),
            this.creteGridTableHeaderColumn().text("Last Name"),
            this.creteGridTableHeaderColumn().text("OIB"),
            this.creteGridTableHeaderColumn().text("Age")
        ];

        var row = $("<tr></tr>").append(items);

        return row;
    },

    creteGridTableHeaderColumn: function() {
        return $("<th></th>").attr("class", "gridTableHeaderColumn");
    },

    buildPersonRow: function(personData) {

        var me = this;

        var items = [
            this.CreateGridTableColumn().text(personData.name),
            this.CreateGridTableColumn().text(personData.lastName),
            this.CreateGridTableColumn().text(personData.oib),
            this.CreateGridTableColumn().text(personData.age)
        ];

        var row = $("<tr></tr>").attr("class","gridTableRow").on("click", {idPerson: personData.idPerson}, this.selectPersonEventHandler).append(items);

        return row;
    },

    CreateGridTableColumn: function() {
        return $("<td></td>").attr("class", "gridTableColumn");
    },

    deletePersonBtnEvent: function() {
        this.mask.show();
        this.deletePersonEvent.notify({
            idPerson: $("#idPerson").val()
        });
    },

    onModelLoad: function() {
        this.mask.show();
    }



}