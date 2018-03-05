function Model() {

    this.records = [];
    this.tempRecordIdx = 1;

    this.recordsChangeEvent = new Event(this);

    this.init();
}

Model.prototype = {

    init: function() {
        this.idProperty = null;
        this.fieldNames = []; //should not include idProperty
        this.name = "";
    },

    returnIdProperty: function() {
        //gets idProperty, throws error if invalid
        if (this.idProperty == null || this.idProperty == "") {
            throw "Error( " + this.getName() + " ): idProperty is invalid";
        }

        return this.idProperty;
    },

    load: function() {
        //abstract
    },

    getData: function() {
        return this.records.slice();
    },

    returnRecord: function(id) {
        //search record by id and return it
        var found = null;
        var idProp = this.returnIdProperty();

        $.each(this.records, function(index, record) {
            if (record[idProp] == id) {

                found = record;
                return false;
            }
        });

        return found;

    },

    getRecord: function(id) {
        //search record by id and return a clone of it
        var record = {};
        var found = this.returnRecord(id);

        if (found == null) {
            return null;
        }

        $.extend(record, found)

        return record;
    },

    createRecord: function(recordData) {
        var record = {};

        this.createMandatoryFields(record, recordData);
        this.insertRecordFields(record, recordData);

        return record;
    },

    createMandatoryFields: function(record, recordData) {

        var idProp = this.returnIdProperty();

        if (recordData[idProp] == null || recordData[idProp] == "") {
            record[idProp] = "tmp" + this.getName() + this.tempRecordIdx++;
            record._isTemporaryId = true;
            record._isDirty = true;
        } else {
            record[idProp] = recordData[idProp];
            record._isTemporaryId = false;
            record._isDirty = false;
        }

    },

    insertRecordFields: function(record, recordData) {

        $.each(this.fieldNames, function(index, field) {
            record[field] = recordData == null || recordData[field] == null ? null : recordData[field];
        });

    },

    addRecord: function(recordData) {
        this.records.push(this.createRecord(recordData));
        this.recordsChangeEvent.notify({ action: "insert", data: recordData });
    },

    updateRecord: function(recordData, markDirty) {

        var isDirty = markDirty != null ? markDirty : true;
        var idProp = this.returnIdProperty();
        var found = this.returnRecord(recordData[idProp]);


        if (!found) {
           throw "Error( " + this.getName() + " ): record not found, id: " + recordData[idProp];
        }

        this.insertRecordFields(found, recordData);
        found._isDirty = isDirty;

        this.recordsChangeEvent.notify({ action: "update", data: recordData });
    },

    deleteRecord: function(idRecord) {

        var listSize = this.records.length;
        var recordData = this.getRecord(idRecord);
        var idProp = this.returnIdProperty();

        this.records = $.grep(this.records, function(record){
            return record[idProp] != idRecord;
        });

        if (listSize !=  this.records.length) {
            this.recordsChangeEvent.notify({ action: "delete", data: recordData });
        }
    },


    // getters / setters

    getIdProperty: function() {
        return this.idProperty;
    },

    setIdProperty: function(property) {
        this.idProperty = property;
    },

    getName: function() {
        return this.name != null ? this.name : "";
    },

    setName: function(newName) {
        this.name = newName;
    },

    getFieldNames: function() {
        return this.fieldNames.slice();
    },

    removeAllListeners: function() {
        this.recordsChangeEvent.removeAllListeners();
    }

}