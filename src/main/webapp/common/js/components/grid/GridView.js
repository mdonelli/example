function GridView(cfg) {

    if(cfg == null || cfg.columns == null || cfg.model == null) {
        throw "GridView.init(): mandatory params missing";
    }

    this.columns = cfg.columns;
    this.model = cfg.model;
    this.renderTo = cfg.renderTo;
    this.title = cfg.title;
    this.height = cfg.height;
    this.width = cfg.width;
    this.css = cfg.css;

    this.createRecordEvent = new Event(this);
    this.updateRecordEvent = new Event(this);
    this.deleteRecordEvent = new Event(this);

    this.init();

}

GridView.prototype = {

    init: function() {
        this.initHandlers();
        this.initListeners();
        this.initItems();
        this.initMask();
    },

    initHandlers: function() {
        this.recordChangedHandler = this.update.bind(this);
        this.modelLoadingHandler = this.onModelLoad.bind(this);
    },

    initListeners: function() {
        this.model.recordsChangeEvent.addListener(this.recordChangedHandler);
        this.model.loadEvent.addListener(this.modelLoadingHandler);
    },

    initItems: function() {
        this.createMainContainer();
        if (this.title != null) {
            this.createTitleBar();
        }
        this.createGridTableContainer();
        this.createGridTable();
        this.createToolbar();
    },

    createMainContainer: function() {
        var style = "";

        if (!isNaN(this.height)) {
            style += "height: " + this.height + "px; ";
        }

        if (!isNaN(this.width)) {
            style += "width: " + this.width + "px; ";
        }

        var cfg = {};

        if (style.length >0) {
            cfg.style = style;
        }

        cfg.class = (this.class != null ? this.class : "") + " flexColumn gridContainer ";

        this.mainContainer = createContainer(cfg);
    },

    buildTitleBar: function() {

        var cfg = {
            class: "gridTitleBar"
        }

        var titleBar = createContainer(cfg);
        if (typeof this.title === "string") {
            $(titleBar).append($("<b></b>").text(this.title));
        } else {
            $(titleBar).append(this.title);
        }

        return titleBar;

    },

    createTitleBar: function() {
        this.titleBar = this.buildTitleBar();
        $(this.mainContainer).append(this.titleBar);
    },

    createGridTableContainer: function() {
        this.gridTableContainer = createContainer({class: "gridTableDiv"});
        $(this.mainContainer).append(this.gridTableContainer);
    },

    buildGridTable: function() {

        var gridTable = $("<table></table>");

        var gridColumns = [];

        $.each(this.columns, function(index, column) {
            gridColumns.push($("<th></th>").text(column.text));
        });

        $(gridTable).append($("<tr></tr>").append(gridColumns));

        return gridTable;

    },

    createGridTable: function() {
        this.gridTable = this.buildGridTable();
        $(this.gridTableContainer).append(this.gridTable);
    },

    buildToolbar: function() {

        return null;
    },

    createToolbar: function() {
        this.toolbar = this.buildToolbar();
        $(this.mainContainer).append(this.toolbar);
    },

    initMask: function() {
        this.loadingMask = new LoadingMask($(this.mainContainer));
    },

    update: function(sender, args) {

        switch (args.action) {
            case "recordsLoaded":
                if (this.gridTable != null) {
                    this.createRows(this.model.getData());
                }
            break;
            default:
                throw "GridView.update(): Unknown action: " + args.action;
            break;
        }
    },

    createRows: function(rowsData) {

        var me = this;

        $.each(rowsData, function(index, rowData) {
            me.createRow(rowData);
        });
    },

    createRow: function(rowData) {

        var rowColumns = [];

        $.each(this.columns, function(index, column) {
            rowColumns.push($("<td></td>").text(rowData[column.field]));
        });

        $(this.gridTable).append($("<tr></tr>").append(rowColumns));
    },

    onModelLoad: function() {
        this.mask();
    },

    // getters / setters

    destroy: function() {

        $(this.content).remove();
        this.model.removeAllListeners();
        this.createRecordEvent.removeAllListeners();
        this.updateRecordEvent.removeAllListeners();
        this.deleteRecordEvent.removeAllListeners();
    },

    render: function() {
        $(this.renderTo).append(this.mainContainer);
    },

    show: function() {
        $(this.mainContainer).show();
    },

    hide: function() {
        $(this.mainContainer).hide();
    },

    mask: function() {
        if (!$(this.mainContainer).is(":hidden")) {
            $(this.loadingMask).show();
        }
    },

    unmask: function() {
        $(this.loadingMask).hide();
    }
}