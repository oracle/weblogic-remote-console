/**
 * @license
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'knockout', 'wrc-frontend/apis/message-displaying', 'wrc-frontend/core/utils', 'ojs/ojlogger'],
  function (oj, ko, MessageDisplaying, CoreUtils, Logger) {

    // Table Customizer document ids and state values
    const customizer = {
      button: {
        id: 'customize'
      },
      table: {
        id: 'table-customizer'
      },
      toggler: {
        id: 'table-customizer-toggler'
      },
      collapsed: {
        id: 'oj-fwk-icon-caret03-s',
        state: 'collapsed'
      },
      expanded: {
        id: 'oj-fwk-icon-caret03-n',
        state: 'expanded'
      }
    };

    /**
     * Table Customizer Manager handles the table customizer used for a table or slice table
     *
     * @parm tableCustomizerUrl - customizer url from the backend
     * @parm visibleColumns - displayed columns
     * @parm hiddenColumns - non-displayed columns
     */
    function TableCustomizerManager(tableCustomizerUrl, visibleColumns, hiddenColumns) {
      this.customizerUrl =  ko.observable(tableCustomizerUrl ? tableCustomizerUrl : '');
      this.visibleColumns = ko.observableArray(visibleColumns ? visibleColumns : []);
      this.hiddenColumns = ko.observableArray(hiddenColumns ? hiddenColumns : []);
    }

    /**
     * Toggle the table customizer open or closed based on current state
     */
    function toggleCustomizer(event) {
      // Ensure the customizer button is the target
      if (event.currentTarget.id !== customizer.button.id) return;

      // Check the current state and adjust accordingly
      const beforeState = event.currentTarget.attributes['data-state'].value;
      const afterState = (beforeState === customizer.collapsed.state ? customizer.expanded.state : customizer.collapsed.state);
      $(`#${customizer.button.id}`).attr('data-state', afterState);
      $(`#${customizer.table.id}`).css({ display: (beforeState === customizer.collapsed.state ? 'inline-flex' : 'none') });
      const span = document.getElementById(customizer.toggler.id);
      if (beforeState === customizer.collapsed.state) {
        span.classList.replace(customizer.collapsed.id, customizer.expanded.id);
      }
      else {
        span.classList.replace(customizer.expanded.id, customizer.collapsed.id);
      }
    }

    /**
     * Set the table customizer to the closed state
     */
    function closeCustomizer() {
      const customizeState = $(`#${customizer.button.id}`);
      if (customizeState.length) customizeState.attr('data-state', customizer.collapsed.state);
      const customizeTable = $(`#${customizer.table.id}`);
      if (customizeTable.length) customizeTable.css({ display: 'none' });
      const span = document.getElementById(customizer.toggler.id);
      if (span !== null) span.classList.replace(customizer.expanded.id, customizer.collapsed.id);
    }

    /**
     * Set the table customizer button to be visibile or hidden
     */
    function adjustCustomizerButton(showButton) {
      const customizeButton = document.getElementById(customizer.button.id);
      if (customizeButton !== null) {
        customizeButton.style.display = (showButton ? 'flex' : 'none');
      }
    }

    /**
     * Create the metadata for a specific colum
     */
    function createColumnHeader(column) {
      // Append some non-breaking spaces to the headertext
      // so the sorting arrows do not overlap.
      let cheaderText = column.label ? column.label : column.name;
      for (let i = 1; i < 7; i++) {
        cheaderText += '\xa0';
      }
      // Return the column metadata
      const cname = column.name;
      return {
        headerText: cheaderText,
        name: cname,
        field: cname,
        sortProperty: cname,
        headerStyle: 'font-weight:bold;text-align:left;',
        resizable: 'enabled',
      };
    }

    /**
     * Get the metadata for the specified colums
     */
    function getColumnMetadata(columnMetadata, visibleColumns) {
      visibleColumns.forEach(column => {
        columnMetadata.push(createColumnHeader(column));
      });
      return columnMetadata;
    }

    /**
     * Update the columns state from the specified data and
     * return the column metadata used by the column provider
     */
    function updateColumns(columnMetadata, visibleColumns, hiddenColumns) {
      const updatedColumnMetadata = getColumnMetadata(columnMetadata, visibleColumns);
      this.visibleColumns(visibleColumns);
      this.hiddenColumns(hiddenColumns);
      return updatedColumnMetadata;
    }

    /**
     * Check if a visible column matches one of the
     * hidden columns that contains no data value.
     *
     * Upon match, a message will be displayed that a
     * reload of the table is needed to view the data.
     */
    function checkTableHiddenValue(nowVisibleColumns, displayedColumns, hiddenColumns, rdjDisplayedColumns) {
      // Obtain a list of all the columns as any column may be expensive (i.e. not returned if hidden)
      let allColumns = displayedColumns;
      if (CoreUtils.isNotUndefinedNorNull(hiddenColumns)) {
        allColumns = displayedColumns.concat(hiddenColumns);
      }

      // Now look to see if one of these hidden data columns is available on the table
      const hiddenNoValues = allColumns.filter(c => c.valueNotReturnedIfHidden === true);
      if (hiddenNoValues.length > 0) {
        // Check if the now visible columns contains one of these hidden columns
        const notReturnedIfHiddenColumns = [];
        nowVisibleColumns.forEach(nv => {
          let hiddenNoValueColumn = hiddenNoValues.find(h => h.name === nv.name);
          if (hiddenNoValueColumn) notReturnedIfHiddenColumns.push(hiddenNoValueColumn);
        });
        notReturnedIfHiddenColumns.forEach(notReturnedIfHidden => {
          // Check if the column has any data present by
          // first checking the RDJ displayed columns
          if (rdjDisplayedColumns && Array.isArray(rdjDisplayedColumns)) {
            const rdjColumn = rdjDisplayedColumns.find(c => c === notReturnedIfHidden.name);
            if (rdjColumn) return;
          }
          else {
            // Otherwise by checking the PDJ displayed columuns
            const pdjColumn = displayedColumns.find(c => c.name === notReturnedIfHidden.name);
            if (pdjColumn) return;
          }

          // Display the reload message if the column data is not part of the currently displayed data
          MessageDisplaying.displayMessage({
            severity: 'info',
            summary: oj.Translations.getTranslatedString('wrc-table.labels.reloadHidden.value', notReturnedIfHidden.label)
          }, 5000);
        });
      }
    }

    TableCustomizerManager.prototype = {
      /**
       * Get the observable holding the backend table customizer url
       */
      getCustomizerUrlObservable: function() {
        return this.customizerUrl;
      },

      /**
       * Set the current table customizer url.
       *
       * @parm tableCustomizerUrl - customizer url from the backend
       */
      setCustomizerUrl: function(tableCustomizerUrl) {
        this.customizerUrl(tableCustomizerUrl ? tableCustomizerUrl : '');
      },

      /**
       * Get the observable array holding the visible columns
       */
      getVisibleColumnsObservable: function() {
        return this.visibleColumns;
      },

      /**
       * Get the observable array holding the hidden columns
       */
      getHiddenColumnsObservable: function() {
        return this.hiddenColumns;
      },

      /**
       * Apply the specified customizations where the PDJ data is used to define the
       * both the displayed and hidden column settings.
       *
       * The column metadata is updated based on the displayed columns and used by the
       * column data provider for the table or slice table.
       *
       * @parm columnMetadata - updated based on the dispayed columns
       * @parm visibleColumns - displayed columns
       * @parm hiddenColumns - non-displayed columns
       * @parm valueHasMutated - used to explictly cause column observables to signal mutated
       */
      applyCustomizations: function (columnMetadata, visibleColumns, hiddenColumns, valueHasMutated = false) {

        // Update the column data based on the specified customizations
        const updatedColumnMetadata = updateColumns.call(this, columnMetadata, visibleColumns, hiddenColumns);

        // Single the values have mutated when specified
        if (valueHasMutated === true) {
          this.visibleColumns.valueHasMutated();
          this.hiddenColumns.valueHasMutated(); 
        }

        // Return column metadata used with column data provider
        return updatedColumnMetadata;
      },

      /**
       * Handle the customizer button event by opening or closing the table customizer.
       */
      toggleCustomizerState: function(event) {
        toggleCustomizer(event);
      },

      /**
       * Explictly close the table customizer.
       */
      closeCustomizerState: function() {
        closeCustomizer();
      },

      /**
       * Change the customizer button to be visible or hidden.
       */
      adjustCustomizerButtonState: function(showButton) {
        adjustCustomizerButton(showButton);
      },

      /**
       * Check if a currently visible column is a hidden column with no data value.
       */
      checkTableHiddenValue: function(nowVisibleColumns, displayedColumns, hiddenColumns, rdjDisplayedColumns) {
        checkTableHiddenValue(nowVisibleColumns, displayedColumns, hiddenColumns, rdjDisplayedColumns);
      }
    };

    // Return the TableCustomizerManager constructor
    return TableCustomizerManager;
  }
);
