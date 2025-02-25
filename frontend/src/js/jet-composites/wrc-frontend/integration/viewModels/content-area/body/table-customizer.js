/**
 * @license
 * Copyright (c) 2022, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define([
  'ojs/ojcore',
  'knockout',
  'ojs/ojarraydataprovider',
  'ojs/ojknockout-keyset',
  'wrc-frontend/apis/data-operations',
  'wrc-frontend/integration/viewModels/utils',
  'ojs/ojlistitemlayout',
  'ojs/ojlistview',
  'ojs/ojselector'
], function (oj, ko, ArrayDataProvider, KeySet, DataOperations, ViewModelUtils) {
  function TableCustomizer(viewParams) {
    const self = this;

    this.dirty = ko.observable(false);
    this.cannotBeApplied = ko.observable(true);

    this.i18n = {
      ariaLabel: {
        availableColumns: {
          title: {value: oj.Translations.getTranslatedString('wrc-table-customizer.ariaLabel.availableColumns.title.value') },
          list: {value: oj.Translations.getTranslatedString('wrc-table-customizer.ariaLabel.availableColumns.list.value')},
          listItem: { value: oj.Translations.getTranslatedString('wrc-table-customizer.ariaLabel.availableColumns.listItem.value')}
        },
        selectedColumns: {
          title: {value: oj.Translations.getTranslatedString('wrc-table-customizer.ariaLabel.selectedColumns.title.value') },
          list: {value: oj.Translations.getTranslatedString('wrc-table-customizer.ariaLabel.selectedColumns.list.value')},
          listItem: { value: oj.Translations.getTranslatedString('wrc-table-customizer.ariaLabel.selectedColumns.listItem.value')}
        },
        button: {
          addToRight: { value: oj.Translations.getTranslatedString('wrc-table-customizer.ariaLabel.button.addToRight.value')},
          addAllRight: { value: oj.Translations.getTranslatedString('wrc-table-customizer.ariaLabel.button.addAllRight.value')},
          removeRight: { value: oj.Translations.getTranslatedString('wrc-table-customizer.ariaLabel.button.removeRight.value')},
          removeAll: { value: oj.Translations.getTranslatedString('wrc-table-customizer.ariaLabel.button.removeAll.value')},
          reset: { value: oj.Translations.getTranslatedString('wrc-table-customizer.ariaLabel.button.reset.value')},
          apply: { value: oj.Translations.getTranslatedString('wrc-table-customizer.ariaLabel.button.apply.value')},
          cancel: { value: oj.Translations.getTranslatedString('wrc-table-customizer.ariaLabel.button.cancel.value')}
        }
      },
      buttons: {
        apply: {
          id: 'new',
          disabled: this.cannotBeApplied,
          label: oj.Translations.getTranslatedString(
            'wrc-common.buttons.apply.label'
          )
        },
        cancel: {
          id: 'cancel',
          disabled: ko.observable(true),
          label: oj.Translations.getTranslatedString(
            'wrc-common.buttons.cancel.label'
          )
        },
        reset: {
          id: 'reset',
          label: oj.Translations.getTranslatedString(
            'wrc-common.buttons.reset.label'
          )
        },
        ok: {
          id: 'ok',
          label: oj.Translations.getTranslatedString(
            'wrc-common.buttons.ok.label'
          )
        }
      }
    };

    function setCannotBeApplied() {
      self.cannotBeApplied(self.columnsRight().length === 0 || !self.dirty());
    }

    function setCancelButtonDisableState(state) {
      self.i18n.buttons.cancel.disabled(state === false);
    }

    function takeColumnsSnapshot() {
      self.columnsLeftInitial = [...self.columnsLeft()];
      self.columnsRightInitial = [...self.columnsRight()];
    }

    function restoreColumnsFromSnapshot() {
      if (self.columnsLeftInitial) self.columnsLeft([...self.columnsLeftInitial]);
      if (self.columnsRightInitial) self.columnsRight([...self.columnsRightInitial]);
      self.dirty(false);
      setCannotBeApplied();
      setCancelButtonDisableState(self.dirty());
    }

    this.addAllButtonClick = (event) => {
      let removed;

      do {
        removed = self.columnsLeft.shift();

        if (removed) {
          self.dirty(true);
          self.columnsRight.push(removed);
        }
      } while (removed);
      setCannotBeApplied();
      setCancelButtonDisableState(self.dirty());

      self.selectedLeftItems.clear();
      self.selectedRightItems.clear();
    };

    this.removeAllButtonClick = (event) => {
      let rightColumns = [...self.columnsRight()];
      rightColumns.reverse();
      rightColumns.forEach(removed => {
        if (removed) {
          self.dirty(true);
          self.columnsLeft.unshift(removed);
        }
      });
      self.columnsRight.removeAll();
      setCannotBeApplied();
      setCancelButtonDisableState(self.dirty());

      self.selectedLeftItems.clear();
      self.selectedRightItems.clear();
    };

    this.addRightButtonClick = (event) => {
      self.selectedLeftItems().values().forEach((key) => {
        let removed = self.columnsLeft.remove((item) => item.name === key);

        if (removed) {
          self.dirty(true);
          removed.forEach((item) => {
            self.columnsRight.push(item);
          });
        }
      });
      setCannotBeApplied();
      setCancelButtonDisableState(self.dirty());
    };

    this.removeRightButtonClick = (event) => {
      let rightValues = [];
      self.selectedRightItems().values().forEach((key) => {
        rightValues.push(key);
      });
      rightValues.reverse();
      rightValues.forEach((key) => {
        let removed = self.columnsRight.remove((item) => item.name === key);

        if (removed) {
          self.dirty(true);
          removed.forEach((item) => {
            self.columnsLeft.unshift(item);
          });
        }
      });
      setCannotBeApplied();
      setCancelButtonDisableState(self.dirty());
    };

    this.applyButtonClick = (event) => {
      // No action to take when control is unchanged
      if (!self.dirty()) return;

      self.applyCustomizationsCallback(
        self.columnsRight(),
        self.columnsLeft(),
        true
      );

      self.dirty(false);
      setCannotBeApplied();
      setCancelButtonDisableState(self.dirty());

      self.selectedLeftItems.clear();
      self.selectedRightItems.clear();
      takeColumnsSnapshot();

      self.persistCustomization();
    };

    this.cancelButtonClick = (event) => {
      // No action to take when control is unchanged
      if (!self.dirty()) return;

      restoreColumnsFromSnapshot();

      self.selectedLeftItems.clear();
      self.selectedRightItems.clear();
    };

    this.resetButtonClick = (event) => {
      restoreColumnsFromSnapshot();

      self.selectedLeftItems.clear();
      self.selectedRightItems.clear();

      self.resetCustomizationsCallback();
      takeColumnsSnapshot();

      self.persistCustomization(true);
    };

    this.selectedLeftItems = new KeySet.ObservableKeySet();
    this.selectedRightItems = new KeySet.ObservableKeySet();

    self.tablePrefs = {};
    self.customizerUrl = viewParams.customizerUrl;

    self.columnsLeft = viewParams.hiddenColumns;
    self.columnsRight = viewParams.visibleColumns;

    self.applyCustomizationsCallback = viewParams.applyCustomizationsCallback;
    self.resetCustomizationsCallback = viewParams.resetCustomizationsCallback;

    this.leftColumnsDataProvider = new ArrayDataProvider(self.columnsLeft, {
      keyAttributes: 'name',
    });

    this.rightColumnsDataProvider = new ArrayDataProvider(self.columnsRight, {
      keyAttributes: 'name',
    });

    this.applyDefaultCustomizations = function () {
      const tablePref = self.tablePrefs[self.customizerUrl()];

      if (tablePref && Array.isArray(tablePref.selected)) {
        let allColumns = [...self.columnsRight(), ...self.columnsLeft()];

        self.columnsLeft.removeAll();
        self.columnsRight.removeAll();

        // Move each choosen column as selected to the right
        tablePref.selected.forEach((choosen) => {
          const choosenIndex = allColumns.findIndex(column => choosen === column.name);
          if (choosenIndex !== -1) {
            const choosenColumns = allColumns.splice(choosenIndex, 1);
            choosenColumns.forEach((choosenColumn) => {
              self.columnsRight.push(choosenColumn);
            });
          }
        });

        // Any remaining columns are unselected to the left
        allColumns.forEach((column) => {
          self.columnsLeft.push(column);
        });

        self.applyCustomizationsCallback(
          self.columnsRight(),
          self.columnsLeft()
        );
      }
    };

    this.persistCustomization = (reset = false) => {
      // Save the currently selected columns in memory
      // A reset will still save the defaulted columns
      // as those columns now take precedence
      const nameMapper = (column) => column.name;
      self.tablePrefs[self.customizerUrl()] = {
        selected: self.columnsRight().map(nameMapper)
      };

      // Save the selected colums to the backend using table customizer url
      DataOperations.mbean.customizeTable(
        self.customizerUrl(),
        self.tablePrefs[self.customizerUrl()].selected,
        reset)
      .catch(response => {
        ViewModelUtils.failureResponseDefaultHandling(response);
      })
    };

    // Perfrom setup for tables and slice tables when rendered
    this.setupCustomization = (selectedColumns) => {
      // Establish the selected columns unless they have already been defined previously
      if (selectedColumns && Array.isArray(selectedColumns) && (selectedColumns.length > 0)) {
        const tablePref = self.tablePrefs[self.customizerUrl()];
        if (!tablePref) self.tablePrefs[self.customizerUrl()] = { selected: selectedColumns };
      }
      // Apply any customizations
      self.applyDefaultCustomizations();
      takeColumnsSnapshot();
    };
  }

  return TableCustomizer;
});