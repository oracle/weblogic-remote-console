/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['ojs/ojcontext', '../../cfe/common/runtime', '../../cfe/io/adapter', '../../cfe/services/preferences/preferences', '../../cfe/services/domain/domain-connection-manager'],
  function(Context, Runtime, FileAdapter, Preferences, DomainConnectionManager){
    function DesktopTemplate(viewParams) {

      const OFFSET_Y = 105;

      const i18n = {
        folder: {
          image: {
            empty: "myhome-empty-folder_64x53.png",
            populated: "myhome-populated-folder_64x53.png"
          }
        },
        icon: {
          image: "domains-popup-icon-blk_32x32.png"
        }
      };

      var offsetWidth = 5;

      /**
       * 
       * @param {object} dragItem <div> element with a ``cfe-draggable`` class attribute 
       * @param {number} startX Initial window-relative X offset (e.g. top) for ``dragItem``
       * @param {number} startY Initial window-relative Y offset (e.g. left) for ``dragItem`` 
       */
      function dragElement(dragItem, startX, startY) {
        let data = JSON.parse(dragItem.getAttribute("data-desktop"));
        let currentDroppable = null;

        // Need to initialize shifts because they are used in moveAt()
        let shiftX = 0;
        let shiftY = 0;

        // Move dragItem to initial location on the desktop
        moveAt(startX, startY);

        // moves the dragItem at (pageX, pageY) coordinates
        // taking initial shifts into account
        function moveAt(pageX, pageY) {
          dragItem.style.left = pageX - (shiftX + offsetWidth) + 'px';
          dragItem.style.top = pageY - (shiftY + OFFSET_Y) +  'px';
        }

        function enterDroppable(elem) {
          elem.style.backgroundColor = "#e9e7e1";
          if (!elem.id.startsWith(data.type)) {
            dragItem.style.cursor = "no-drop";
          }
        }
    
        function leaveDroppable(elem) {
          const theme = Preferences.themePreference();
          elem.style.backgroundColor = Runtime.getConfig().settings.themes[theme][1];
          dragItem.style.cursor = "default";
        }

        function getElementBelow(pageX, pageY){
          dragItem.hidden = true;
          let elemBelow = document.elementFromPoint(pageX, pageY);
          dragItem.hidden = false;
          return elemBelow;
        }

        dragItem.onmousedown = function(event) {
          shiftX = event.clientX - dragItem.getBoundingClientRect().left;
          shiftY = event.clientY - dragItem.getBoundingClientRect().top;
          startX = event.clientX;
          startY = event.clientY;

          moveAt(event.pageX, event.pageY);
        
          function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);

            let elemBelow = getElementBelow(event.clientX, event.clientY);

            if (!elemBelow) return;

            let droppableBelow = elemBelow.closest('.cfe-droppable');

            if (currentDroppable !== droppableBelow) {
              const ele = document.getElementById("navstrip-builtins");
              if (ele !== null) {
                if (ele.style.visibility === "hidden") currentDroppable = null;
              }

              if (currentDroppable) {
                // currentDroppable is not null, so we
                // were over a cfe-droppable before this 
                // event. Go ahead and call leaveDroppable
                leaveDroppable(currentDroppable);
              }

              currentDroppable = droppableBelow;

              if (currentDroppable) {
                // currentDroppable is not null, so we
                // are coming over a cfe-droppable now. 
                // Note that it's possible that this
                // cfe-droppable is the one we just
                // dropped dragItem on. 
                enterDroppable(currentDroppable);
              }
            }
          }

          // move the dragItem on mousemove
          document.addEventListener('mousemove', onMouseMove);
        
          // drop the dragItem, remove unneeded handlers
          dragItem.onmouseup = function(event) {
            document.removeEventListener('mousemove', onMouseMove);
            dragItem.onmouseup = null;
            console.log(`User drug ${dragItem.id} from [${startX}, ${startY}] to [${event.clientX}, ${event.clientY}], then dropped it. xy-coordinates=[${event.clientX - 50}, ${event.clientY - 40}]`);

            if (currentDroppable){
              processDroppedData(dragItem, currentDroppable);
              leaveDroppable(currentDroppable);
              moveAt(startX, startY);
            }
          };
        
        };
        
        dragItem.ondblclick = function() {
          console.log(`User double-clicked on ${dragItem.id}`)

          const domainRegistration = DomainConnectionManager.getById(dragItem.id)

          switch(data.type){
            case "registered-domain":
              Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN, domainRegistration.name);
              Runtime.setProperty(Runtime.PropertyName.CBE_WLS_VERSION_ONLINE, domainRegistration.version);

              viewParams.signaling.domainChanged.dispatch();
              break;
          }
          return true;
        };

        dragItem.ondragstart = function() {
          return false;
        };  
      }

      function processDroppedData(dragItem, droppable){
        let data = JSON.parse(dragItem.getAttribute("data-desktop"));
        if (droppable.id.startsWith(data.type)) {
          switch(droppable.id){
            case "navstrip-builtins":
              break;
            default:
                console.log(`User dropped ${JSON.stringify(data.data)} on ${droppable.id}.`);
          }
        }
      }

      function renderDesktopItems(desktopItems, desktopContainer) {
        let div, img, span;

        desktopItems.folder.items.forEach((item) => {
          div = document.createElement("div");
          div.setAttribute("id", item.id);
          div.className = "cfe-draggable";
          div.style.width = "100px";

          switch(item.type){
            case "beanpath-history":
              div.setAttribute("data-desktop", '{"type": "beanpath-history", "data": ' + JSON.stringify(item.data) + '}');
              break;
            case "navstrip":
              div.setAttribute("data-desktop", '{"type": "navstrip", "data": ' + JSON.stringify(item.data) + '}');
              break;
            case "navtree":
              div.setAttribute("data-desktop", '{"type": "navtree", "perspective": "control", "data": ' + JSON.stringify(item.data) + '}');
              break;
          }
  
          img = document.createElement("img");
          if (item.state === "populated") {
            img.setAttribute("src", "../../images/" + i18n.folder.image.populated);
          }
          else {
            img.setAttribute("src", "../../images/" + i18n.folder.image.empty);
          }
  
          span = document.createElement("span");
          span.innerText = item.label;
  
          div.append(img);
          div.append(span);
  
          desktopContainer.append(div);
  
          dragElement(div, item["xy-coordinates"][0], item["xy-coordinates"][1]);
        });

        desktopItems.icon.items.forEach((item) => {
          div = document.createElement("div");
          div.setAttribute("id", item.id);
          div.className = "cfe-draggable";

          switch(item.type){
            case "registered-domain":
              div.setAttribute("data-desktop", '{"type": "registered-domain", "data": ' + JSON.stringify(item.data) + '}');
              break;
          }
          
          img = document.createElement("img");
          img.setAttribute("src", "../../images/" + i18n.icon.image);
  
          span = document.createElement("span");
          span.innerText = item.label;
  
          div.append(img);
          div.append(span);
  
          desktopContainer.append(div);
  
          dragElement(div, item["xy-coordinates"][0], item["xy-coordinates"][1]);
        });
      }

      viewParams.signaling.navtreeResized.add((newOffsetLeft, newOffsetWidth) => {
        offsetWidth = (newOffsetLeft + newOffsetWidth);
      });

      this.transitionCompleted = function()
      {
        let desktopContainer = document.getElementById("desktop-container");
        if (desktopContainer != null) {
          const busyContext = Context.getContext(desktopContainer).getBusyContext();
          busyContext.whenReady()
          .then(function () {
            FileAdapter.readJson("resources/desktop.json")
            .then((desktopItems) => {
              renderDesktopItems(desktopItems, desktopContainer);
            });
          });
        }
      }
      
    }

    return DesktopTemplate;
  }
);