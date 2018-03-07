
function Grid(cfg) {

    this.configObject = cfg;

    this.isRendered = false;

    this.init();
}

Grid.prototype = {

    init: function() {

        this.initHandlers();
        this.initProperties();

        if (this.configObject == null || this.configObject.model == null) {
            return;
        }

        this.model = this.configObject.model;
        this.initView(this.columnsCfg);

        if (this.autoShow) {
            this.view.render();
            this.isRendered = true;
        }

        if (this.autoLoad) {
            this.model.load();
        }
    },

    initProperties: function() {

        this.renderTo = (this.configObject == null || this.configObject.renderTo == null) ? true : this.configObject.renderTo;
        this.autoLoad = (this.configObject == null || this.configObject.autoLoad == null) ? true : this.configObject.autoLoad;
        this.autoShow = (this.configObject == null || this.configObject.autoShow == null) ? true : this.configObject.autoShow;
        this.columnsCfg = (this.configObject == null || this.configObject.columns == null) ? [] : this.configObject.columns;
        this.height = (this.configObject == null || this.configObject.height == null) ? null : this.configObject.height;
        this.width = (this.configObject == null || this.configObject.width == null) ? null : this.configObject.width;
        this.title = (this.configObject == null || this.configObject.title == null) ? null : this.configObject.title;
        this.css = (this.configObject == null || this.configObject.css == null) ? null : this.configObject.css;
    },

    initView: function(columns) {

        this.isRendered = false;

        if(this.view != null) {
            this.view.destroy();
        }

        if (columns.length == 0) {
            $.each(this.model.getFieldNames(), function (index, name) {

                columns.push({
                    text: name,
                    field: name,
                    editable: false
                });

            });

        }

        this.columnsCfg = columns;

        this.view = new GridView({
            columns: columns,
            model: this.model,
            renderTo: this.renderTo,
            title: this.title,
            height: this.height,
            width: this.width,
            css: this.css
        });

        this.initListeners();

    },

    initHandlers: function() {
        this.createRecordHandler = null;
        this.updateRecordHandler = null;
        this.deleteRecordHandler = null;
        //to override - bind handlers
    },

    initListeners: function() {
        //abstract
    },

    // getters / setters

    /* use this to reset the grid
    // model - model instance (mandatory)
    // columns - columns config object, leave null to keep the same, [] to autoBuild from model
    */
    reconfigure: function(model, columns) {
        if (model == null) {
            throw "Grid.reconfigure(): model instance is mandatory";
        }

        this.model.removeAllListeners();
        this.model = model;

        if (columns != null) {
            this.initView(columns);
        }

    },

    load: function() {
        this.model.load();
    },

    show: function() {
        if (this.isRendered) {
            this.view.show();
        } else {
            this.view.render();
            this.isRendered = true;
        }
    },

    hide: function() {
        this.view.hide();
    },

    isRendered: function() {
        return this.isRendered;
    },

    mask: function() {
        if(this.isRendered) {
            this.view.mask();
        }
    },

    unmask: function() {
        this.view.unmask();
    }


}