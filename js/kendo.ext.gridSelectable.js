/**
 * @desc Kendo Custom Plugin Selectable Grid
 * @author Triet Nguyen petertriet@gmail.com
 * @required jquery.min.js, kendo.web.min.js, kendo.custom.selectable.js
 */
(function(kendo, $) {
    var ExtGridSelectable = kendo.ui.Widget.extend({
        _grid : null,
        _gridID : null,
        _chkClass : null,
        _chkAllID : null,
        _selectedRow : null,

        init : function(element, options) {
            var that = this;

            kendo.ui.Widget.fn.init.call(that, element, options);
            that._gridID   = "#" + $(element).attr('id');
            that._chkClass = "." + $(options.chkTemplate).attr('class');
            that._chkAllID = "#" + (options.chkAllID !== "" && options.chkAllID !== undefined ? options.chkAllID : $(options.chkAllTemplate).attr('id'));

            options.grid.columns.unshift({
                title : "",
                template : options.chkTemplate,
                headerTemplate : options.chkAllTemplate,
                attributes : {
                    "class" : "align-center"
                },
                width : "30px",
                sortable : false
            });

            options.grid.dataBound = that.databound;

            that._grid = $(element).kendoGrid(options.grid).data("kendoGrid");
            that._grid.thead.append(options.filterHeader);
            that._grid.bind("change", function(e) {
                $(this._gridID + " table " + this._chkClass + ":checked").prop("checked", true);
            });
            
            that._grid.pager.bind("change", function() {
                that._pageChange();
            });
            
            that._setupEvents();
        },
        _handleSingleClick : function(e) {
            var checkBox = e.target;
            var row = $(checkBox).parent().parent();
            var checkedAll = $(this._chkAllID).prop("checked");

            if ($(checkBox).is("input[type=checkbox]")) {
                if ($(checkBox).prop("checked")) {
                    $( this._gridID + " table " + this._chkClass + ":checked").prop("checked", false);
                    var selected = this._grid.select();
                    $(selected).find(this._chkClass).prop("checked", true);
                    this._grid.select(selected);
                } else {
                    var count = $(this._selectedRow).size();
                    if (count > 1) {
                        if (checkedAll) {
                            $(this._chkAllID).prop("checked", false);
                            var selected = this._grid.select();
                            this._deselectRow(this._gridID + " table tbody tr");
                            $(selected).find(this._chkClass).prop("checked", true);
                            this._grid.select(selected);
                        } else {
                            $(this._gridID + " table " + this._chkClass + ":checked").prop("checked", false);
                            var selected = this._grid.select();
                            $(selected).find(this._chkClass).prop("checked", true);
                            this._grid.select(selected);
                        }
                    } else {
                        if (checkedAll) {
                            $(this._chkAllID).prop("checked", false);
                            this._deselectRow(this._gridID + " table tbody tr");
                            console.log(row);
                            $(row).find(this._chkClass).prop("checked", true);
                            this._grid.select(row);
                        } else {
                            $(row).removeClass("k-state-selected").removeAttr("aria-selected");
                        }
                    }
                }
            } else {
                var selected = this._grid.select();
                this._grid.clearSelection();
                if (checkedAll) {
                    $(this._chkAllID).prop("checked", false);
                    this._deselectRow(this._gridID + " tbody tr");
                    $(this._gridID + " table " + this._chkClass + ":checked").prop("checked", true);
                } else {
                    $(this._gridID + " table " + this._chkClass + ":checked").prop("checked", false);
                }

                this._grid.select(selected);
                selected.find(this._chkClass).prop("checked", true);
            }
            this._selectedRow = this._grid.select();
        },
        _handleSelectAll : function() {
            var checked = $(this._chkAllID).prop("checked");
            var row = $(this._gridID + " table tbody tr");
            this._grid.clearSelection();
            if (checked) {
                this._selectRow(row);
            } else {
                this._deselectRow(row);
            }
        },
        _handleSelectMultiRow : function(rowSelector) {
            if ($(rowSelector).hasClass("selectedRow")) {
                this._deselectRow(rowSelector);
            } else {
                this._selectRow(rowSelector);
            }
        },
        _selectRow : function(rowSelector) {
            $(rowSelector).removeClass("k-state-selected");
            $(rowSelector).addClass("selectedRow");
            $(rowSelector).attr("aria-selected", true);
            if (this._chkClass !== "") {
                $(rowSelector).find(this._chkClass).prop("checked", true);
            }
        },
        _deselectRow : function(rowSelector) {
            $(rowSelector).removeClass("k-state-selected");
            $(rowSelector).removeClass("selectedRow");
            $(rowSelector).attr("aria-selected", false);
            if (this._chkClass !== "") {
                $(rowSelector).find(this._chkClass).prop("checked", false);
            }
        },
        _setupEvents : function() {
            var that = this;
            $(that._gridID + " table tbody tr").on({click : function(e) {
                that._handleSingleClick(e);
            }});

            $(that._chkAllID).on({change : function(e) {
                    that._handleSelectAll();
            }});
        },
        _pageChange : function() {
            var that = this;
            $(that._chkAllID).prop("checked", false);
            that._setupEvents();
        },
        grid : function() {
            return this._grid;
        },
        options : {
            name : "ExtGridSelectable",
            filterHeader : "",
            chkTemplate : "",
            chkAllTemplate : "",
            chkAllID : "",
            selKendoClass : "",
            selRowClass : ""
        }
    });
    kendo.ui.plugin(ExtGridSelectable);
})(window.kendo, window.kendo.jQuery);