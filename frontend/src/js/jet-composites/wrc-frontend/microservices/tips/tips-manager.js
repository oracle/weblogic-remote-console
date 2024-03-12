/**
 * @license
 * Copyright (c) 2023,2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

/**
 * @description This module contains functions for managing instances of the ``Tip`` class.
 * @module
 */
define([
    'wrc-frontend/core/parsers/yaml',
    'text!wrc-frontend/config/tips.yaml',
    './tip'
  ],
  function (
    YamlParser,
    TipFileContents,
    Tip
  ) {
    let schema = {}, tips = [];
    
    function createTip(entry, index) {
      let tip;
      const index1 = schema.categories.map(item => item.id).indexOf(entry.category);
      if (index1 !== -1) {
        tip = new Tip(
          (typeof entry.id === 'undefined' ? `tip${index}` : entry.id),
          entry.category,
          entry.visible
        );
      }
      return tip;
    }
    
    YamlParser.parse(TipFileContents)
      .then(config => {
        let tip;
        if (config['schema']) {
          schema = config['schema'];
          if (config['tips']) {
            config['tips'].forEach((entry, index) => {
              tip = createTip(entry, index);
              if (typeof tip !== 'undefined') tips.push(tip);
            });
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
    
    return {
      /**
       *
       * @param {string} tipId
       * @returns {Tip}
       */
      getById: (tipId) => {
        return tips.find((tip) => {
          return tip.id === tipId;
        });
      },
      
      /**
       *
       * @returns {Tip[]}
       */
      getAll: () => {
        return tips;
      },
      
      /**
       *
       * @returns {Tip[]}
       */
      getAllVisible: () => {
        return tips.filter(tip => tip.visible);
      },
      /**
       *
       * @returns {[string]}
       */
      getCategories: () => {
        const array = tips.filter(tip => tip.visible).map(({category}) => category);
        return [...new Set(array)];
      },
      /**
       *
       * @returns {[{id: string, label: string}]}
       */
      getAllCategories: () => {
        return schema.categories;
      }
      
    };
  }
);