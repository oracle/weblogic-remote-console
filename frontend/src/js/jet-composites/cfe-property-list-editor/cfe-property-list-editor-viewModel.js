/**
 Copyright (c) 2015, 2022, Oracle and/or its affiliates.
 Licensed under The Universal Permissive License (UPL), Version 1.0
 as shown at https://oss.oracle.com/licenses/upl/

 */
'use strict';

define(['knockout', 'ojs/ojarraydataprovider', 'ojs/ojbufferingdataprovider', 'cfe-property-list-editor/observable-properties', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/utils', 'ojs/ojtreeview', 'ojs/ojcorerouter',
    'ojs/ojmodulerouter-adapter', 'ojs/ojtable', 'ojs/ojbutton', 'ojs/ojformlayout', 'ojs/ojvalidationgroup'],

  function (ko, ArrayDataProvider, BufferingDataProvider, props, ViewModelUtils, CoreUtils) {

    function PropertiesEditorViewModel(context) {
      const self = this;

      this.nameHeaderLabel = context.properties.nameHeaderLabel;
      this.valueHeaderLabel = context.properties.valueHeaderLabel;
      this.addButtonTooltip = context.properties.addButtonTooltip;
      this.deleteButtonTooltip = context.properties.deleteButtonTooltip;

      this.editMode = 'none';
      this.propertyListSnapshot = [];
      this.isWritable = (CoreUtils.isUndefinedOrNull(context.properties.readonly) ? true : !context.properties.readonly);

      this.columnData = [
        {
          'headerText': this.nameHeaderLabel,
          'sortProperty': 'Name',
          'resizable': 'enabled'
        },
        {
          'headerText': this.valueHeaderLabel,
          'sortProperty': 'Value',
          'resizable': 'enabled'
        }
      ];

      if (this.isWritable){
        this.columnData.push(
          {
            'className': 'cfe-table-delete-cell',
            'headerClassName': 'cfe-table-add-header',
            'headerTemplate': 'headerTemplate',
            'template': 'actionTemplate',
            'sortable': 'disable',
            // width of delete button column in  tables.
            // ideally this could be specified as 'auto', but oj-table will not set below 100px.
            width: '55px'
          }
        );
        this.editMode = 'rowEdit';
      }

      this.propertiesContent = getPropertiesContent(context.properties.propertiesString);
      this.theObservableArray = this.propertiesContent.observable;

      this.propertyChanged = function (context) {
        switch (context.property) {
          case 'propertiesString':
            self.propertiesContent = getPropertiesContent(context.value);
            break;
        }
      };

      // use unique ID (uid) as key in the UI only, in case name changes
      this.propertiesDataProvider = new BufferingDataProvider(
        new ArrayDataProvider(
          this.theObservableArray,
          {
            keyAttributes: 'uid',
            sortComparators: getSortComparators(this.columnData)
          }
        )
      );

      this.handleAddRow = (event) => {
        addPropertiesContentItem.call(this);
      };

      this.handleDeleteRow = (event) => {
        // Get uid from data-uid attribute
        const uid = parseInt(event.currentTarget.attributes['data-uid'].value);
        // Look for property list item with a uid value that
        // matches value stored in data-uid attribute.
        const rowIndex = self.propertiesContent.value.map(property => property.uid).indexOf(uid);
        // Delete found item from self.theObservableArray
        self.theObservableArray.remove(function (item) { return item.uid === uid; });
        // See if there are any property list items left
        if (self.propertiesContent.value.length === 0) {
          // There aren't, so JET isn't going to trigger the
          // onAnimateEndListener event. This means we need
          // to programmatically call the same function called
          // when JET triggers the onAnimateEndListener event.
          removePropertyListSnapshotItem(rowIndex);
        }
      };

      this.onAnimateEndListener = (event) => {
        if (event.detail.action === 'remove') {
          const rowIndex = event.currentTarget.currentRow.rowIndex;
          removePropertyListSnapshotItem(rowIndex);
        }
      };

      this.onBeforeRowEditEndListener = (event) => {
        if (event.detail.rowContext.mode === 'edit') {
          // A blur event must occur to get the latest row values
          // entered by the user, so trigger it here. Doing that
          // updates event.detail.rowContext.item.data with the
          // latest row values.
          ViewModelUtils.blurActiveElement();
          // Get latest row values.
          const data = event.detail.rowContext.item.data;
          // Look for property list item with a uid value that
          // matches data.uid.
          const index = self.propertiesContent.value.map(property => property.uid).indexOf(data.uid);
          if (index !== -1) {
            // Found one, so see if end user is trying to do
            // something invalid, which is make the in "Name"
            // column an empty string.
            if (data.Name.trim() === '') {
              // They are, so we either need to restore it from the
              // previous value or remove the row.
              if (CoreUtils.isNotUndefinedNorNull(self.propertyListSnapshot[index])) {
                // Restore it from the previous value.
                data.Name = self.propertyListSnapshot[index].name;
              }
              else {
                // Remove the row. setTimeout must be used to do this
                // "in the future", or else the JET code for oj-table
                // will generate errors in the JS console.
                setTimeout(() => { data.remove();}, 5);
              }
            }
            // Update property list item used by oj-table JET control
            self.propertiesContent.value[index] = data;
            // Send blur event event, so form gets the opportunity to
            // add "Properties" to it's dirtyFields set.
            sendBlurEvent();
          }
        }
      };

      this.getPropertyListChangeResults = () => {
        // Declare array of current property list properties
        const properties = self.theObservableArray();
        // Declare return variable for function
        const results = {values: {}, details: [], isEmpty: (properties.length === 0)};

        if (self.propertyListSnapshot.length > 0) {
          // First, get propertyListSnapshot items that where deleted
          const filtered = self.propertyListSnapshot.filter(item => item.action === 'deleted');
          filtered.forEach((item) => {
            // Create results.details for filtered item
            results.details.push({uid: item.uid, action: item.action});
          });

          // Next, loop through properties to find propertyListSnapshot
          // item that may need results.values and results.details entries.
          properties.forEach((property) => {
            const attributesChanged = [];
            // Look for index of propertyListSnapshot item with a uid
            // that matches property.uid.
            const index = self.propertyListSnapshot.map(item => item.uid).indexOf(property.uid);
            if (index !== -1) {
              // Found it, so see whether Name or Value was updated
              if (self.propertyListSnapshot[index].name !== property.Name) attributesChanged.push('Name');
              if (self.propertyListSnapshot[index].value !== property.Value) attributesChanged.push('Value');
              if (property.Name.trim() !== '' && attributesChanged.length > 0) {
                // Either Name or Value were updated, so use property
                // to create results.value and results.details entries.
                results.values[property.Name] = property.Value;
                results.details.push({uid: self.propertyListSnapshot[index].uid, action: 'updated'});
              }
            }
            else if (property.Name.trim() !== '') {
              // Didn't find it, so use property to create results.value
              // and "added" results.details entries.
              results.values[property.Name] = property.Value;
              results.details.push({uid: property.uid, action: 'added'});
            }
          });
        }
        else {
          // There are no propertyListSnapshot items, so the
          // propertiesString control property must have been an
          // empty string. We'll need to create results.value and
          // results.details entries from the properties variable.
          properties.forEach((property) => {
            if (property.Name.trim() !== '') {
              results.values[property.Name] = property.Value;
              results.details.push({uid: property.uid, action: 'added'});
            }
          });
        }

        if (results.details.length > 0) {
          const filtered = self.propertyListSnapshot.filter(item => item.action !== 'deleted');
          filtered.forEach((item) => {
            const index = properties.map(property => property.uid).indexOf(item.uid);
            if (index !== -1 && properties[index].Name.trim() !== '') {
              results.values[properties[index].Name] = properties[index].Value;
            }
          });
        }

        return results;
      };

      this.updatePropertyListSnapshot = () => {
        const properties = self.theObservableArray();
        // Remove propertyListSnapshot items with action === 'deleted'
        self.propertyListSnapshot = self.propertyListSnapshot.filter(item => item.action !== 'deleted');
        properties.forEach((property) => {
          const index = self.propertyListSnapshot.map(item => item.uid).indexOf(property.uid);
          if (index !== -1) {
            // Update self.propertyListSnapshot item
            self.propertyListSnapshot[index].name = property.Name;
            self.propertyListSnapshot[index].value = property.Value;
          }
          else {
            // Create self.propertyListSnapshot item
            self.propertyListSnapshot.push({uid: property.uid, name: property.Name, value: property.Value});
          }
        });
      };

      function compareValues(a, b) {
        a = a ? a.toString() : '';
        b = b ? b.toString() : '';
        if (a === b) {
          return 0;
        }
        return a < b ? -1 : 1;
      }

      function getSortComparators(columnData) {
        const map = new Map();
        for (const column of columnData) {
          let sortProperty = column['sortProperty'];
          if (sortProperty) map.set(sortProperty, compareValues);
        }
        return {comparators: map};
      }

      function createPropertiesObject(propertiesMap) {
        const items = createPropertyListSnapshot(propertiesMap);
        if (items.length > 0) {
          items.forEach((item) => {
            self.propertyListSnapshot.push({uid: item.uid, name: item.Name, value: item.Value});
          });
        }
        return props.createListProperty(['uid', 'Name', 'Value', 'Override']).withDefaultValue(items);
      }

      function createPropertyListSnapshot(propertiesMap) {
        let uid = 0;
        const result = [];
        if (propertiesMap != null) {
          for (const [Name, Value] of Object.entries(propertiesMap)) {
            result.push({uid, Name, Value, undefined});
            uid++;
          }
          result.sort();
        }
        return result;
      }

      function removePropertyListSnapshotItem(rowIndex) {
        if (CoreUtils.isNotUndefinedNorNull(self.propertyListSnapshot[rowIndex])) {
          self.propertyListSnapshot[rowIndex]['action'] = 'deleted';
          sendBlurEvent();
        }
      }

      function convertToPropertiesMap(propertiesString = '') {
        let rtnval = {};
        if (propertiesString !== null && propertiesString.length > 0) {
          try {
            rtnval = JSON.parse(propertiesString);
          }
          catch(err) {
            rtnval = {};
          }
        }
        return rtnval;
      }

      function getPropertiesContent(propertiesString) {
        const propertiesMap = convertToPropertiesMap(propertiesString);
        return createPropertiesObject(propertiesMap);
      }

      function addPropertiesContentItem() {
        const uids = [];
        const names = [];
        self.theObservableArray().forEach(item => {
          uids.push(item.uid);
          names.push(item.Name);
        });
        let nextUid = 0;
        while (uids.indexOf(nextUid) !== -1) {
          nextUid++;
        }
        let nextIndex = 0;
        while (names.indexOf(`new-property-${nextIndex + 1}`) !== -1) {
          nextIndex++;
        }
        self.propertiesContent.addNewItem({uid: nextUid, Name: `new-property-${nextIndex + 1}`, Value: ''});
      }

      function sendBlurEvent() {
        const params = {
          'bubbles': true,
          'target': {'id': context.properties.propertyListName}
        };
        context.element.dispatchEvent(new CustomEvent('blur', params));
      }
    }

    return PropertiesEditorViewModel;
  }
);