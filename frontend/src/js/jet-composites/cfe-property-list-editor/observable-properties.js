/**
 * @license
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['knockout'],
  function (ko) {


    function trimmed(value) {
      return (typeof value === 'string') ? value.trim() : value;
    }

    /**
     * A property whose underlying value is an array of objects, intended for use with oj-table.
     */
    class ListProperty {
      /**
       * Creates a new ListProperty object.
       *
       * @param keys - the list of property names for the element objects in the list.
       */
      constructor(keys) {
        if (!Array.isArray(keys) || keys.length === 0) {
          throw new Error('List property may not be created without keys');
        }

        this._defaultValue = [];
        this._persistedValue = undefined;
        this._keys = keys;
        this._observable = null;
        this._returnEmptyFields = true;
      }

      // if specified, the primary key is not considered to be data
      isDataKey(key) {
        return key !== this._primaryKey;
      }

      getPromise() {
        return null;
      }

      ignoringEmptyFields() {
        this._returnEmptyFields = false;
        return this;
      }

      setDefaultValue(defaultValue) {
        if (!this._persistByKey) {
          this.doSetDefault(defaultValue);
        } else {
          const savedValue = this.persistedValue || {};
          this.doSetDefault(defaultValue);
          this.persistedValue = savedValue;
        }
      }

      doSetDefault(defaultValue) {
        if (typeof defaultValue !== 'undefined' && !Array.isArray(defaultValue)) {
          throw new Error(`Default value of type ${typeof defaultValue} not allowed`);
        }

        this._defaultValue = defaultValue;
        this._persistedValue = this.persistedValue;
      }

      withDefaultValue(defaultValue) {
        this.doSetDefault(defaultValue);
        return this;
      }

      persistByKey(primaryKey) {
        this._primaryKey = primaryKey;
        this._persistByKey = true;
        this._persistedValue = this.persistedValue;
        return this;
      }

      // computes the effective value for this property, using the defaults to fill in unspecified values
      createArrayItem(self, element) {
        const result = {};
        this._keys.forEach(key => result[key] = element[key]);

        if (!this._primaryKey) {
          result['remove'] = function () {
            self.observable.remove(result);
          };
        }

        return result;
      }

      createList(value) {
        if (typeof value === 'undefined') {
          return [];
        } else {
          return value.map(e => this.createArrayItem(this, e));
        }
      }

      addNewItem() {
        this.observable.push(this.createArrayItem(this, arguments.length === 0 ? {} : arguments[0]));
      }

      //returns an observable for the property value that can be associated with a GUI element
      get observable() {
        if (this._observable == null) {
          this._observable = ko.observableArray(this.createList(this._defaultValue));
        }
        return this._observable;
      }

      addIfDefined(result, key, value) {
        if (value || this._returnEmptyFields) result[key] = value;
      }

      extractArrayItem(element) {
        const result = {};
        this._keys.forEach(key => this.addIfDefined(result, key, trimmed(element[key])));
        return result;
      }

      anyPropertyDefined(element) {
        return Object.keys(element).find(key => this.isDataKey(key) && (element[key] || element[key] === 0));
      }

      // returns the current value of the property
      get value() {
        return this.observable().map(e => this.extractArrayItem(e)).filter(e => this.anyPropertyDefined(e));
      }

      // sets the value of the property
      set value(newValue) {
        const updatedList = this.createList(newValue);
        this.observable(updatedList);
      }

      getDefaultWithKey(key) {
        return this._defaultValue.find(item => item[this._primaryKey] === key) || {};
      }

      ifNonEmpty(obj) {
        return Object.keys(obj).length > 0 ? obj : null;
      }

      getChanges(item) {
        const matchingDefault = this.getDefaultWithKey(item[this._primaryKey]);
        const result = {};
        for (const key of Object.keys(item).filter(k => k !== this._primaryKey)) {
          if (item[key] !== matchingDefault[key]) result[key] = item[key];
        }
        return this.ifNonEmpty(result);
      }

      // returns the value to persist - if undefined, indicates that nothing should be persisted
      get persistedValue() {
        if (!this._primaryKey || !this._persistByKey) {
          return super.persistedValue;
        } else if (!this.hasValue()) {
          return undefined;
        } else {
          return this.ifNonEmpty(this.computePerKeyPersistedValue());
        }
      }

      computePerKeyPersistedValue() {
        const result = {};
        for (const item of this.value) {
          const changes = this.getChanges(item);
          if (changes) result[item[this._primaryKey]] = changes;
        }
        return result;
      }

      // sets the value to what was persisted
      set persistedValue(newValue) {
        function getNewValue(primaryKeyName, primaryKeyValue, values, keys) {
          let result;
          if (values || typeof(values) === 'object') {
            result = {};
            result[primaryKeyName] = primaryKeyValue;
            for (const key of keys) {
              if (values[key] !== undefined) {
                if (values[key] !== null) {
                  if (typeof values[key] === 'string') {
                    if (values[key]) {
                      result[key] = values[key];
                    }
                  } else {
                    result[key] = values[key];
                  }
                } else {
                  // we really only want to allow this for numeric fields but there is no way to tell...
                  result[key] = values[key];
                }
              }
            }
          }
          return result;
        }

        if (Array.isArray(newValue)) {
          super.persistedValue = newValue;
        } else if (this._persistByKey && typeof newValue === 'object') {
          let values = this._defaultValue;
          if (newValue && Object.keys(newValue).length > 0) {
            const updatedValues = [];
            for (const [entryKey, entryValues] of Object.entries(newValue)) {
              const updatedValue = getNewValue(this._primaryKey, entryKey, entryValues, this._keys);
              if (updatedValue) {
                updatedValues.push(updatedValue);
              }
            }
            if (updatedValues.length > 0) {
              values = updatedValues;
            }
          }
          super.persistedValue = values;
        }
        this._persistedValue = this.persistedValue;
      }

      // resets the value of the property to its default
      clear() {
        if (this._observable !== null) {
          this.value = this._defaultValue;
        }
        this._persistedValue = this.persistedValue;
      }

      // returns true if the property has a value that differs from its default
      hasValue() {
        if (this._observable === null) return false;

        return !this.isEquals(this.value, this._defaultValue);
      }

      // returns true if the property has a value that differs from its persisted value
      isChanged() {
        return !this.isEquals(this.persistedValue, this._persistedValue);
      }

      setNotChanged() {
        this._persistedValue = this.persistedValue;
      }

      /**
       * Returns true if the two objects are equal. This can compare scalars,
       * strings, arrays, and object.
       * @param obj1 the first object to compare
       * @param obj2 the second object to compare
       */
      isEquals(obj1, obj2) {
        if (obj1 === obj2) return true;
        if (obj1 === null || obj2 === null) return false;
        if (typeof obj1 !== typeof obj2) return false;
        if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

        if (Array.isArray(obj1)) return this.arraysEqual(obj1, obj2);
        if (typeof obj1 === 'object') return this.objectsEqual(obj1, obj2);

        return false;
      }

    }

    return {
      /**
       * Creates a property whose observable is a knockout observable array, each element of which is an object
       * with observables for each its properties. In addition, each object has a property named 'remove' which is
       * a function that will remove that object from the observable array.
       *
       * The value of this property is an array of objects, whose keys correspond to the keys in the observable objects,
       * and whose values are those observable's values.
       *
       * If the 'keys' parameter is specified, object field names not listed will be ignored.
       *
       * The property has a method, 'addNewItem' which will add an object to the observable array, with empty values
       * for each of the specified keys. If no keys are specified, 'addNewItem' throws an exception.
       *
       * @param keys an optional list of keys to retain in setting this property's value.
       */
      createListProperty: function(keys) {
        return new ListProperty(keys);
      }
    };
  }
);
