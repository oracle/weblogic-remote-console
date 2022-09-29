/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['wrc-frontend/core/utils'],
  function (CoreUtils) {

    function parseQueryString(url) {
      let queryString = url.split('?').pop(), qd = {};
      queryString.split('&').forEach(function (item) { var s = item.split('='), k = s[0], v = s[1] && decodeURIComponent(s[1]); (qd[k] = qd[k] || []).push(v) });
      return qd;
    }

    function getSliceFromPDJUrl(pdjUrl) {
      const qd = parseQueryString(pdjUrl);
      return qd['view'][0];
    }

    function pathSegmentsFromIdentity(id) {
      let pathSegments = [];

      if (typeof id !== 'undefined' && typeof id.resourceData !== 'undefined' && id.resourceData !== null) {
        pathSegments = id.resourceData.split('/');
        pathSegments = pathSegments.filter((e) => {return e});
      }

      return pathSegments;
    }

    function filterPathSegments(path, segment) {
      let pathSegments = [];
      if (CoreUtils.isNotUndefinedNorNull(path) && CoreUtils.isNotUndefinedNorNull(segment)) {
        pathSegments = path.split('/').filter(e => e);
        const index = pathSegments.indexOf(segment);
        if (index !== -1) pathSegments = pathSegments.slice(index + 1);
      }
      return pathSegments;
    }

    function pathEncodedFromIdentity(id) {
      let path = '';
      const pathSegments = pathSegmentsFromIdentity(id);

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
      let displayName = '';
      if (typeof id !== 'undefined' && typeof id.path !== 'undefined') {
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

    /**
     * Returns the value assigned to the ``property`` field of the last path segment in ``id``, or an empty string.
     * @param {{kind: string, perspective: string, path: Array}[]} id
     * @returns {string} - The value assigned to the ``property`` field of the last path segment in ``id``, or an empty string.
     */
    function propertyNameFromIdentity(id) {
      let propertyName = '';

      if (typeof id !== 'undefined' && typeof id.path !== 'undefined' && id.path !== null) {
        const lastPathSegment = id.path[id.path.length - 1];

        if (typeof lastPathSegment !== 'undefined' && typeof lastPathSegment.propertyLabel !== 'undefined') {
          propertyName = lastPathSegment.property;
        }
      }
      return propertyName;
    }

    /**
     * Returns the value assigned to the ``label`` field of the ``id``, or an empty string.
     * @param {{label: string, resourceData: string}} id
     * @returns {string} - The value assigned to the ``propertyLabel`` field of the last path segment in ``id``, or an empty string.
     */
    function propertyLabelFromIdentity(id) {
      let propertyLabel = '';

      if (typeof id !== 'undefined' && typeof id.label !== 'undefined' && id.label !== null) {
        propertyLabel = id.label;
      }

      return propertyLabel;
    }

    /**
     * Returns the value assigned to the last path segment in ``resourceData`` minus the last character, or an empty string.
     * @param {{label: string, resourceData: string}} id
     * @returns {string} - The value assigned to the last path segment in ``resourceData`` minus the last character, or an empty string.
     * @private
     */
    function propertyValueTypeFromIdentity(id) {
      let propertyValueType = '';

      if (typeof id !== 'undefined' && typeof id.resourceData !== 'undefined' && id.resourceData !== null) {
        const resourceData = decodeURIComponent(id.resourceData);
        const label = decodeURIComponent(id.label);
        let pathSegments = resourceData.split('/');
        pathSegments = pathSegments.filter((e) => {return e});
        propertyValueType = pathSegments[pathSegments.indexOf(label) - 1];
        if (typeof propertyValueType !== 'undefined') {
          propertyValueType = propertyValueType.slice(0, -1);
        }
      }

      return propertyValueType;
    }

    /**
     * Returns the value assigned to the ``type`` field of the last path segment in ``id`` minus the last character, or an empty string.
     * @param {{label: string, resourceData: string}} id
     * @returns {string} - The value assigned to the ``type`` field of the last path segment in ``id`` minus the last character, or an empty string.
     * @private
     */
    function typeNameFromIdentity(id) {
      let typeName = '';

      if (typeof id !== 'undefined' && typeof id.resourceData !== 'undefined' && id.resourceData !== null) {
        let pathSegments = id.resourceData.split('/');
        typeName = pathSegments[pathSegments.length - 1];
        typeName = typeName.slice(0, -1);
      }

      return typeName;
    }

    /**
     * Returns the value assigned to the ``label`` field of the ``id`` minus the last character, or an empty string.
     * @param {{label: string, resourceData: string}} id
     * @returns {string} - The value assigned to the ``label`` field of the ``id`` minus the last character, or an empty string.
     * @private
     */
    function typeLabelFromIdentity(id) {
      let typeLabel = '';

      if (typeof id !== 'undefined' && typeof id.label !== 'undefined' && id.label !== null) {
        typeLabel = id.label;
        typeLabel = typeLabel.slice(0, -1);
      }

      return typeLabel;
    }

    /**
     * Returns the value assigned to the ``property`` or ``type`` field of the last path segment in ``id``, depending on which one is present in ``id``.
     * @param {{kind: string, perspective: string, path: Array}[]} id
     * @returns {string} - The value assigned to the ``property`` or ``type`` field of the last path segment in ``id``, depending on which one is present in ``id``. An empty string is returned, if neither is present.
     */
    function parentPropertyFromIdentity(id) {
      let parentProperty = '';
      const lastPathSegment = id.path[id.path.length-1];

      if (typeof lastPathSegment.property !== 'undefined') {
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

    function removeTrailingSlashes(path) {
      if (typeof path !== 'undefined' && path.length > 0) {
        while (path.substring(path.length -1) === '/') {
          path = path.slice(0, -1);
        }
      }
      return path;
    }

    function getArrayOfNamesFromCollectionChild(rdjDataValue) {
      let list = [];
      if (Array.isArray(rdjDataValue)) {
        for (var i in rdjDataValue) {
          // Chaeck if array element null
          if (rdjDataValue[i] == null) {
            list.push('<NULL>');
            continue;
          }
          // Check for collectionChild
          //       if ((typeof rdjDataValue[i].kind === 'undefined') || (rdjDataValue[i].kind !== 'collectionChild')) {
          //         list.push('<UNKNOWN>');
          //         continue;
          //       }
          // Get the value for this element from the path

          if (CoreUtils.isUndefinedOrNull(rdjDataValue[i].value)) {
            if (CoreUtils.isUndefinedOrNull(rdjDataValue[i].label)) {
              list.push('');
            } else {
              list.push(rdjDataValue[i].label);
            }
          }
          else {
            let path = rdjDataValue[i].value.label;
            list.push(path);
            // list.push(path[path.length - 1].key);
          }
        }
      }
      return list;
    }
    
    function getNameFromCollectionChild(rdjDataValue) {
      return rdjDataValue.label;
    }

    function getPropertiesDisplayValue(dataValue, sep) {
      // Empty string or a separated list of key/value pairs
      let result = '';
      let separator = sep;
      if (Object.prototype.toString.call(dataValue) === '[object Array]') {
        result = '[' + dataValue.join() + ']';
      }
      else {
        if (typeof separator === 'undefined') {
          separator = ', ';
        }
        for (var key in dataValue) {
          if (result.length > 0) result = result + separator;
          result = result + key + '=' + dataValue[key];
        }
      }
      return result;
    }

    function getPropertiesConvertedValue(readValue, separator) {
      // Split a comma separated list of key/value pairs
      // No parsed properties results in a null return value...
      let result = null, entry = [];
      let entries = readValue.split(separator).map(value => value.trim()).filter(value => value != '');
      for (let i = 0; i < entries.length; i++) {
        entry = entries[i].split('=').map(value => value.trim());
        if (entry.length > 1) {
          let key = entry[0];
          let value = entry[1];
          if ((key !== undefined) && (key !== '') && (value !== undefined) && (value !== '')) {
            if (result == null) result = {};
            result[key] = value;
          }
        }
      }
      return result;
    }

    function getArrayOfStringDisplayValue(dataValue, separator) {
      // Empty string or a separated list of values.
      let result = '';
      for (let i in dataValue) {
        if (result.length > 0) result = result + separator;
        if (CoreUtils.isNotUndefinedNorNull(dataValue[i].value)) {
          result = result + dataValue[i].value;
        }
        else if (CoreUtils.isNotUndefinedNorNull(dataValue[i].modelToken)) {
          result = result + dataValue[i].modelToken;
        }
        else {
          result = result + dataValue[i];
        }
      }
      return result;
    }

    function getArrayOfStringConvertedValue(readValue, separator) {
      // Split a comma separated list of values
      let result = null;
      if (!Array.isArray(readValue) && readValue !== '') {
        result = readValue
          .split(separator)
          .map((value) => {
            return { set: true, value: value.trim() };
          })
          .filter((value) => value !== '');
      }
      return result;
    }

    function convertArrayToPrintableList(array, conjunction) {
      let printableList;
      if (typeof conjunction === 'undefined') conjunction = 'or';
      if (typeof array !== 'undefined' && array !== null && array.length > 0) {
        if (array.length === 1) {
          printableList = array[0];
        }
        else {
          const last = array.pop();
          printableList = array.join(', ');
          printableList += ` ${conjunction} ${last}`;
        }
      }
      return printableList;
    }

    function getPlacementRouterParameter(router) {
      let placement;
      if (CoreUtils.isNotUndefinedNorNull(router.observableModuleConfig().params.ojRouter.parameters.placement)) {
        placement = router.observableModuleConfig().params.ojRouter.parameters.placement();
      }
      return placement;
    }

    function setPlacementRouterParameter(router, value) {
      if (CoreUtils.isNotUndefinedNorNull(router.observableModuleConfig().params.ojRouter.parameters.placement)) {
        router.observableModuleConfig().params.ojRouter.parameters.placement(value);
      }
    }

    return {
      getSliceFromPDJUrl: getSliceFromPDJUrl,
      parseQueryString: parseQueryString,
      getFirstHTMLParagraph: getFirstHTMLParagraph,
      removeTrailingSlashes: removeTrailingSlashes,
      displayNameFromIdentity: displayNameFromIdentity,
      propertyNameFromIdentity: propertyNameFromIdentity,
      propertyLabelFromIdentity: propertyLabelFromIdentity,
      propertyValueTypeFromIdentity: propertyValueTypeFromIdentity,
      typeNameFromIdentity: typeNameFromIdentity,
      typeLabelFromIdentity: typeLabelFromIdentity,
      parentPropertyFromIdentity: parentPropertyFromIdentity,
      pathSegmentsFromIdentity: pathSegmentsFromIdentity,
      pathEncodedFromIdentity: pathEncodedFromIdentity,
      breadcrumbsFromIdentity: breadcrumbsFromIdentity,
      filterPathSegments: filterPathSegments,
      getArrayOfNamesFromCollectionChild: getArrayOfNamesFromCollectionChild,
      getNameFromCollectionChild: getNameFromCollectionChild,
      getPropertiesDisplayValue: getPropertiesDisplayValue,
      getPropertiesConvertedValue: getPropertiesConvertedValue,
      getArrayOfStringDisplayValue: getArrayOfStringDisplayValue,
      getArrayOfStringConvertedValue: getArrayOfStringConvertedValue,
      convertArrayToPrintableList: convertArrayToPrintableList,
      getPlacementRouterParameter: getPlacementRouterParameter,
      setPlacementRouterParameter: setPlacementRouterParameter
    };
  }
);
