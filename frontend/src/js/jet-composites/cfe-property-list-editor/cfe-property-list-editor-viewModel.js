/**
 Copyright (c) 2015, 2022, Oracle and/or its affiliates.
 Licensed under The Universal Permissive License (UPL), Version 1.0
 as shown at https://oss.oracle.com/licenses/upl/

 */
'use strict';

define(['knockout', 'ojs/ojarraydataprovider', 'ojs/ojbufferingdataprovider', 'cfe-property-list-editor/observable-properties', 'ojs/ojtreeview', 'ojs/ojcorerouter',
    'ojs/ojmodulerouter-adapter', 'ojs/ojtable', 'ojs/ojbutton', 'ojs/ojformlayout', 'ojs/ojvalidationgroup'],

  function (ko, ArrayDataProvider, BufferingDataProvider, props) {

    function PropertiesEditorViewModel(context) {
      const self = this;
      const origPropsString = (context.properties.propertiesString !== 'undefined' ? context.properties.propertiesString : undefined);
      const origPropsMap = null;
      this.editMode = 'none';

      this.nameHeaderLabel = context.properties.nameHeaderLabel;
      this.valueHeaderLabel = context.properties.valueHeaderLabel;
      this.propertiesMap = this.origPropsMap = convertToMap(origPropsString);
      this.addButtonTooltip = context.properties.addButtonTooltip;
      this.deleteButtonTooltip = context.properties.deleteButtonTooltip;

      if (typeof context.properties.readonly === 'undefined')
        this.propertyListEditorRW = true;
      else
        this.propertyListEditorRW = !(context.properties.readonly);

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

      if (this.propertyListEditorRW){
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

      console.log('[cfe-property-list-editor] propertiesMap = `this.propertiesMap`');
      this.propertiesContent = createPropertiesObject(this.propertiesMap);
      this.theObservableArray = this.propertiesContent.observable;
      const sortComparators = getSortComparators(this.columnData);

      // use unique ID (uid) as key in the UI only, in case name changes
      this.propertiesDataProvider = new BufferingDataProvider(
        new ArrayDataProvider( this.theObservableArray, {keyAttributes: 'uid', sortComparators: sortComparators}));

      function addProperty() {
        const uids = [];
        const names = [];
        this.theObservableArray().forEach(item => {
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
        this.propertiesContent.addNewItem({uid: nextUid, Name: `new-property-${nextIndex + 1}`, Value: ''});
        sendBlurEvent();
      }

      function sendBlurEvent() {
        const params = {
          'bubbles': true,
          'target': {'id': 'Properties'}
        };
        context.element.dispatchEvent(new CustomEvent('blur', params));
      }

      this.handleAddRow = (event) => {
        addProperty.call(this);
      };

      this.onAnimateEndListener = (event) => {
        const action = event.detail.action;
        switch(action) {
          case 'remove':
            sendBlurEvent();
            break;
        }
      };

      this.onBeforeRowEditEndListener = (event) => {
        // Trigger blur event if user is editing a row, and the
        // value in the "Name" column doesn't contain "new-property".
        if (event.detail.rowContext.mode === 'edit') {
          const data = event.detail.rowContext.item.data;
          const index = this.propertiesContent.value.map(property => property.uid).indexOf(data.uid);
          if (index !== -1) {
            this.propertiesContent.value[index] = data;
            sendBlurEvent();
          }
        }
      };

      this.getUpdatedProperties = () => {
        const currentV = self.theObservableArray();
        let currentMap = {};
        currentV.forEach((item) => {
          currentMap[item.Name] = item.Value;
        });
        console.log(currentMap);
        const isSame = shallowEqual(currentMap, self.origPropsMap);
        return (isSame) ? {} : currentMap;
      };

      //If the Name or Value of the probably is allowed to be Object, we will need to
      //enhance this comparison.
      function shallowEqual(object1, object2) {
        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);
        if (keys1.length !== keys2.length) {
          return false;
        }
        for (let key of keys1) {
          if (object1[key] !== object2[key]) {
            return false;
          }
        }
        return true;
      }

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
          if (sortProperty) {
            map.set(sortProperty, compareValues);
          }
        }
        return {comparators: map};
      }

      function createPropertiesObject(propertiesMap) {
        let uid = 0;
        const result = [];
        if (propertiesMap != null) {
          for (const [Name, Value] of Object.entries(propertiesMap)) {
            //for (const [Name, Value] of propertiesMap) {
            result.push({uid, Name, Value, undefined});
            uid++;
          }
          result.sort();
        }
        // uid is unique ID for each list entry in the UI only, in case Name changes
        return props.createListProperty(['uid', 'Name', 'Value', 'Override']).withDefaultValue(result);
      }

      function convertToMap(propertiesString) {
        if (!propertiesString || propertiesString.length === 0 )
          return {};
        return JSON.parse(propertiesString);
      }
    }

    PropertiesEditorViewModel.prototype = {
      _getUpdatedProperties: function() {
        return this.getUpdatedProperties();
      }
    };
    return PropertiesEditorViewModel;
  }
);