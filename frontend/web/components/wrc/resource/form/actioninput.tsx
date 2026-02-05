/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import { Dispatch, useContext, useState } from "preact/hooks";
import { requireAsset } from "wrc/shared/url";
import { Response } from "wrc/shared/typedefs/common";
import { FormContentModel } from "../../shared/model/formcontentmodel";
import { Action } from "../../shared/typedefs/pdj";
import { UserContext } from "../resource";
import Form from "./form";
import { FormIntro } from "./formintro";
import { broadcastErrorMessage, broadcastMessageResponse } from "wrc/shared/controller/notification-utils";
import { ActionRedwoodMap } from "../action-redwood-map";
import { Help } from "../shared/help";
import "oj-c/button";
import { isSuccessful } from "wrc/shared/messages";

type Props = {
  formModel?: FormContentModel;
  setModel?: Dispatch<FormContentModel>;
  callback?: () => void;
  completed?: () => void;
  action?: Action;
};

export const ActionInputForm = ({ formModel, setModel, callback, completed, action }: Props) => {
  const [showHelp, setShowHelp] = useState(false);
  const helpImageSrc = !showHelp
    ? requireAsset("wrc/assets/images/toggle-help-on-blk_24x24.png")
    : requireAsset("wrc/assets/images/toggle-help-off-blk_24x24.png");

  const helpIconClicked = () => {
    setShowHelp(!showHelp);
  };

  const onCancel = () => {
    callback?.();
  };

  const ctx = useContext(UserContext);

  const onSave = () => {
    formModel
      ?.update()
      .then((response) => response.json())
      .then((messageResponse: Response) => {
        completed?.();

        broadcastMessageResponse(ctx, messageResponse);
        
        if (isSuccessful(messageResponse)) {
          const actionObj: Action = action ? action : { name: "actionInput", label: "Action Input" };
          ctx?.onActionCompleted?.({ action: actionObj, messages: messageResponse.messages });
        }
        
        if (messageResponse.reinit) {
          ctx?.context?.applicationController?.resetDisplay();  
        }

        if (messageResponse.resourceData?.resourceData) {
          ctx?.context?.routerController?.navigateToAbsolutePath(messageResponse.resourceData.resourceData);
        }
        
      })
      .catch((err: Error) => {
        broadcastErrorMessage(ctx, err);
      });
    callback?.();
  };

  if (formModel) {
    return (
      <div slot="body">
        <div id="overlay-toolbar-container" class="oj-flex">
          <div
            id="overlay-form-toolbar-buttons"
            class="oj-flex-bar cfe-overlay-form-dialog-toolbar"
          >
            <div id="overlay-form-toolbar-save-button">
              <oj-c-button chroming="borderless" label={t["wrc-common"].buttons.done.label} onojAction={onSave}>
                <span slot="startIcon" class={ActionRedwoodMap["done"]}></span>
                <span class="button-label">
                  {t["wrc-common"].buttons.done.label}
                </span>
              </oj-c-button>
            </div>
            <oj-c-button chroming="borderless" label={t["wrc-common"].buttons.cancel.label} onojAction={onCancel}>
              <span slot="startIcon" class={ActionRedwoodMap["cancel"]}></span>
              <span class="button-label">
                {t["wrc-common"].buttons.cancel.label}
              </span>
            </oj-c-button>
          </div>
          <div
            id="overlay-form-toolbar-icons"
            class="oj-flex-item cfe-overlay-form-dialog-toolbar"
          >
            <div class="oj-flex oj-sm-flex-items-initial oj-sm-justify-content-flex-end cfe-flex-items-pad">
              <div id="overlay-page-help-toolbar-icon" class="oj-flex-item">
                <a
                  href="#"
                  title={t["wrc-form-toolbar"].icons.help.tooltip}
                  tabIndex={-1}
                  onClick={helpIconClicked}
                >
                  <img
                    id="overlay-page-help-icon"
                    src={helpImageSrc}
                    alt={t["wrc-form-toolbar"].icons.help.tooltip}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div id="overlay-container" class="cfe-overlay-container">
          {!showHelp ? (
            <>
              <FormIntro
                formModel={formModel as FormContentModel}
                setModel={setModel}
              />
              <Form
                formModel={formModel as FormContentModel}
                setModel={setModel}
              />
            </>
          ) : (
            <Help model={formModel} />
          )}
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};
