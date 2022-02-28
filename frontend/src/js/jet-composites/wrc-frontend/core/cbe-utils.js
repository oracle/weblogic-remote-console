/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['./cbe-types', './utils'],
  function(CbeTypes, CfeUtils){
    return {
      extractBeanPath: function(url) {
        let beanPath;
        if (CfeUtils.isNotUndefinedNorNull(url)) {
          const urlParts = url.split('/');
          const index = urlParts.indexOf(CbeTypes.ServiceComponentType.DATA.name);
          if (index !== -1) beanPath = urlParts.slice(index + 1).join('/');
        }
        return beanPath;
      }
    }
  }
);
