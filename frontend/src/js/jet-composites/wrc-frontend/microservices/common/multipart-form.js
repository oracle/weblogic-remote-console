/**
 * @license
 * Copyright (c) 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['wrc-frontend/core/utils'],
  function (CoreUtils) {
    function MultipartForm() {
      this.fileUploads = {};
    }

    function scrubDataPayload(dataPayload) {
      let dataPayload1;
      if (CoreUtils.isNotUndefinedNorNull(dataPayload)) {
        dataPayload1 = JSON.parse(JSON.stringify(dataPayload));
        // Remove any field that has '' as a value.
        const arr = Object.entries(dataPayload1);
        const filtered = arr.filter(([key, value]) => value.value !== null && value.value !== '');
        dataPayload1 = Object.fromEntries(filtered);
        // CBE everypage examples have no "Upload" field in
        // the dataPayload, so we need to remove it before
        // we create the multipart section for it.
        delete dataPayload1['Upload'];
        // Remove "label" field from "Targets"
        if (CoreUtils.isNotUndefinedNorNull(dataPayload1['Targets'])) {
          if (CoreUtils.isUndefinedOrNull(dataPayload1['Targets'].value)) {
            // Remove "Targets" field itself
            delete dataPayload1['Targets'];
          }
          else {
            // Remove "label" field from "Targets" field
            for (let i = 0; i < dataPayload1['Targets'].value.length; i++) {
              delete dataPayload1['Targets'].value[i].label;
              //if this is in WDT, it maybe using model token, and value will not exist.
              if (CoreUtils.isNotUndefinedNorNull(dataPayload1['Targets'].value[i].value)){
                delete dataPayload1['Targets'].value[i].value.label;
              }
            }
          }
        }

      }
      // Return scrubbed dataPayload
      return dataPayload1;
    }

    function createMultipartFormData(requestBody, formResults, fileUploads, scrubData) {
      if (scrubData) {
        // Need to scrub the formResults.data JS object, to remove
        // anything the CBE cannot handle being in there.
        formResults.data = scrubDataPayload(formResults.data);
        // Create FormData object that we'll be populating
        // from scratch.
      }
      const formData = new FormData();
      // Find properties with "type": "fileContents" field
      const fields = formResults.properties.filter(property => property.type === 'fileContents');
      // Use property.name to get File onject that was saved
      // in this.backingData.fileUploads map.
      fields.forEach((field) => {
        if (typeof fileUploads[field.name] !== 'undefined') {
          // Add multipart sections using file
          formData.append(
            field.name,
            fileUploads[field.name],
            formResults.data[field.name].value
          );
          delete formResults.data[field.name];
        }
        else {
          // Remove field.name from formResults.data, if there
          // is no file upload for it. This prevents sending
          // a "Plan": {value: ""} (or "Plan": {value: null})
          // field to the CBE, in formResults.data object.
          delete formResults.data[field.name];
        }
      });

      // Add multipart section for 'requestBody' part, using
      // the requestBody parameter passed in.

      formData.append(
        'requestBody',
        new Blob([JSON.stringify(requestBody)],
          {type: 'application/json'})
      );

      // Update the results to include the form data
      formResults.data['formData'] = formData;
      return formResults.data;
    }

    function addUploadedFile(fieldName, file) {
      this.fileUploads[fieldName] = file;
    }

    function clearUploadedFile(fieldName) {
      delete this.fileUploads[fieldName];
    }
    
  //public:
    MultipartForm.prototype = {
      addUploadedFile: function(fieldName, file) {
        addUploadedFile.call(this, fieldName, file);
      },
      clearUploadedFile: function(fieldName) {
        clearUploadedFile.call(this, fieldName);
      },
      createMultipartFormData: function(requestBody, formResults, scrubData = false) {
        return createMultipartFormData(requestBody, formResults, this.fileUploads, scrubData);
      }
    };

    // Return constructor function
    return MultipartForm;
  }
);