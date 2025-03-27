/**
 * @license
 * Copyright (c) 2020, 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define([
  'ojs/ojcore',
  'knockout',
  'ojs/ojhtmlutils',
  'wrc-frontend/microservices/actions-management/declarative-actions-manager',
  'wrc-frontend/integration/viewModels/utils',
  'wrc-frontend/common/page-definition-helper',
  'wrc-frontend/microservices/page-definition/types',
  'wrc-frontend/core/utils',
],
  function (
    oj,
    ko,
    HtmlUtils,
    DeclarativeActionsManager,
    ViewModelUtils,
    PageDefinitionHelper,
    PageDataTypes,
    CoreUtils,
  ) {

    const i18n = {
      tables: {
        help: {
          label: oj.Translations.getTranslatedString('wrc-help-form.tables.help.label'),
          columns: {
            header: {
              name: oj.Translations.getTranslatedString('wrc-help-form.tables.help.columns.header.name'),
              description: oj.Translations.getTranslatedString('wrc-help-form.tables.help.columns.header.description')
            }
          }
        }
      }
    };

    function HelpForm(pdjData, perspectiveId) {
      this.pdjData = pdjData;
      this.perspectiveId = perspectiveId;
    }

    /**
     * Create <div> element that contains the help displayed when the help icon is clicked.
     * @returns {HTMLElement}
     */
    function createHelp() {
      const div = document.createElement('div');

      if (CoreUtils.isNotUndefinedNorNull(this.pdjData.helpTopics)) {
        const title = document.createElement('p');
        title.innerHTML = oj.Translations.getTranslatedString('wrc-help-form.labels.relatedTopics.value');
        div.append(title);
        const list = document.createElement('ul');
        div.append(list);

        for (let j = 0; j < this.pdjData.helpTopics.length; j++) {
          const topic = this.pdjData.helpTopics[j];

          const ref = document.createElement('a');
          ref.setAttribute('href', '#');
          ref.setAttribute('on-click', '[[helpTopicLinkClick]]');
          ref.setAttribute('data-external-help-link', topic.href);
          ref.innerText = topic.label;

          const listElement = document.createElement('li');
          listElement.append(ref);
          list.append(listElement);
        }
      }

      return div;
    }

    HelpForm.prototype = {
      i18n: i18n,
      tableHelpColumns: [
        {
          'headerText': i18n.tables.help.columns.header.name,
          'headerStyle': 'font-weight:bold;text-align:left;min-width: 8em; width: 8em;',
          'style': 'white-space:normal;padding:5px;min-width: 8em; width: 8em;',
          'name': i18n.tables.help.columns.header.name,
          'field': i18n.tables.help.columns.header.name
        },
        {
          'headerText': i18n.tables.help.columns.header.description,
          'headerStyle': 'font-weight:bold;text-align:left;',
          'style': 'white-space:normal;padding:5px;',
          'name': i18n.tables.help.columns.header.description,
          'field': i18n.tables.help.columns.header.description,
          'template': 'domTemplate'
        }
      ],
      handleHelpIconClicked: ViewModelUtils.helpIconClickListener,
      handleHelpTopicLinkClicked: ViewModelUtils.helpLinkClickListener,

      setPDJData: function(pdjData) {
        this.pdjData = pdjData;
      },

      getHelpData: function (properties) {
        function hasPolicyExpressionSliceLayout(pdjData) {
          let rtnval = false;
          if (PageDefinitionHelper.hasSliceFormSlices(pdjData) && PageDefinitionHelper.hasSliceFormProperties(pdjData)) {
            const filteredProperties = pdjData.sliceForm.properties.filter(property => property.type === 'entitleNetExpression');
            rtnval = (filteredProperties.length > 0);
          }
          return rtnval;
        }

        let helpData = [], pdjTypes;

        if (hasPolicyExpressionSliceLayout(this.pdjData)) {
          const frontendActionsHelpColumns = DeclarativeActionsManager.getFrontendActionsHelpColumns('policyEditor');

          for (let i = 0; i < frontendActionsHelpColumns.length; i++) {
            const name = frontendActionsHelpColumns[i].id;
            const label = frontendActionsHelpColumns[i].helpLabel;
            const fullHelp = frontendActionsHelpColumns[i].detailedHelpHTML;
            const description = { view: HtmlUtils.stringToNodeArray(fullHelp), data: this };
            
            helpData.push({Name: label, Description: description});
          }
        }

        if (DeclarativeActionsManager.hasActions(this.pdjData)) {
          const pdjTypesHelpColumns = DeclarativeActionsManager.getPDJTypesHelpColumns(this.pdjData);

          pdjTypes = new PageDataTypes(pdjTypesHelpColumns, this.perspectiveId);

          for (let i = 0; i < pdjTypesHelpColumns.length; i++) {
            const name = pdjTypesHelpColumns[i].name;
            const label = pdjTypes.getHelpLabel(name);
            // Determine the help description for the property
            const fullHelp = pdjTypes.getFullHelp(name);
            const description = fullHelp ? { view: HtmlUtils.stringToNodeArray(fullHelp), data: this } : null;
            // Use Map to set value of "Name" and "Description"
            // columns, in a way that honors the language locale
            // skip properties for which there is no help
            if (description) {
              helpData.push({Name: label, Description: description});
            }
          }
        }

        if (properties.length > 0) {
          // Create PageDataTypes instance using the form's slice
          // properties and perspective
          pdjTypes = new PageDataTypes(properties, this.perspectiveId);

          for (let i = 0; i < properties.length; i++) {
            const name = properties[i].name;
            const label = pdjTypes.getLabel(name);
            // Determine the help description for the property
            const fullHelp = pdjTypes.getFullHelp(name);
            const description = fullHelp ? { view: HtmlUtils.stringToNodeArray(fullHelp), data: this } : null;
            // Use Map to set value of "Name" and "Description",
            // columns, in a way that honors the language locale
            // skip any property that lacks a descprtion
            if (fullHelp) {
              helpData.push({Name: label, Description: description});
            }
          }
        }

        return helpData;
      },

      render: function () {
        let div;
        if (CoreUtils.isNotUndefinedNorNull(this.pdjData)) {
          div = createHelp.call(this);
        }
        return div;
      }

    };

    // Return HelpForm constructor function
    return HelpForm;
  }
);