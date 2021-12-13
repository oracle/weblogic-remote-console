# Copyright 2020, 2021, Oracle Corporation and/or its affiliates.  All rights reserved.
# Licensed under the Universal Permissive License v 1.0 as shown at http://oss.oracle.com/licenses/upl.

# cfe-multi-select component

A _cfe-multi-select_ composite component consists of 2 boxes.  Each has a list of items.
The left box displays the items that can be selected, while the right box displays the items that have been selected.
There are 4 controls between these 2 boxes that allow a user to select/deselect items.
Title for the component and header of the 2 boxes can be specified also.

![](images/sample.png?raw=true "")

## Usage and Sample code

## sample.js
```
<div class="oj-hybrid-padding">
  <h1>Customers Content Area</h1>

  <cfe-multi-select
      id="mytest"
      available-header="[[availableHeader]]"
      chosen-header="[[chosenHeader]]"
      available-items="{{availableItems}}"
      checked-available-items="{{checkedAvailableItems}}"
      chosen-items="{{chosenItems}}"
      checked-chosen-items="{{checkedChosenItems}}"
      on-chosen-items-changed="[[chosenItemsChanged]]"
      readonly="false"
  >
  </cfe-multi-select>
</div>

```
### sample.html
```
define(['knockout', 'accUtils',  'ojs/ojknockout', 'wls-multi-select-boxes/loader'],
    function(ko, accUtils) {

    function CustomerViewModel() {
      const self = this;

      this.availableHeader=ko.observable("Available:");
      this.chosenHeader=ko.observable("Chosen:");

      this.availableItems=ko.observableArray([
        {value: 'Administrators', label: 'Administrators'},
        {value: 'AdminChannelUsers', label: 'AdminChannelUsers'},
        {value: 'AppTesters', label: 'AppTesters'},
        {value: 'CrossDomainConnectors', label: 'CrossDomainConnectors'},
        {value: 'Deployers', label: 'Deployers'},
        {value: 'OracleSystemGroup', label: 'OracleSystemGroup'}
      ]);
      this.checkedAvailableItems=ko.observableArray(["AppTesters", "Administrators"]);
      this.chosenItems=ko.observableArray([
        {value: 'Monitors', label: 'Monitors'},
        {value: 'Operators', label: 'Operators'}
      ]);
      this.checkedChosenItems=ko.observableArray([]);

      // Below is a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      this.connected = function() {
        accUtils.announce('Customers page loaded.', 'assertive');
        document.title = "Customers";
        // Implement further logic if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      this.disconnected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      this.transitionCompleted = function() {
        // Implement if needed
      };
    }

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return CustomerViewModel;
  }
);

```

