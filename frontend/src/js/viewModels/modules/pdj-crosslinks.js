/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['ojs/ojlogger', '../../cfe/common/utils'],
  function (Logger, Utils) {

    const i18n = {
      messages: {
        "noNotFoundMessage": "RDJ did not contain a 'notFoundMessage' field for the '{0}' item."
      }
    };

    function getRDJNavigationData(navigation, breadcrumbsLength) {
      const data = [];
      const i = breadcrumbsLength;
      if (i > 0) {
        navigation.forEach((item) => {
          data.push({
            name: Utils.displayNameFromIdentity(item.identity).replaceAll(" ", ""),
            label: Utils.displayNameFromIdentity(item.identity),
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
            name: Utils.displayNameFromIdentity(item.resourceIdentity).replaceAll(" ", ""),
            label: item.label,
            descriptionHTML: "<p/>",
            message: (typeof item.notFoundMessage !== "undefined" ? item.notFoundMessage : i18n.messages.noNotFoundMessage.replace("{0}", item.label)),
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
