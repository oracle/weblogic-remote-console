/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojhtmlutils', 'wrc-frontend/microservices/page-definition/types', 'wrc-frontend/core/utils', 'ojs/ojlogger'],
  function (oj, ko, HtmlUtils, PageDataTypes, CoreUtils, Logger) {

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

    function HelpForm(pdjData, rdjData, perspective) {
      this.pdjData = pdjData;
      this.rdjData = rdjData;
      this.perspective = perspective;
    }

    /**
     * Create <div> element that contains the help displayed when the help icon is clicked.
     * @returns {HTMLElement}
     */
    function createHelp() {
      const div = document.createElement('div');

      if (CoreUtils.isNotUndefinedNorNull(this.pdjData.helpTopics)) {
        div.setAttribute('id', 'cfe-help-footer');
        const title = document.createElement('p');
        title.innerHTML = '<b>Related Topics:</b>';
        div.append(title);
        const list = document.createElement('ul');
        div.append(list);

        let topic, listElement, ref;

        for (let j = 0; j < this.pdjData.helpTopics.length; j++) {
          topic = this.pdjData.helpTopics[j];

          ref = document.createElement('a');
          ref.setAttribute('href', topic.href);
          ref.setAttribute('target', '_blank');
          ref.setAttribute('rel', 'noopener');
          ref.innerText = topic.label;

          listElement = document.createElement('li');
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
      handleHelpIconClicked: (event) => {
        const instructionHelp = event.currentTarget.attributes['help.definition'].value;
        const detailedHelp = event.currentTarget.attributes['data-detailed-help'].value;

        if (!detailedHelp) {
          return;
        }

        const popup = document.getElementById(event.target.getAttribute('aria-describedby'))

        if (popup != null) {
          const content = popup.getElementsByClassName('oj-label-help-popup-container')[0];
          if (content != null) {
            if (popup.classList.contains('cfe-detail-popup')) {
              content.innerText = instructionHelp;
              popup.classList.remove('cfe-detail-popup');
            }
            else {
              content.innerHTML = detailedHelp;
              popup.classList.add('cfe-detail-popup');
            }
          }
        }
      },

      setPDJData: function(pdjData) {
        this.pdjData = pdjData;
      },

      getHelpData: function (properties, column1, column2) {
        const helpData = [];

        // Create PageDataTypes instance using the form's slice
        // properties and perspective
        const pdjTypes = new PageDataTypes(properties, this.perspective.id);

        for (let i = 0; i < properties.length; i++) {
          const name = properties[i].name;
          const label = pdjTypes.getLabel(name);
          // Determine the help description for the property
          const fullHelp = pdjTypes.getFullHelp(name);
          const description = {view: HtmlUtils.stringToNodeArray(fullHelp)};
          // Use Map to set value of "Name" and "Description"
          // columns, in a way that honors the language locale
          const entries = new Map([[column1, label], [column2, description]]);

          helpData.push(Object.fromEntries(entries));
        }

        return helpData;
      },

      render: function () {
        if (typeof this.pdjData == 'undefined') {
          return;
        }
        return createHelp.call(this);
      }

    };

    // Return HelpForm constructor function
    return HelpForm;
  }
);
