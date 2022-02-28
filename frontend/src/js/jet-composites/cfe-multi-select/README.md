### Copyright 2020, 2021, Oracle Corporation and/or its affiliates.  All rights reserved.
### Licensed under the Universal Permissive License v 1.0 as shown at http://oss.oracle.com/licenses/upl.

# cfe-multi-select

The ``cfe-multi-select`` composite allows you to choose multiple items, from a list of available items. It consists of: 

* A list box of the available items. Clicking the available item causes it to be checked or un-checked.
* A list box of the chosen items. Clicking the chosen item causes it to be checked or un-checked.
* Four buttons for moving items between the available and chosen list boxes:

    | Name | Action |
    | ---- | ------ |
    | MoveAvailableToChosen | Moves checked available items to the chosen list box.|
    | MoveAllAvailableToChosen | Moves all of the available items to the chosen list box.|
    | MoveChosenToAvailable | Moves checked chosen items to the available list box.|
    | MoveAllChosenToAvailable | Moves all of the chosen items to the available list box.|
    

## Screenshots
![](images/cfe-multi-select-1.png?raw=true "")
<br/>**Figure 1:** Selecting items in the available list box.

![](images/cfe-multi-select-2.png?raw=true "")
<br/>**Figure 2:** Using the ``MoveAvailableToChosen`` button to move checked available items to the chosen list box.

![](images/cfe-multi-select-3.png?raw=true "")
<br/>**Figure 3:** Chosen list box containing items moved from the available list box, showing that they remained checked.

![](images/cfe-multi-select-4.png?raw=true "")
<br/>**Figure 4:** Using the `MoveAllAvailableToChosen` button to move all items (checked or unchecked) to the chosen list box.

![](images/cfe-multi-select-5.png?raw=true "")
<br/>**Figure 5:** Chosen list box containing all the items from the available list box.

## Properties
| Name | Type | Description | Comments |
| ---- | ---- | ------------| -------- |
| availableHeader | string | Value to use for header above the "Available" list box.|Defaults to "Available", if not specified.| 
| chosenHeader | string | Value to use for header above the "Chosen" list box.|Defaults to "Chosen", if not specified.| 
| availableItems | array | The items that are available to be moved to the chosen list box.|| 
| checkedAvailableItems | array | The items that are initially checked in the available list box.|| 
| chosenItems | array | The items that have already been chosen.|| 
| checkedChosenItems | array | The items that are initially checked in the chosen list box.|| 
| readonly | boolean | Makes control operate in readonly mode.|Defaults to false, if not specified.| 

## Methods
| Name | Parameters | Description | Comments |
| ---- | ---- | ------------| -------- |
| addNewChosenItem | {object} newChosenItem | Add a new item to the chosen items list box.|| 

## Events
| Name | Detail | Comments |
| ---- | ---- | -------- |
| chosenItemsChanged| {array} chosenItems|Triggered when an item is added or removed from the chosen list.|

## Usage and Sample code

### sample.html
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
### sample.js
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