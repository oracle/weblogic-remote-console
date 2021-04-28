/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['ojs/ojcore', 'ojs/ojlogger', './utils'],
  function (oj, Logger, PageDefinitionUtils) {

    const i18n = {
      messages: {
        "noNotFoundMessage": {
          "summary": oj.Translations.getTranslatedString("wrc-pdj-crosslinks.messages.noNotFoundMessage.summary"),
          "detail": oj.Translations.getTranslatedString("wrc-pdj-crosslinks.messages.noNotFoundMessage.detail", "{0}")
        }
      }
    };

    function getRDJNavigationData(navigation, breadcrumbsLength) {
      const data = [];
      const i = breadcrumbsLength;
      if (i > 0) {
        navigation.forEach((item) => {
          data.push({
            name: PageDefinitionUtils.displayNameFromIdentity(item.identity).replaceAll(" ", ""),
            label: PageDefinitionUtils.displayNameFromIdentity(item.identity),
            descriptionHTML: item.descriptionHTML,
            message: "",
            identity: item.identity
          });
        });
      }
      return data;
    }

    function getRDJLinksData(links, breadcrumbsLength) {
      const data = [];
      const i = breadcrumbsLength;
      if (i > 0) {
        links.forEach((item) => {
          data.push({
            name: PageDefinitionUtils.displayNameFromIdentity(item.resourceIdentity).replaceAll(" ", ""),
            label: item.label,
            descriptionHTML: "<p/>",
            message: (typeof item.notFoundMessage !== "undefined" ? item.notFoundMessage : i18n.messages.noNotFoundMessage.detail.replace("{0}", item.label)),
            identity: item.resourceIdentity
          });
        });
      }
      return data;
    }

  //public:
    return {
      getBreadcrumbsLinksData: function (rdjData, breadcrumbsLength) {
        return new Promise(function (resolve) {
          const data1 = (typeof rdjData.navigation === "undefined" ? [] : getRDJNavigationData(rdjData.navigation, breadcrumbsLength));
          const data2 = (typeof rdjData.links === "undefined" ? [] : getRDJLinksData(rdjData.links, breadcrumbsLength));
          if (data1.length > 0 && data2.length > 0) {
            data1.push({
              name: "---"
            });
          }
          resolve(data1.concat(data2));
        });
      }
    };
  }
);
