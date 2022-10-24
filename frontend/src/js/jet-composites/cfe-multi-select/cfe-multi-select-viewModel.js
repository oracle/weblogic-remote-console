/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['knockout', 'ojs/ojarraydataprovider', 'ojs/ojcontext', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojcheckboxset', 'ojs/ojlabel'],
  function (ko, ArrayDataProvider, Context) {

    function MultiSelectViewModel(context) {

      const self = this;

      // Declare and initialize the public, instance variable for
      // storing items that appear in availableCheckboxset. Initially
      // those will be all the items in dataArray, so we can just
      // assign it a clone of dataArray.
      //this.availableItems = getDataArrayClone();
      this.availableItems = ko.observableArray(context.properties.availableItems);

      // Declare and initialize the public, instance variable for
      // storing items that appear in chosenCheckboxset. Initially
      // it will be empty, so all we need to do is assign [] to it.
      this.chosenItems = ko.observableArray(context.properties.chosenItems);

      // readonly mode - whether a multilist devolves to a readonly checkboxset 
      // of chosen items
      this.readonly = ko.observable(typeof context.properties.readonly !== 'undefined' ? context.properties.readonly: false);
      
      // Declare and initialize the public, instance variable for
      // storing which oj-option elements in availableCheckboxSet,
      // have been (or need to be) checked. This instance variable
      // is assigned to the "options" attribute of availableCheckboxSet,
      // and is backed by the previously declared availableItems
      // instance variable. You basically modify availableItems to
      // determine the oj-option elements that appear in the
      // availableCheckboxSet oj-checkboxset element.
      this.availableArrayDataProvider = new ArrayDataProvider(this.availableItems, {keyAttributes: 'value'});

      // Declare and initialize the public, instance variable for
      // storing which oj-option elements in chosenCheckboxSet, have
      // (or need to be) checked. This instance variable
      // is assigned to the "options" attribute of availableCheckboxSet,
      // and is backed by the previously declared availableItems
      // instance variable. You basically modify availableItems to
      // determine the oj-option elements that appear in the
      // availableCheckboxSet oj-checkboxset element.
      this.chosenArrayDataProvider = new ArrayDataProvider(this.chosenItems, {keyAttributes: 'value'});

      // Declare and initialize the public, instance variable for
      // storing which oj-option elements appearing in availableCheckboxSet,
      // have been checked. Later, you'll see how to programmatically
      // manipulate the checkedAvailableItems variable, in order to put or
      // remove a check from an oj-option element. We initialize it to
      // be an empty array.

      this.checkedAvailableItems = ko.observableArray(context.properties.checkedAvailableItems);

      // Declare and initialize the public, instance variable for
      // storing which oj-option elements appearing in chosenCheckboxSet,
      // have been checked. We initialize it to be an empty array.
      this.checkedChosenItems = ko.observableArray(context.properties.checkedChosenItems);

      this.availableHeader = ko.observable(context.properties.availableHeader);
      this.chosenHeader = ko.observable(context.properties.chosenHeader);

      this.setBusyContext = () => {
        self.busyContext = Context.getContext(context.element).getBusyContext();
      };

      this.addBusyState = () => {
        const options = {'description': 'Web Component Startup - Waiting for data'};
        return self.busyContext.addBusyState(options);
      };

      this.connected = () => {
        this.setBusyContext();

        this.busyContext.whenReady()
          .then(() => {
            const resolve = this.addBusyState();
            this.composite = context.element;
            $('#available-chosen-container').css({width: context.properties.displayWidth});
            resolve();
          });
      };

      this.propertyChanged = function (context) {
        switch (context.property) {
          case 'readonly':
            self.readonly(context.value);
            break;
        }
      };

      // The following line shows how you put checks in
      // oj-option elements, of availableCheckboxSet
      //this.checkedAvailableItems(["AppTesters"]);

      this.checkedAvailableItemsIsEmpty = () => {
        return (self.checkedAvailableItems().length === 0);
      };

      this.checkedChosenItemsIsEmpty = () => {
        return (self.checkedChosenItems().length === 0);
      };

      this.addToChosenButtonClick = (event) => {
        addToChosenHandler(self.checkedAvailableItems);
        dispatchChosenItemsChangedEvent();
      };

      this.addToAvailableButtonClick = (event) => {
        addToAvailableHandler(self.checkedChosenItems);
        dispatchChosenItemsChangedEvent();
      };

      this.addAllToChosenButtonClick = (event) => {
        if (self.readonly()) {
          event.preventDefault();
          return false;
        }
        let removedItems = self.availableItems.removeAll();
        self.chosenItems.valueWillMutate();
        ko.utils.arrayPushAll(self.chosenItems(), [...removedItems]);
        self.chosenItems.valueHasMutated();
        self.checkedAvailableItems([]);
        self.checkedChosenItems([]);
        dispatchChosenItemsChangedEvent();
      };

      this.addAllToAvailableButtonClick = (event) => {
        if (self.readonly()) {
          event.preventDefault();
          return false;
        }
        this.clearAllChosenItems();
        dispatchChosenItemsChangedEvent();
      };

      this.clearAllChosenItems = () => {
        let removedItems = self.chosenItems.removeAll();
        self.availableItems.valueWillMutate();
        ko.utils.arrayPushAll(self.availableItems(), [...removedItems]);
        self.availableItems.valueHasMutated();
        self.checkedAvailableItems([]);
        self.checkedChosenItems([]);
      }

      this.addNewChosenItem = (newChosenItem) => {
        let existingItem = self.availableItems().find(item => item.label === newChosenItem.label);
        if (typeof existingItem === 'undefined') {
          existingItem = self.chosenItems().find(item => item.label === newChosenItem.label);
          if (typeof existingItem === 'undefined') {
            self.chosenItems.valueWillMutate();
            self.chosenItems().push({value: JSON.stringify(newChosenItem), label: newChosenItem.label});
            self.chosenItems.valueHasMutated();
            self.checkedChosenItems([JSON.stringify(newChosenItem)]);
            dispatchChosenItemsChangedEvent();
          }
        }
      };

      function dispatchChosenItemsChangedEvent() {
        let chosen = [];
        self.chosenItems().forEach((chosenItem) => {
          chosen.push(chosenItem);
        });
        // Fire a custom event
        const params = {
          'bubbles': true,
          'detail': {'value': chosen }
        };
        context.element.dispatchEvent(new CustomEvent('chosenItemsChanged', params));
      }

      function addToChosenHandler(choices) {
        let results = [];
        let len = self.availableItems().length;
        choices().forEach(function (choice) {
          for (let i = 0; i < len; i++) {
            if (self.availableItems()[i].value === choice) {
              results.unshift(i);
              break;
            }
          }
        });
        self.availableItems.valueWillMutate();
        self.chosenItems.valueWillMutate();
        let remaining = [];
        self.availableItems().forEach((availableItem, index) => {
          if (results.includes(index)) {
            self.chosenItems().push(availableItem);
          }
          else {
            remaining.push(availableItem);
          }
        });
        self.availableItems(remaining);
        self.availableItems.valueHasMutated();
        self.chosenItems.valueHasMutated();

        self.checkedChosenItems.valueWillMutate();
        self.checkedChosenItems(self.checkedAvailableItems());
        self.checkedChosenItems.valueHasMutated();
        self.checkedAvailableItems.valueWillMutate();
        self.checkedAvailableItems([]);
        self.checkedAvailableItems.valueHasMutated();
      }

      function addToAvailableHandler(choices) {
        let results = [];
        let len = self.chosenItems().length;
        choices().forEach(function (choice) {
          for (let i = 0; i < len; i++) {
            if (self.chosenItems()[i].value === choice) {
              results.unshift(i);
              break;
            }
          }
        });
        self.chosenItems.valueWillMutate();
        self.availableItems.valueWillMutate();
        let remaining = [];
        self.chosenItems().forEach((chosenItem, index) => {
          if (results.includes(index)) {
            self.availableItems().push(chosenItem);
          }
          else {
            remaining.push(chosenItem);
          }
        });
        self.chosenItems(remaining);
        self.chosenItems.valueHasMutated();
        self.availableItems.valueHasMutated();

        self.checkedAvailableItems.valueWillMutate();
        self.checkedAvailableItems(self.checkedChosenItems());
        self.checkedAvailableItems.valueHasMutated();
        self.checkedChosenItems.valueWillMutate();
        self.checkedChosenItems([]);
        self.checkedChosenItems.valueHasMutated();
      }

      function filteredAvailableItems(choice) {
        return ko.utils.arrayFilter(self.availableItems(), function (item) {
          return (item.value !== choice);
        });
      }

      function filteredChosenItems(choice) {
        return ko.utils.arrayFilter(self.chosenItems(), function (item) {
          return (item.value !== choice);
        });
      }

    }

    MultiSelectViewModel.prototype = {
      _addNewChosenItem: function(newChosenItem) {
        this.addNewChosenItem(newChosenItem);
      },

      _clearAllChosenItems: function() {
        this.clearAllChosenItems();
      }
    };

    return MultiSelectViewModel;
  });
