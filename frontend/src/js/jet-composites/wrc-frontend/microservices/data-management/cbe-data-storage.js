/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * A Concrete Class that represents a storage container for specific data (e.g. RDJ, PDJ) returned by the CBE REST API.
 * @module
 * @class
 * @classdesc A Concrete Class that represents a storage container for specific data (e.g. RDJ, PDJ) returned by the CBE REST API.
 * @extends DataStorage
 */
define(['wrc-frontend/core/data-storage', 'wrc-frontend/core/cfe-errors', 'wrc-frontend/core/utils'],
  function (DataStorage, CfeErrors, CoreUtils) {
    // Private, module-scoped variable for holding
    // the data storage items.
    let _items = {};

    /**
     * Creates instance of class used to store data retrieved from the CBE
     * @constructor
     * @param {string} name - Name for the new instance.
     * @throws {InvalidParameterError} If value of ``name`` parameters is ``undefined``, ``null`` or an empty string.
     */
    function CbeDataStorage(name) {
      DataStorage.apply(this);
      if (CoreUtils.isUndefinedOrNull(name) || CoreUtils.isEmpty(name)) {
        throw new CfeErrors.InvalidParameterError('Parameter cannot be undefined, null or an empty string: name');
      }
      this.name = name;
    }

  //public:
    /**
     * Allow properties of ``DataStorage`` abstract class to be access by ``CbeDataStorage``
     * @type {DataStorage}
     */
    CbeDataStorage.prototype = Object.create(DataStorage.prototype, {
      'constructor': CbeDataStorage
    });

    /**
     * Implementation for ``add`` abstract method in ``DataStorage`` abstract class
     */
    CbeDataStorage.prototype.add = function (key, value) {
      _items[key] = value;
    };

    /**
     * Implementation for ``get`` abstract method in ``DataStorage`` abstract class
     */
    CbeDataStorage.prototype.get = function (key) {
      if (typeof _items[key] === 'undefined') {
        throw new CfeErrors.InvalidItemKeyError(`No storage item has "${key}" as the key.`);
      }
      return _items[key];
    };

    /**
     * Implementation for ``put`` abstract method in ``DataStorage`` abstract class
     */
    CbeDataStorage.prototype.put = function (key, value) {
      _items[key] = value;
    };

    /**
     * Implementation for ``remove`` abstract method in ``DataStorage`` abstract class
     */
    CbeDataStorage.prototype.remove = function (key) {
      if (typeof _items[key] === 'undefined') {
        throw new CfeErrors.InvalidItemKeyError(`No storage item has "${key}" as the key.`);
      }
      delete _items[key];
    };

    /**
     * Implementation for ``clear`` abstract method in ``DataStorage`` abstract class
     */
    CbeDataStorage.prototype.clear = function () {
      _items = {};
    };

    // Return CbeDataStorage constructor function.
    return CbeDataStorage;
  }
);
