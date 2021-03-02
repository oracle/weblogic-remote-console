/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define([],
  function () {

    function parseQueryString(url) {
      let queryString = url.split("?").pop(), qd = {};
      queryString.split("&").forEach(function (item) { var s = item.split("="), k = s[0], v = s[1] && decodeURIComponent(s[1]); (qd[k] = qd[k] || []).push(v) });
      return qd;
    }

    function getSliceFromPDJUrl(pdjUrl) {
      const qd = parseQueryString(pdjUrl);
      return qd['view'][0];
    }

    function pathSegmentsFromIdentity(id) {
      var pathSegments = [];

      for (let i = 0; i < id.path.length; i++) {
        var pathSegment = id.path[i];
        if (typeof pathSegment.key !== 'undefined' && pathSegment.key != null) {
          pathSegments.push(pathSegment.property);
          pathSegments.push(pathSegment.key);
        }
        else if (typeof pathSegment.property !== 'undefined' && pathSegment.property != null) {
          pathSegments.push(pathSegment.property);
        }
        else {
          pathSegments.push(pathSegment.type);
        }
      }

      return pathSegments;
    }

    function pathEncodedFromIdentity(id) {
      var path = "";
      var pathSegments = pathSegmentsFromIdentity(id);

      if (pathSegments.length > 0) {
        for (let i = 0; i < pathSegments.length; i++) {
          pathSegments[i] = encodeURIComponent(pathSegments[i]);
        }
        path = pathSegments.join('/');
      }

      return path;
    }

    function breadcrumbsFromIdentity(id) {
      let breadcrumbs = '';

      for (let i = 0; i < id.path.length; i++) {
        const pathSegment = id.path[i];

        if (i !== 0) breadcrumbs += '/';

        if (typeof pathSegment.key !== 'undefined' && pathSegment.key != null) {
          breadcrumbs += encodeURIComponent(pathSegment.propertyLabel) + '/' + encodeURIComponent(pathSegment.key);
        } else if (typeof pathSegment.propertyLabel !== 'undefined' && pathSegment.propertyLabel != null) {
          breadcrumbs += encodeURIComponent(pathSegment.propertyLabel);
        } else {
          breadcrumbs += encodeURIComponent(pathSegment.typeLabel);
        }
      }

      return breadcrumbs;
    }

    function displayNameFromIdentity(id) {
      let displayName = "";
      if (typeof id !== "undefined" && typeof id.path !== "undefined") {
        const lastPathSegment = id.path[id.path.length - 1];

        if (typeof lastPathSegment.key !== 'undefined') {
          displayName = lastPathSegment.key;
        } else if (typeof lastPathSegment.propertyLabel !== 'undefined') {
          displayName = lastPathSegment.propertyLabel;
        }
        else {
          displayName = lastPathSegment.typeLabel;
        }
      }

      return displayName;
    }

    function parentPropertyFromIdentity(id) {
      let parentProperty;
      const lastPathSegment = id.path[id.path.length-1];

      if (typeof lastPathSegment.property !== "undefined") {
        parentProperty = lastPathSegment.property;
      }
      else {
        parentProperty = lastPathSegment.type;
      }

      return parentProperty;
    }

    function getFirstHTMLParagraph(htmlString) {
      const result = htmlString.match(/<p>(.*?)<\/p>/);
      return (result !== null ? `<p>${result[1]}</p>` : htmlString);
    }

    function isUndefinedOrNull(value) {
//      return (typeof value === "undefined" || value === null);
      return (value == null);
    }

    function isNotUndefinedNorNull(value) {
//      return (typeof value !== "undefined" && value !== null);
      return (value != null);
    }

    function getSubstring(value, searchFor) {
      let result = value;
      if (isNotUndefinedNorNull(value)) {
        const index = (value.indexOf(searchFor) !== -1 ? value.indexOf(searchFor) : value.length);
        result = value.substr(0, index);
      }
      return result;
    }

    function isEquivalent(a, b) {
      // Create arrays of property names
      var aProps = Object.getOwnPropertyNames(a);
      var bProps = Object.getOwnPropertyNames(b);

      // If number of properties is different,
      // objects are not equivalent
      if (aProps.length !== bProps.length) {
        return false;
      }

      for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
          return false;
        }
      }

      // If we made it this far, objects
      // are considered equivalent
      return true;
    }

    function getNthOccurrenceIndex(searchIn, searchFor, occurence){
      const size = searchIn.length;
      let i = -1;
      while(occurence-- && i++ < size){
        i= searchIn.indexOf(searchFor, i);
        if (i < 0) break;
      }
      return i;
    }

    function removeTrailingSlashes(path) {
      if (typeof path !== "undefined" && path.length > 0) {
        while (path.substring(path.length -1) === "/") {
          path = path.slice(0, -1);
        }
      }
      return path;
    }

    function getArrayOfNamesFromCollectionChild(rdjDataValue) {
      let list = [];
      for (var i in rdjDataValue) {
        // Chaeck if array element null
        if (rdjDataValue[i] == null) {
          list.push('<NULL>');
          continue;
        }
        // Check for collectionChild
        if ((typeof rdjDataValue[i].kind === 'undefined') || (rdjDataValue[i].kind !== 'collectionChild')) {
          list.push('<UNKNOWN>');
          continue;
        }
        // Get the value for this element from the path
        let path = rdjDataValue[i].path;
        list.push(path[path.length - 1].key);
      }
      return list;
    }

    function getNameFromCollectionChild(rdjDataValue) {
      // Check for collectionChild
      if ((typeof rdjDataValue.kind === 'undefined') || (rdjDataValue.kind !== 'collectionChild')) {
        return '<UNKNOWN>';
      }
      // Get the value for this collectionChild from the path
      let path = rdjDataValue.path;
      return path[path.length - 1].key;
    }

    function getPropertiesDisplayValue(dataValue, sep) {
      // Empty string or a separated list of key/value pairs
      let result = "";
      let separator = sep;
      if (Object.prototype.toString.call(dataValue) === '[object Array]') {
        result = "[" + dataValue.join() + "]";
      }
      else {
        if (typeof separator === 'undefined') {
          separator = ", ";
        }
        for (var key in dataValue) {
          if (result.length > 0) result = result + separator;
          result = result + key + "=" + dataValue[key];
        }
      }
      return result;
    }

    function getPropertiesConvertedValue(readValue, separator) {
      // Split a comma separated list of key/value pairs
      // No parsed properties results in a null return value...
      let result = null, entry = [];
      let entries = readValue.split(separator).map(value => value.trim()).filter(value => value != "");
      for (let i = 0; i < entries.length; i++) {
        entry = entries[i].split("=").map(value => value.trim());
        if (entry.length > 1) {
          let key = entry[0];
          let value = entry[1];
          if ((key !== undefined) && (key !== "") && (value !== undefined) && (value !== "")) {
            if (result == null) result = {};
            result[key] = value;
          }
        }
      }
      return result;
    }

    function getArrayOfStringDisplayValue(dataValue, separator) {
      // Empty string or a separated list of values.
      let result = "";
      for (let i in dataValue) {
        if (result.length > 0) result = result + separator;
        result = result + dataValue[i];
      }
      return result;
    }

    function getArrayOfStringConvertedValue(readValue, separator) {
      // Split a comma separated list of values
      let result = null;
      if (!Array.isArray(readValue) && readValue !== "") {
        result = readValue.split(separator).map(value => value.trim()).filter(value => value != "");
      }
      return result;
    }

    function convertArrayToPrintableList(array, conjunction) {
      let printableList;
      if (typeof conjunction === "undefined") conjunction = "or";
      if (typeof array !== "undefined" && array !== null && array.length > 0) {
        if (array.length === 1) {
          printableList = array[0];
        }
        else {
          const last = array.pop();
          printableList = array.join(", ");
          printableList += ` ${conjunction} ${last}`;
        }
      }
      return printableList;
    }

    return {
      isEquivalent: isEquivalent,
      getNthOccurrenceIndex: getNthOccurrenceIndex,
      isNotUndefinedNorNull: isNotUndefinedNorNull,
      isUndefinedOrNull: isUndefinedOrNull,
      getSubstring: getSubstring,
      removeTrailingSlashes: removeTrailingSlashes,
      getSliceFromPDJUrl: getSliceFromPDJUrl,
      parseQueryString: parseQueryString,
      getFirstHTMLParagraph: getFirstHTMLParagraph,
      displayNameFromIdentity: displayNameFromIdentity,
      parentPropertyFromIdentity: parentPropertyFromIdentity,
      pathSegmentsFromIdentity: pathSegmentsFromIdentity,
      pathEncodedFromIdentity: pathEncodedFromIdentity,
      breadcrumbsFromIdentity: breadcrumbsFromIdentity,
      getArrayOfNamesFromCollectionChild: getArrayOfNamesFromCollectionChild,
      getNameFromCollectionChild: getNameFromCollectionChild,
      getPropertiesDisplayValue: getPropertiesDisplayValue,
      getPropertiesConvertedValue: getPropertiesConvertedValue,
      getArrayOfStringDisplayValue: getArrayOfStringDisplayValue,
      getArrayOfStringConvertedValue: getArrayOfStringConvertedValue,
      convertArrayToPrintableList: convertArrayToPrintableList
    };
  }
);
