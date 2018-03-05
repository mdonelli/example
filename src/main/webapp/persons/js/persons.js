 var CNTR_PERSONS = "/persons/CntrPersons";

$(function () {
     var model = new PersonModel();
     var view = new PersonView(model);
     var controller = new PersonController(model, view);
     model.load();
 });