/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import { Dispatch, StateUpdater, useContext, useState } from "preact/hooks";
import { Response } from "wrc/shared/typedefs/common";
import { FormContentModel } from "../../shared/model/formcontentmodel";
import { UserContext } from "../resource";
import Translations = require("ojs/ojtranslation");
import { broadcastErrorMessage, broadcastMessageResponse } from "wrc/shared/controller/notification-utils";
import { WeightedSort } from "wrc/shared/weighted-sort";
import { ActionRedwoodMap } from "../action-redwood-map";
import { buildToolbarButtons } from "../shared/toolbar-render";
import type { ToolbarButtonConfig, ToolbarActionEvent } from "../shared/toolbar-types";
import ToolbarIcons from "../shared/toolbaricons";
import { doAction } from "wrc/shared/model/transport";
import { isSuccessful } from "wrc/shared/messages";
import * as Logger from "ojs/ojlogger";

type Props = {
  formModel: FormContentModel;
  setModel: Dispatch<StateUpdater<FormContentModel>>;
  showHelp: boolean;
  onHelpClick: () => void;
  pageContext?: string;
  pageLoading?: boolean;
  onPageRefresh?: () => void;
};

export enum BUTTONS {
  Cancel = "cancel",
  New = "new",
  Save = "save",
  __DELETE = "__DELETE",
  Write = "write",
  SaveNow = "savenow",
  Dashboard = "dashboard",
}

const FormToolbar = ({ formModel, setModel, showHelp, onHelpClick, pageContext, pageLoading = false, onPageRefresh }: Props) => {
  {
    const ctx = useContext(UserContext);
    const [refresh, setRefresh] = useState(false);

    const persistChanges = () => {
      formModel
        .update()
        .then((response) => response.json())
        .then((messageResponse: Response) => {

          const actionFailed = !isSuccessful(messageResponse);
          
          broadcastMessageResponse(ctx, messageResponse);
          
          if (!actionFailed) {
            formModel.clearChanges();
            formModel.refresh().then(() => {
              setModel(formModel.clone());
              if (messageResponse.resourceData) {
                ctx?.context?.routerController?.navigateToAbsolutePath(
                  messageResponse.resourceData.resourceData || ""
                );
              }
            });
          }
        })
        .then(() => {
          formModel.refresh().then(() => {
            setModel(formModel.clone());
            setRefresh(!refresh);
          });
        })
        .catch((err: Error) => {
          broadcastErrorMessage(ctx, err);
        });
    };

    const shouldShowCreateCTA = formModel.isCreatableOptionalSingleton() && formModel.isDataMissing();

    const buttons: Record<BUTTONS, ToolbarButtonConfig> = {
      [BUTTONS.Cancel]: {
        accesskey: undefined,
        isEnabled: () => formModel.hasChanges(),
        action: (event: ToolbarActionEvent) => {
          formModel.clear();
          setModel(formModel.clone());
          setRefresh(!refresh);
        },
        isVisible: () => formModel.hasChanges(),
        weight: 9,
      },
      [BUTTONS.New]: {
        // Create
        accesskey: "S",
        isEnabled: () => shouldShowCreateCTA ? true : formModel.hasChanges(),
        action: async (_event: ToolbarActionEvent) => {
          if (shouldShowCreateCTA) {
            const createForm = formModel.getCreateForm();
            const createFormRef: string | undefined = createForm?.resourceData;
            if (createFormRef) {
              const urlObj = new URL(createFormRef, window.location.href);
              const params = new URLSearchParams(urlObj.search);
              params.set("action", "create");
              urlObj.search = params.toString();
              try {
                const res = await doAction(
                  urlObj.pathname + urlObj.search + urlObj.hash,
                  undefined,
                  [],
                  { data: {} }
                );
                const messageResponse: any = await res.json().catch(() => undefined);
                if (messageResponse) {
                  broadcastMessageResponse(ctx, messageResponse);
                  if (isSuccessful(messageResponse)) {
                    ctx?.onActionCompleted?.({
                      action: { name: "create", label: t["wrc-form-toolbar"].buttons.new.label },
                      messages: messageResponse.messages
                    });
                  }
                  const navTo = messageResponse?.resourceData?.resourceData;
                  if (navTo) {
                    ctx?.context?.routerController?.navigateToAbsolutePath(navTo);
                  }
                }
              } catch (err) {
                broadcastErrorMessage(ctx, err as Error);
              }
            }
          } else {
            persistChanges();
          }
        },
        isVisible: () => formModel.isCreate() || shouldShowCreateCTA,
        weight: -1,
      },
      [BUTTONS.Save]: {
        // Save to cart
        accesskey: "S",
        isEnabled: () => formModel.hasChanges(),
        action: (event: ToolbarActionEvent) => persistChanges(),
        isVisible: () =>
          formModel.canSaveToCart &&
          !formModel.isFormReadOnly() &&
          !formModel.isCreate() &&
          !formModel.isActionInput() &&
          !shouldShowCreateCTA,
        weight: -1,
      },
      [BUTTONS.__DELETE]: {
        // Remove creatable optional singleton
        accesskey: undefined,
        label: t["wrc-form-toolbar"].buttons.delete.label,
        isEnabled: () => true,
        action: async (_event: ToolbarActionEvent) => {
          const selfRef = formModel.getSelfResourceData();
          if (!selfRef) return;
          try {
            const res = await doAction(
              selfRef,
              { name: "__DELETE" } as any,
              [{ resourceData: selfRef } as any]
            );
            const messageResponse: any = await res.json().catch(() => undefined);
            if (messageResponse) {
              broadcastMessageResponse(ctx, messageResponse);
              if (isSuccessful(messageResponse)) {
                ctx?.onActionCompleted?.({
                  action: { name: "__DELETE", label: t["wrc-form-toolbar"].buttons.delete.label },
                  messages: messageResponse.messages
                });
              }
            }
            await formModel.refresh();
            setModel(formModel.clone());
          } catch (err) {
            broadcastErrorMessage(ctx, err as Error);
          }
        },
        isVisible: () =>
          formModel.isCreatableOptionalSingleton() &&
          !formModel.isDataMissing() &&
          !formModel.isFormReadOnly() &&
          !formModel.isActionInput(),
        weight: -1,
      },
      [BUTTONS.Write]: {
        // "Download file"
        accesskey: "S",
        isEnabled: () => true,
        action: (event: ToolbarActionEvent) => Logger.info("download"),
        isVisible: () => formModel.canDownload,
      },
      [BUTTONS.SaveNow]: {
        accesskey: "S",
        isEnabled: () => formModel.hasChanges(),
        action: (event: ToolbarActionEvent) => persistChanges(),
        isVisible: () => formModel.canSaveNow && !formModel.isCreate(),
        weight: -1,
      },
      [BUTTONS.Dashboard]: {
        accesskey: undefined,
        isEnabled: () => formModel.canCreateDashboard(),
        action: (event: ToolbarActionEvent) => {
          const form = formModel.getDashboardCreateForm();
          if (form?.resourceData) {
            ctx?.context?.routerController?.navigateToAbsolutePath(form.resourceData);
          }
        },
        isVisible: () => formModel.canCreateDashboard(),
        label: formModel.getDashboardCreateForm()?.label || "Dashboard",
        weight: 99, // Should always appear at the end of the toolbar
      },
    };

    // normalize labels and icons for shared renderer
    const augmentButtons = () => {
      (Object.keys(buttons) as Array<BUTTONS>).forEach((k) => {
        if (!(buttons as any)[k].label)
          (buttons as any)[k].label = t["wrc-form-toolbar"].buttons[k]?.label || "";
        (buttons as any)[k].iconClass = ActionRedwoodMap[k];
        (buttons as any)[k].iconFile = `${k}-icon-blk_24x24`;
      });
    };
    augmentButtons();

    const syncAction = () => {
      if (pageLoading) return;
      if (formModel.isPolling()) {
        formModel.stopPolling();
        onPageRefresh?.();
      } else {
        formModel.refresh().then(() => {
          onPageRefresh?.();
        });
      }
    };

    const isMainWindow = pageContext === 'main';

    return (
      <div id="form-toolbar-container" class="oj-flex" style="max-width: 75rem;">
        <div id="form-toolbar-buttons" class="oj-flex-bar">
          <div class="oj-flex-bar-start">
            {!showHelp ? (
              <WeightedSort>{buildToolbarButtons(buttons as any)}</WeightedSort>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div id="form-toolbar-icons" class="oj-flex-item">
        {isMainWindow ? (
          <ToolbarIcons
            showHelp={showHelp}
            onHelpClick={onHelpClick}
            syncEnabled={!formModel.hasChanges()}
            onSyncClick={syncAction}
            actionPolling={formModel.isPolling() || pageLoading}
            pageContext={pageContext}
          />
        ) : (
          <></>
        )}
        </div>
      </div>
    );
  }
};

export default FormToolbar;
