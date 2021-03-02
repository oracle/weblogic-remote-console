/**
 * @license
 * Copyright (c) 2020 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['knockout', '../../cfe/services/perspective/perspective-manager', 'ojs/ojhtmlutils', 'ojs/ojknockout', 'ojs/ojbinddom'],
  function (ko, PerspectiveManager, HtmlUtils) {
    function GalleryTabTemplate(viewParams) {
      var self = this;

      this.galleryItems = PerspectiveManager.getAll();
      this.galleryItems.forEach((perspective) => {
        perspective.iconFile = perspective.iconFiles["light"];
        perspective.content = { view: HtmlUtils.stringToNodeArray(perspective.description)};
      });

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
        if (typeof value === "undefined") return;

        viewParams.parentRouter.go("/landing/" + value);
      }

    }

    return GalleryTabTemplate;
  }
);