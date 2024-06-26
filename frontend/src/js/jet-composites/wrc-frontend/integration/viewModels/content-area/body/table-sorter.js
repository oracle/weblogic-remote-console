/**
 * @license
 * Copyright (c) 2022, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['ojs/ojarraydataprovider'],
  function (ArrayDataProvider) {
    function sortRowsArray(rowsArray, keyAttributes, sortEnabled, sortProperty, direction) {
      if (sortEnabled) {
        let rtnval;
        if (direction === 'ascending') {
          rowsArray.sort((a, b) => {
            if (a[sortProperty].label === b[sortProperty].label)
              rtnval = 0;
            else if (a[sortProperty].label === null)
              rtnval = 1;
            else
              rtnval = (a[sortProperty].label > b[sortProperty].label ? 1 : -1);
            return rtnval;
          });
        }
        else {
          rowsArray.sort((a, b) => {
            if (a[sortProperty].label === b[sortProperty].label)
              rtnval = 0;
            else if (a[sortProperty].label === null)
              rtnval = -1;
            else
              rtnval = (a[sortProperty].label < b[sortProperty].label ? 1 : -1);
            return rtnval;
          });
        }
      }
      const options = { keyAttributes: keyAttributes};
      if (sortEnabled && (direction === 'ascending')) options['implicitSort'] = [{ attribute: sortProperty, direction: direction}];
      return new ArrayDataProvider(rowsArray, options);
    }

  //public:
    return {
      sort: (rowsArray, keyAttributes, sortEnabled, sortProperty, direction) => {
        return sortRowsArray(rowsArray, keyAttributes, sortEnabled, sortProperty, direction);
      }

    };

  }
);
