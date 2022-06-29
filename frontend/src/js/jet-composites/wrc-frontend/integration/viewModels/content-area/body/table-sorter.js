/**
 * @license
 * Copyright (c) 2022, Oracle and/or its affiliates.
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
            if (a[sortProperty].data === b[sortProperty].data)
              rtnval = 0;
            else if (a[sortProperty].data === null)
              rtnval = 1;
            else
              rtnval = (a[sortProperty].data > b[sortProperty].data ? 1 : -1);
            return rtnval;
          });
        }
        else {
          rowsArray.sort((a, b) => {
            if (a[sortProperty].data === b[sortProperty].data)
              rtnval = 0;
            else if (a[sortProperty].data === null)
              rtnval = -1;
            else
              rtnval = (a[sortProperty].data < b[sortProperty].data ? 1 : -1);
            return rtnval;
          });
        }
      }
      const options = { keyAttributes: '_id'};
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
