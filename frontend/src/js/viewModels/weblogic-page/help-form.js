/**
 * @license
 * Copyright (c) 2020 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

define(['knockout', 'ojs/ojhtmlutils', '../modules/pdj-types', 'ojs/ojlogger'],
  function (ko, HtmlUtils, PageDataTypes, Logger) {

    /**
     *
     * @param {object} viewParams
     */
    function HelpForm(viewParams) {
      this.viewParams = viewParams;
      this.rdjData = viewParams.parentRouter.data.rdjData();
      this.pdjData = viewParams.parentRouter.data.pdjData();
      this.perspective = viewParams.perspective;
    }

    function createHelp() {
      var div = document.createElement("div");

      if (typeof this.pdjData.helpTopics !== 'undefined') {
        div.setAttribute("id", "cfe-help-footer");
        let title = document.createElement("p");
        title.innerHTML = "<b>Related Topics:</b>";
        div.append(title);
        let list = document.createElement("ul");
        div.append(list);

        for (var j in this.pdjData.helpTopics) {
          var topic = this.pdjData.helpTopics[j];

          let listElement = document.createElement("li");
          let ref = document.createElement("a");
          ref.setAttribute("href", topic.href);
          ref.setAttribute("target", "_blank");
          ref.setAttribute("rel", "noopener");
          ref.innerText = topic.label;

          listElement.append(ref);
          list.append(listElement);
        }
      }

      return div;
    }

    HelpForm.prototype = {
      setPDJData: function(pdjData) {
        this.pdjData = pdjData;
      },

      getHelpData: function (properties) {
        var helpData = [];

        // Create PageDataTypes instance using the form's slice
        // properties and perspective
        var pdjTypes = new PageDataTypes(properties, this.perspective.id);

        for (var i in properties) {
          var name = properties[i].name;
          var label = pdjTypes.getLabel(name);

          // Determine the help description for the property
          var fullHelp = pdjTypes.getFullHelp(name);

          var description = {view: HtmlUtils.stringToNodeArray(fullHelp)};

          helpData.push({Name: label, Description: description});
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