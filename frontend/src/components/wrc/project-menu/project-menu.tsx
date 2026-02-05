import "css!wrc/project-menu/project-menu-styles.css";
import "oj-c/button";
import "oj-c/menu-button";
import { MenuElement, ojMenu } from "ojs/ojmenu";
import "ojs/ojpopup";
import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType } from "preact";
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { Resource, UserContext } from "wrc/resource/resource";
import { Global } from "wrc/shared/global";
import { Reference } from "wrc/shared/typedefs/rdj";
import componentStrings = require("ojL10n!./resources/nls/project-menu-strings");

import { ojDialog } from "ojs/ojdialog";
import { Dialog } from "wrc/display/dialog";
import { ResourceData } from "wrc/nav-tree/types";
import { doAction } from "wrc/shared/model/transport";
import { Response } from "wrc/shared/typedefs/common";
import { broadcastErrorMessage, broadcastMessageResponse } from "wrc/shared/controller/notification-utils";
import * as Logger from "ojs/ojlogger";

/**
 *
 *
 * @ojmetadata displayName "A user friendly, translatable name of the component"
 * @ojmetadata description "A translatable high-level description for the component"
 * @ojmetadata main "wrc/project-menu"
 */
function ProjectMenuImpl() {
  const ctx = useContext(UserContext);

  const [providers, setProviders] = useState<ResourceData[]>();

  useEffect(() => {
    const databus = ctx?.databus;

    const signal = databus?.subscribe((e) => {
      setProviders(e.providers.providers);
    });

    return () => (signal as any)?.detach();
  }, []);

  const navigate = (ref?: Reference) => {
    if (ref?.resourceData) {
      ctx?.context?.routerController?.navigateToAbsolutePath(ref.resourceData);
    }
  };
  const menuItemAction = (event: MenuElement.ojMenuAction) => {
    const value = event.detail.selectedValue;
    Logger.info(`Selected menu item: ${value}`);

    if (value === PROVIDER_INFO_RDJ) {
      setProviderInfoRdj(value);

      requestAnimationFrame(() =>
        (document.getElementById("providerInfoDialog") as ojDialog).open(),
      );
    } else if (value === PROVIDER_TABLE_RDJ) {
      navigate({ resourceData: value });
    } else {
      doAction(value, undefined).then((response) => response.json())
            .then((messageResponse: Response) => {
            broadcastMessageResponse(ctx, messageResponse);
      
              if (messageResponse.reinit) {
                ctx?.context?.applicationController?.resetDisplay();
              }
      
              if (messageResponse.resourceData?.resourceData) {
                Logger.info('navigating to ');
                Logger.info(messageResponse.resourceData?.resourceData);
                Logger.info(messageResponse.resourceData as any);
                ctx?.context?.routerController?.navigateToAbsolutePath(
                  messageResponse.resourceData?.resourceData,
                );
              }
            })
            .catch((err: Error) => {
              Logger.error(err.message);
              broadcastErrorMessage(ctx, err);
            });
    }
  };

  const openListener = () => {
    (document.getElementById("project-menu-dialog") as ojMenu).open();
  };

  const PROVIDER_INFO_RDJ = "/api/-current-/status/form";
  const PROVIDER_TABLE_RDJ = "/api/-project-/group";
  const [providerInfoRdj, setProviderInfoRdj] = useState<string>();

  const dialogRef = useRef<ojDialog | null>(null);

  return (
    <>
      <oj-c-button
        id="projectMenuButton"
        class="oj-sm-margin-0 oj-sm-padding-0"
        chroming="ghost"
        aria-label="Project Menu"
        onojAction={openListener}
      >
        <span slot="startIcon" class="oj-ux-ico-overflow-v"></span>
      </oj-c-button>
      <oj-menu
        id="project-menu-dialog"
        slot="menu"
        onojMenuAction={menuItemAction}
        openOptions={{ launcher: "projectMenuButton" }}
      >
        <oj-option value={PROVIDER_INFO_RDJ}>
          Provider Information&nbsp;&nbsp;
          <span class="oj-ux-ico-external-link"></span>
        </oj-option>
        <oj-option value={PROVIDER_TABLE_RDJ}>
          Go To Project/Provider Table
        </oj-option>
        <oj-option id="divider"></oj-option>
        {providers?.map((provider) => (
          <oj-option value={provider.resourceData}>{provider.label}</oj-option>
        ))}
      </oj-menu>
      <Dialog
        id="providerInfoDialog"
        onojClose={(e) => {
          if (e?.target === dialogRef.current) {
            setProviderInfoRdj(undefined);
          }
        }}
        ref={dialogRef}
        position={{
          my: { horizontal: "center", vertical: "center" },
          at: { horizontal: "center", vertical: "center" },
        }}
      >
        <div slot="body" class="oj-bg-body">
          <Resource rdj={providerInfoRdj || ""}></Resource>{" "}
        </div>
      </Dialog>
    </>
  );
}

export const ProjectMenu: ComponentType<
  ExtendGlobalProps<ComponentProps<typeof ProjectMenuImpl>>
> = registerCustomElement("wrc-project-menu", ProjectMenuImpl);
