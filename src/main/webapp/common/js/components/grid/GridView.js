function GridView(cfg) {

    if(cfg == null || cfg.columns == null || cfg.model == null) {
        throw "GridView.init(): mandatory params missing";
    }

    this.columns = cfg.columns;
    this.model = cfg.model;
    this.appendTo = cfg.appendTo;
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
        if (this.asPopup) {
            this.initPopup();
        }
        this.initMask();
        this.resize();
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
        this.createGridTableHeaderContainer();
        this.createGridTableHeader();
        this.createGridTableContainer();
        this.createGridTable();
        this.createToolbar();
    },

    createMainContainer: function() {
        this.mainContainer = $("<div></div>").attr("class", "mainContainer");
    },

    buildTitleBar: function() {

        var titleBar = $("<div></div>").attr("class", "gridTitleBar");
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

    createGridTableHeaderContainer: function() {
        this.gridTableHeaderContainer = $("<div></div>").attr("class", "gridTableHeaderDiv");
        $(this.mainContainer).append(this.gridTableHeaderContainer);
    },

    buildGridTableHeader: function() {
        var gridTableHeader = this.buildGridTable();

        var gridColumns = [];

        $.each(this.columns, function(index, column) {
            gridColumns.push($("<th></th>").attr("class", "gridTableHeaderColumn").text(column.text));
        });

        $(gridTable).append($("<tr></tr>").append(gridColumns));

        return gridTable;
    },

    createGridTableHeader: function() {
        $(this.gridTableHeaderContainer).append(this.buildGridTableHeader());
    },

    createGridTableContainer: function() {
        this.gridTableContainer = $("<div></div>").attr("class", "gridTableDiv");
        $(this.mainContainer).append(this.gridTableContainer);
    },

    buildGridTable: function() {
        return gridTable = $("<table></table>").attr("class", "gridTable");
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

    initPopup() {
        //to do
    },

    initMask: function() {
        this.loadingMask = new LoadingMask($(this.mainContainer));
    },

    resize: function() {
        $(this.mainContainer).width(this.width).height(this.height);
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

        this.unmask();
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
            rowColumns.push($("<td></td>").attr("class", "gridTableColumn").text(rowData[column.field]));
        });

        $(this.gridTable).append($("<tr></tr>").attr("class", "gridTableRow").append(rowColumns));
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
        $(this.appendTo).append(this.mainContainer);
    },

    show: function() {
        $(this.mainContainer).show();
    },

    hide: function() {
        $(this.mainContainer).hide();
    },

    mask: function() {
        if (!$(this.mainContainer).is(":hidden")) {
            this.loadingMask.show();
        }
    },

    unmask: function() {
        this.loadingMask.hide();
    }
}