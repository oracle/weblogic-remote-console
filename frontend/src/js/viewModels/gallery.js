/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['ojs/ojcore', 'knockout', 'ojs/ojhtmlutils', '../microservices/perspective/perspective-manager', 'ojs/ojknockout', 'ojs/ojbinddom'],
  function (oj, ko, HtmlUtils, PerspectiveManager) {
    function GalleryTabTemplate(viewParams) {
      var self = this;

      this.galleryItems = PerspectiveManager.getAll();
      this.galleryItems.forEach((perspective) => {
        perspective.iconFile = perspective.iconFiles["light"];
        perspective.content = { view: HtmlUtils.stringToNodeArray(oj.Translations.getTranslatedString(`wrc-gallery.cards.${perspective.id}.description`))};
      });

      /**
       * Returns the NLS translated string for the tooltip of a navstrip item.
       * <p>It allows us to do two main things:
       * <ol>
       *   <li>Avoid putting oj.Translations.getTranlatedString() functions in the .html</li>
       *   <li>To restrict the use of the oj.Translations.getTranlatedString() function to the i18n object</li>
       * </ol>
       * @param {string} id
       * @returns {string}
       */
      this.getTooltip = function(id) {
        return oj.Translations.getTranslatedString(`wrc-gallery.cards.${id}.label`);
      };

      /**
       * Called when user clicks icon or label of sideways tabstrip item
       * @param event
       */
      this.galleryPanelClickHandler = function(event) {
        // The id attribute with the perspectiveId assigned
        // to it, is on the first child element of the
        // click event's current target. The click event's
        // current target is the <a> tag, and the first
        // child element (e.g. children[0]) of that is a
        // <div> tag.
        let value = event.currentTarget.children[0].id;
        if (typeof value === "undefined") {
          return;
        }
        else if (value === "view") {
          return;
        }
        viewParams.parentRouter.go("/landing/" + value);
      }

    }

    return GalleryTabTemplate;
  }
);