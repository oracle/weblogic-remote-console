/**
 * @license
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define([
  'ojs/ojcore',
  'knockout',
  'ojs/ojarraydataprovider',
  'ojs/ojknockout-keyset',
  'wrc-frontend/integration/viewModels/utils',
  'ojs/ojlistitemlayout',
  'ojs/ojlistview',
  'ojs/ojselector'
], function (oj, ko, ArrayDataProvider, KeySet, ViewModelUtils) {
  function TableCustomizer(viewParams) {
    const self = this;

    this.dirty = ko.observable(false);

    this.i18n = {
      buttons: {
        apply: {
          id: 'new',
          disabled: false,
          label: oj.Translations.getTranslatedString(
            'wrc-common.buttons.apply.label'
          ),
        },
        cancel: {
          id: 'cancel',
          disabled: false,
          label: oj.Translations.getTranslatedString(
            'wrc-common.buttons.cancel.label'
          ),
        },
        reset: {
          id: 'reset',
          label: oj.Translations.getTranslatedString(
            'wrc-common.buttons.reset.label'
          ),
        },
        ok: {
          id: 'ok',
          label: oj.Translations.getTranslatedString(
            'wrc-common.buttons.ok.label'
          ),
        },
      },
      messages: {
        action: {
          needAtLeastOneColumn: {
            detail: oj.Translations.getTranslatedString(
              'wrc-table-customizer.messages.action.needAtLeastOneColumn.detail'
            ),
            title: oj.Translations.getTranslatedString(
              'wrc-table-customizer.messages.action.needAtLeastOneColumn.title'
            ),
          },
        },
      },
      labels: {
        available: {
          value: oj.Translations.getTranslatedString(
            'wrc-table-customizer.labels.available.value'
          ),
        },
        selected: {
          value: oj.Translations.getTranslatedString(
            'wrc-table-customizer.labels.selected.value'
          ),
        },
      },
    };

    function takeColumnsSnapshot() {
      self.columnsLeftInitial = [...self.columnsLeft()];
      self.columnsRightInitial = [...self.columnsRight()];
    }

    function restoreColumnsFromSnapshot() {
      if (self.columnsLeftInitial) self.columnsLeft([...self.columnsLeftInitial]);
      if (self.columnsRightInitial) self.columnsRight([...self.columnsRightInitial]);
      self.dirty(false);
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

      self.selectedLeftItems.clear();
      self.selectedRightItems.clear();
    };

    this.removeAllButtonClick = (event) => {
      let rightColumns = [...self.columnsRight()];
      rightColumns.reverse()
      rightColumns.forEach(removed => {
        if (removed) {
          self.dirty(true);
          self.columnsLeft.unshift(removed);
        }
      });
      self.columnsRight.removeAll();

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
    };

    this.closeErrorButtonClick = (event) => {
      document.getElementById('noColumnsDialog').close();
    };

    this.applyButtonClick = (event) => {
      // No action to take when control is unchanged
      if (!self.dirty()) return;

      if (self.columnsRight().length === 0) {
        document.getElementById('noColumnsDialog').open();
      } else {
        self.applyCustomizationsCallback(
          self.columnsRight(),
          self.columnsLeft()
        );
        self.dirty(false);

        self.selectedLeftItems.clear();
        self.selectedRightItems.clear();
        takeColumnsSnapshot();

        self.persistCustomization();
      }
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

      self.persistCustomization();
    };

    this.selectedLeftItems = new KeySet.ObservableKeySet();
    this.selectedRightItems = new KeySet.ObservableKeySet();

    self.page = viewParams.page;

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
      let tablePref = (self.tablePrefs ? self.tablePrefs[self.page()] : undefined);

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

    this.initializeCustomization = () => {
      if (ViewModelUtils.isElectronApiAvailable()) {
        return window.electron_api.ipc.invoke('table-prefs-reading')
          .then((reply) => {
            self.tablePrefs = reply;
          });
      }

      return Promise.resolve();
    };

    this.persistCustomization = () => {
      if (ViewModelUtils.isElectronApiAvailable()) {
        // We're running as an Electron app, so use the
        // window.electron_api to write the customizer
        // preference locally
        const nameMapper = (column) => column.name;
        self.tablePrefs[self.page()] = {
          selected: self.columnsRight().map(nameMapper),
        };

        return window.electron_api.ipc.invoke('table-customizing', {
          page: self.page(),
          fileContents: self.tablePrefs[self.page()],
        });
      }
    };

    // Perfrom setup for tables and slice tables when rendered
    this.setupCustomization = () => {
      self.applyDefaultCustomizations();
      takeColumnsSnapshot();
    };

    this.initializeCustomization()
      .then(() => {
        self.setupCustomization();
      });
  }

  return TableCustomizer;
});
