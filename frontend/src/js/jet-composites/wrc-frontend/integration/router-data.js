/**
 * @license
 * Copyright (c) 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['wrc-frontend/core/utils'],
  function(CoreUtils){
    return {
      hasPDJData: (router) => {
        return (CoreUtils.isNotUndefinedNorNull(router) &&
          CoreUtils.isNotUndefinedNorNull(router.data) &&
          CoreUtils.isNotUndefinedNorNull(router.data.pdjData())
        );
      },
      hasRDJData: (router) => {
        return (CoreUtils.isNotUndefinedNorNull(router) &&
          CoreUtils.isNotUndefinedNorNull(router.data) &&
          CoreUtils.isNotUndefinedNorNull(router.data.rdjData())
        );
      },
      hasSliceForm: (pdjData) => {
        return (CoreUtils.isNotUndefinedNorNull(pdjData) &&
          CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm)
        );
      },
      hasSliceTable: (pdjData) => {
        return (CoreUtils.isNotUndefinedNorNull(pdjData) &&
          CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable)
        );
      },
      hasSliceFormSlices: (pdjData) => {
        return (CoreUtils.isNotUndefinedNorNull(pdjData) &&
          CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm) &&
          CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm.slices) &&
          pdjData.sliceForm.slices.length > 0 &&
          CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm.slices[0].name)
        );
      },
      hasSliceTableSlices: (pdjData) => {
        return (CoreUtils.isNotUndefinedNorNull(pdjData) &&
          CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable) &&
          CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable.slices) &&
          pdjData.sliceTable.slices.length > 0 &&
          CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable.slices[0].name)
        );
      },
      hasSliceFormProperties: (pdjData) => {
        return (CoreUtils.isNotUndefinedNorNull(pdjData) &&
          CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm) &&
          CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm.properties) &&
          pdjData.sliceForm.properties.length > 0
        );
      },
      isReadOnlySliceForm: (pdjData) => {
        return (CoreUtils.isNotUndefinedNorNull(pdjData) &&
          CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm) &&
          pdjData.sliceForm.readOnly
        );
      }
    };
  }
);