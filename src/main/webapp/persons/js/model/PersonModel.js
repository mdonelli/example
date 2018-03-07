function PersonModel() {
    Model.call(this);
}


PersonModel.prototype = Object.create(Model.prototype);

PersonModel.prototype.constructor = PersonModel;

PersonModel.prototype.init = function() {
    this.idProperty = "idPerson";
    this.fieldNames = ["name", "lastName", "oib", "age"]; //should not include idProperty
    this.name = "PersonModel";
};

PersonModel.prototype.loadData = function() {

    var me = this;
    AJAX.call(CNTR_PERSONS, {
            type: "person",
            action: "loadAll",
        }, function(ok, data){
            if (ok) {
                if (data == null || data.persons == null) {
                    me.records = [];
                } else {
                    me.records = data.persons;
                }

                me.recordsChangeEvent.notify({ action: "recordsLoaded" });

            } else {
                alert(data);
            }
        });
};

PersonModel.prototype.createPerson = function(name, lastName, oib, age) {

    var me = this;
    AJAX.call(CNTR_PERSONS, {
            type: "person",
            action: "insert",
            name: name,
            lastName: lastName,
            oib: oib,
            age: age
        }, function(ok, data){
            if (ok) {
                me.addRecord(data);
            } else {
                alert(data);
            }
        });
};

PersonModel.prototype.updatePerson = function(idPerson, name, lastName, oib, age) {

    var me = this;
    AJAX.call(CNTR_PERSONS, {
            type: "person",
            action: "update",
            idPerson: idPerson,
            name: name,
            lastName: lastName,
            oib: oib,
            age: age
        }, function(ok, data){
            if (ok) {
                me.updateRecord(data, false);
            } else {
                alert(data);
            }
        });
};

PersonModel.prototype.deletePerson = function(idPerson) {
    var me = this;
    AJAX.call(CNTR_PERSONS, {
            type: "person",
            action: "delete",
            idPerson: idPerson
        }, function(ok, data){
            if (ok) {
                me.deleteRecord(idPerson);
            } else {
                alert(data);
            }
        });
};

