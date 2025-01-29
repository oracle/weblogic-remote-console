/**
 * @license
 * Copyright (c) 2023, 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define([
  'ojs/ojcore',
  'wrc-frontend/microservices/page-definition/types',
  'wrc-frontend/core/runtime',
  'wrc-frontend/core/utils'
],
  function(
    oj,
    PageDataTypes,
    Runtime,
    CoreUtils
  ){
    function hasParentRouter(viewParams) {
      return (CoreUtils.isNotUndefinedNorNull(viewParams) &&
        CoreUtils.isNotUndefinedNorNull(viewParams.parentRouter)
      );
    }

    function hasPDJData(router) {
      return (CoreUtils.isNotUndefinedNorNull(router) &&
        CoreUtils.isNotUndefinedNorNull(router.data) &&
        CoreUtils.isNotUndefinedNorNull(router.data.pdjData())
      );
    }
    
    function hasRDJData(router) {
      return (CoreUtils.isNotUndefinedNorNull(router) &&
        CoreUtils.isNotUndefinedNorNull(router.data) &&
        CoreUtils.isNotUndefinedNorNull(router.data.rdjData())
      );
    }
    
    function hasTable(pdjData) {
      return (CoreUtils.isNotUndefinedNorNull(pdjData) &&
        CoreUtils.isNotUndefinedNorNull(pdjData.table)
      );
    }
    
    function hasSliceForm(pdjData) {
      return (CoreUtils.isNotUndefinedNorNull(pdjData) &&
        CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm)
      );
    }
    
    function hasSliceTable(pdjData) {
      return (CoreUtils.isNotUndefinedNorNull(pdjData) &&
        CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable)
      );
    }
    
    function hasSliceFormSlices(pdjData) {
      return (CoreUtils.isNotUndefinedNorNull(pdjData) &&
        CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm) &&
        CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm.slices) &&
        pdjData.sliceForm.slices.length > 0 &&
        CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm.slices[0].name)
      );
    }
    
    function hasSliceTableSlices(pdjData) {
      return (CoreUtils.isNotUndefinedNorNull(pdjData) &&
        CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable) &&
        CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable.slices) &&
        pdjData.sliceTable.slices.length > 0 &&
        CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable.slices[0].name)
      );
    }
    
    function hasSliceFormProperties(pdjData) {
      return (CoreUtils.isNotUndefinedNorNull(pdjData) &&
        CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm) &&
        CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm.properties) &&
        pdjData.sliceForm.properties.length > 0
      );
    }
    
    function hasHelpTopics(pdjData) {
      return (CoreUtils.isNotUndefinedNorNull(pdjData) &&
        CoreUtils.isNotUndefinedNorNull(pdjData.helpTopics) &&
        pdjData.helpTopics.length > 0
      );
    }

    function hasIntroductionHTML(pdjData) {
      return (CoreUtils.isNotUndefinedNorNull(pdjData) &&
        CoreUtils.isNotUndefinedNorNull(pdjData.introductionHTML));
    }

    function hasIntroduction(pdjData) {
      return (CoreUtils.isNotUndefinedNorNull(pdjData) &&
        CoreUtils.isNotUndefinedNorNull(pdjData.introduction));
    }

    function isPDJReadOnly(pdjData) {
      const isCreateForm = hasCreateForm(pdjData);
      const isSliceForm = hasSliceForm(pdjData);
      const isSliceTable = hasSliceTable(pdjData);
      let rtnval = !isCreateForm;
      if (rtnval) {
        rtnval = (isSliceForm && pdjData.sliceForm.readoOnly) || isSliceTable;
      }
      return rtnval;
    }
    
    function isReadOnlySlice(pdjData, sliceName) {
      // Default to using false as the return value
      let rtnval = true;
      if (hasSliceFormProperties(pdjData)) {
        // This means that the pdjData object has a nested
        // sliceForm object, which has a nested properties
        // array, so keep going. Next, see if the properties
        // array has a property object with a name that
        // matches the slice name.
        const property = pdjData.sliceForm.properties.find(item => item.name === sliceName);
        if (CoreUtils.isNotUndefinedNorNull(property)) {
          // This means there was indeed a property object
          // in the properties array that matched the slice name.
          // Next, you need to see if the property object
          // has a readOnly property.
          if (CoreUtils.isUndefinedOrNull(property.readOnly)) {
            // This means that the property object DOES NOT
            // HAVE a readOnly property, so assign false to
            // the return value.
            rtnval = false;
          }
          else {
            // This means that the property object HAS a
            // readOnly property (which has a boolean type),
            // but logically it could have true or false
            // assigned to it. Use whatever is assigned to
            // it as the return value for the function.
            rtnval = property.readOnly;
          }
        }
      }
      return rtnval;
    }
    
    function hasReadOnlySliceForm(pdjData) {
      return (CoreUtils.isNotUndefinedNorNull(pdjData) &&
        CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm) &&
        pdjData.sliceForm.readOnly
      );
    }
    
    function hasCreateForm(pdjData) {
      return (CoreUtils.isNotUndefinedNorNull(pdjData) &&
        CoreUtils.isNotUndefinedNorNull(pdjData.createForm)
      );
    }
    
    function hasCreateFormSections(pdjData) {
      return (hasCreateForm(pdjData) &&
        CoreUtils.isNotUndefinedNorNull(pdjData.createForm.sections)
      );
    }
    
    function hasSliceFormSections(pdjData) {
      return (hasSliceForm(pdjData) &&
        CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm.sections)
      );
    }
    
    function hasDashboardCreateForm(rdjData) {
      return (CoreUtils.isNotUndefinedNorNull(rdjData) &&
        CoreUtils.isNotUndefinedNorNull(rdjData.dashboardCreateForm)
      );
    }
    
    function hasDashboardFormLayout(router) {
      let rtnval = hasRDJData(router);
      if (rtnval) {
        const rdjData = router.data.rdjData();
        if (rdjData.navigation)
          rtnval = rdjData.navigation.startsWith('Dashboard');
        else
          rtnval = false;
      }
      return rtnval;
    }
    
    function hasReadOnlyFormLayout(router) {
      let rtnval = hasPDJData(router);
      if (rtnval) {
        const pdjData = router.data.pdjData();
        rtnval = hasReadOnlySliceForm(pdjData);
      }
      return rtnval;
    }
    
    function hasPolicyExpressionSliceLayout(router) {
      let rtnval = hasPDJData(router);
      if (rtnval) {
        const pdjData = router.data.pdjData();
        if (hasSliceFormSlices(pdjData) && hasSliceFormProperties(pdjData)) {
          const filteredProperties = pdjData.sliceForm.properties.filter(property => property.type === 'entitleNetExpression');
          rtnval = (filteredProperties.length > 0);
        }
      }
      return rtnval;
    }
    
    function isDeletable(rdjData) {
      let rtnval = false;
      if (CoreUtils.isNotUndefinedNorNull(rdjData) && CoreUtils.isNotUndefinedNorNull(rdjData.deletable)) {
        rtnval = rdjData.deletable;
      }
      return rtnval;
    }

    function hasUsedIfs(pdjData) {
      let rtnval = false;
      if (hasSliceFormProperties(pdjData)) {
        const usedIfProperties = pdjData.sliceForm.properties.filter(property => CoreUtils.isNotUndefinedNorNull(property.usedIf));
        rtnval = (usedIfProperties.length > 0);
      }
      return rtnval;
    }

    function getNavigationProperty(pdjData) {
      let rtnval = 'none';
      if (CoreUtils.isNotUndefinedNorNull(pdjData.table)) {
        rtnval = pdjData.table.navigationProperty;
      }
      else if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable)) {
        rtnval = pdjData.sliceTable.navigationProperty;
      }
      else if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm)) {
        rtnval = pdjData.sliceForm.navigationProperty;
      }
      return rtnval;
    }
    
    function createPageDefinitionTypes(pdjData, perspectiveId) {
      let properties = [];

      if (hasSliceTable(pdjData)) {
        properties = pdjData.sliceTable.displayedColumns;
        if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable.hiddenColumns)) {
          properties = properties.concat(pdjData.sliceTable.hiddenColumns);
        }
      }
      else if (hasTable(pdjData)) {
        properties = pdjData.table.displayedColumns;
        if (CoreUtils.isNotUndefinedNorNull(pdjData.table.hiddenColumns)) {
          properties = properties.concat(pdjData.table.hiddenColumns);
        }
      }
      else if (hasSliceForm(pdjData)) {
        properties = pdjData.sliceForm.properties;
        if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm.advancedProperties)) {
          properties = properties.concat(pdjData.sliceForm.advancedProperties);
        }
      }

      return new PageDataTypes(properties, perspectiveId);
    }

    function createIntroduction(pdjData, rdjData, cssSelector = '#intro') {
      function addMissingMatchTags(matches) {
        for (let i = 0; i < matches.length; i++) {
          // Remove leading and trailing whitespace
          matches[i] = matches[i].replace(/^[\s]+|[\s]+$/, '');
          // Remove whitespace immediately after <p>
          matches[i] = matches[i].replace(/<p>\s{1,}/, '<p>');
          // Remove whitespace immediately before </p>
          matches[i] = matches[i].replace(/\s{1,}<\/p>/, '</p>');
          if (!matches[i].startsWith('<p>')) matches[i] = `<p>${matches[i]}`;
          if (matches[i].slice(-4) !== '</p>') matches[i] = `${matches[i]}</p>`;
        }
      }

      function getLongestArray(arrays) {
        const result = {index: -1, length: -1};
        arrays.forEach((array, index) => {
          if (array.length >= result.length) {
            result.index = index;
            result.length = array.length;
          }
        });
        return arrays[result.index === -1 ? 0 : result.index];
      }

      function convertToIntroduction(bindHtml) {
        const STARTS_WITH_USE_REGEX = /(.+)?(?<p>\s{0,}Use.+?<\/p>)(.+)?/;
        const STARTS_WITH_THIS_REGEX = /(.+)?(?<p>\s{0,}This.+?<\/p>)(.+)?/;
        const STARTS_WITH_MANAGES_REGEX = /(.+)?(<p>\s{0,}Manages.+?<\/p>)(.+)?/;
        const STARTS_WITH_THE_REGEX = /(\s{0,}<p>\s{0,}The.+page.+?<\/p>)?(\s{0,}<p>\s{0,}The.+page.+<\/p>)?(<p>The.+page.+)/;
        const STARTS_WITH_WRITE_REGEX = /(.+)?(?<p>\s{0,}Write.+?<\/p>)(.+)?/;

        const introduction = {};
        // A newlines is not an HTML tag, so get rid of them!
        bindHtml = bindHtml.replace(/\r\n|\n|'\n|\r/gm, '');
        // Replace multiple spaces with one space
        bindHtml = bindHtml.replace(/\s{2,}/gm, ' ');

        const startsWithUseMatches = bindHtml.split(STARTS_WITH_USE_REGEX).filter(x => typeof x !== 'undefined' && x.trim() !== '<p>' && x.trim() !== '');
        addMissingMatchTags(startsWithUseMatches);

        const startsWithThisMatches = bindHtml.split(STARTS_WITH_THIS_REGEX).filter(x => typeof x !== 'undefined' && x.trim() !== '<p>' && x.trim() !== '');
        addMissingMatchTags(startsWithThisMatches);

        const startsWithManagesMatches = bindHtml.split(STARTS_WITH_MANAGES_REGEX).filter(x => typeof x !== 'undefined' && x.trim() !== '<p>' && x.trim() !== '');
        addMissingMatchTags(startsWithManagesMatches);

        const startsWithTheMatches = bindHtml.split(STARTS_WITH_THE_REGEX).filter(x => typeof x !== 'undefined' && x.trim() !== '<p>' && x.trim() !== '');
        addMissingMatchTags(startsWithTheMatches);

        const startsWithWriteMatches = bindHtml.split(STARTS_WITH_WRITE_REGEX).filter(x => typeof x !== 'undefined' && x.trim() !== '<p>' && x.trim() !== '');
        addMissingMatchTags(startsWithWriteMatches);

        const splitParts = getLongestArray([startsWithUseMatches, startsWithThisMatches, startsWithTheMatches, startsWithManagesMatches, startsWithWriteMatches]);

        if (splitParts.length > 0) {
          const index = splitParts.findIndex(part => part.startsWith('<p>This') || part.startsWith('<p>Use') || part.startsWith('<p>The') || part.startsWith('<p>Manages') || part.startsWith('<p>Write'));

          if (index !== -1) {
            const statement = splitParts.splice(index, 1);
            splitParts.unshift(statement);
            introduction['statementHTML'] = splitParts[0];
            if (splitParts.length > 1) introduction['infoHTML'] = splitParts.join('');
          }
          else {
            introduction['statementHTML'] = bindHtml;
          }
        }
        else {
          introduction['statementHTML'] = bindHtml;
        }
        // Return the introduction JS object
        return introduction;
      }

      function populateFromIntroductionHTML(pdjData, rdjData, cssSelector) {
        let bindHtml = (CoreUtils.isNotUndefinedNorNull(rdjData.introductionHTML) ? rdjData.introductionHTML : pdjData.introductionHTML);
        bindHtml = (CoreUtils.isNotUndefinedNorNull(bindHtml) ? bindHtml : '<p>');

        const div = document.querySelector(cssSelector);
        if (div !== null) {
          const featureDisabled = Runtime.getProperty('features.pageInfo.disabled');
          if (!featureDisabled) {
            const introduction = convertToIntroduction(bindHtml);
            if (introduction.statementHTML) {
              bindHtml = populateFromIntroduction(introduction);
            }
            div.classList.add('cfe-introduction');
          }
          else {
            div.classList.add('cfe-table-form-instructions');
          }
        }

        return bindHtml;
      }

      function populateFromIntroduction(introduction) {
        let bindHtml = '';

        if (introduction?.infoHTML) {
          bindHtml += '<div tabindex="0" class="oj-ux-ico-information cfe-page-info-icon" title="' + oj.Translations.getTranslatedString('wrc-common.tooltips.pageInfo.value') + '" on-keyup="[[infoIconKeyUp]]" on-click="[[infoIconClick]]">';
          bindHtml += '<div class="cfe-page-info-popup">';
          bindHtml += introduction.infoHTML;
          bindHtml += '</div>';
          bindHtml += '</div>';
        }

        bindHtml += `<div class="cfe-introduction-statement">${introduction.statementHTML}</div>`;

        return bindHtml;
      }

      let intro = '<p>';

      if (!Runtime.getProperty('features.pageInfo.disabled')) {
        if (hasIntroduction(pdjData)) {
          intro = populateFromIntroduction(pdjData.introduction);
        }
        else if (hasIntroductionHTML(pdjData)) {
          intro = populateFromIntroductionHTML(pdjData, rdjData, cssSelector);
        }
      }
      else if (hasIntroductionHTML(pdjData)) {
        intro = populateFromIntroductionHTML(pdjData, rdjData, cssSelector);
      }

      return intro;
    }

    function getSliceTableDisplayedColumns(pdjData) {
      let displayedColumns = [];
      if (hasSliceTable(pdjData)) {
        if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable.displayedColumns)) {
          displayedColumns = [...pdjData.sliceTable.displayedColumns];
        }
      }
      return displayedColumns;
    }

    function getSliceTableHiddenColumns(pdjData) {
      let hiddenColumns = [];
      if (hasSliceTable(pdjData)) {
        if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable.hiddenColumns)) {
          hiddenColumns = [...pdjData.sliceTable.hiddenColumns];
        }
      }
      return hiddenColumns;
    }

    function getBreadcrumbLabels(rdjData) {
      let breadcrumbLabels = [];
      if (CoreUtils.isNotUndefinedNorNull(rdjData)) {
        breadcrumbLabels = rdjData.breadCrumbs.map(({label}) => label);
        breadcrumbLabels.push(rdjData.self.label);
      }
      return breadcrumbLabels;
    }

    function getDefaultSliceValue(pdjData) {
      let sliceValue;
      if (hasSliceTable(pdjData) && pdjData.sliceTable.slices) {
        sliceValue = pdjData.sliceTable.slices[0].name;
      }
      else if (hasSliceForm(pdjData) && pdjData.sliceForm.slices) {
        sliceValue = pdjData.sliceForm.slices[0].name;
      }
      return sliceValue;
    }

  //public:
    return {
      hasParentRouter: hasParentRouter,
      hasPDJData: hasPDJData,
      hasRDJData: hasRDJData,
      hasTable: hasTable,
      hasSliceForm: hasSliceForm,
      hasSliceTable: hasSliceTable,
      hasSliceFormSlices: hasSliceFormSlices,
      hasSliceTableSlices: hasSliceTableSlices,
      hasSliceFormProperties: hasSliceFormProperties,
      getSliceTableDisplayedColumns: getSliceTableDisplayedColumns,
      getSliceTableHiddenColumns: getSliceTableHiddenColumns,
      getBreadcrumbLabels: getBreadcrumbLabels,
      getDefaultSliceValue: getDefaultSliceValue,
      hasHelpTopics: hasHelpTopics,
      isPDJReadOnly: isPDJReadOnly,
      isReadOnlySlice: isReadOnlySlice,
      hasReadOnlySliceForm: hasReadOnlySliceForm,
      hasCreateForm: hasCreateForm,
      hasCreateFormSections: hasCreateFormSections,
      hasSliceFormSections: hasSliceFormSections,
      hasDashboardCreateForm: hasDashboardCreateForm,
      hasDashboardFormLayout: hasDashboardFormLayout,
      hasReadOnlyFormLayout: hasReadOnlyFormLayout,
      hasPolicyExpressionSliceLayout: hasPolicyExpressionSliceLayout,
      isDeletable: isDeletable,
      hasUsedIfs: hasUsedIfs,
      getNavigationProperty: getNavigationProperty,
      createPageDefinitionTypes: createPageDefinitionTypes,
      createIntroduction: createIntroduction
    };
  }
);