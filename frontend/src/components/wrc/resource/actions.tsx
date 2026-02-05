/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import "oj-c/button";
import { CButtonElement } from "oj-c/button";
import { ojDialog } from "ojs/ojdialog";
import { ojMenu } from "ojs/ojmenu";
import { Dialog } from "wrc/display/dialog";
import { useContext, useRef, useState } from "preact/hooks";
import { requireAsset } from "wrc/shared/url";
import { Model } from "../shared/model/common";
import { ContentModelFactory } from "../shared/model/contentmodelfactory";
import { FormContentModel } from "../shared/model/formcontentmodel";
import { TableContentModel } from "../shared/model/tablecontentmodel";
import { ListContentModel } from "../shared/model/listcontentmodel";
import { Action, Polling } from "../shared/typedefs/pdj";
import { RDJ, Reference } from "../shared/typedefs/rdj";
import { ActionInputForm } from "./form/actioninput";
import { UserContext } from "./resource";
import { KeySetImpl } from "ojs/ojkeyset";
import { ActionRedwoodMap } from "./action-redwood-map";
import Context = require("ojs/ojcontext");

type Props = {
  model: Model;
  enabledActions?: string[];
  selectedKeys?: KeySetImpl<string | Reference>;
  onActionSelected: (action: Action) => void;
  onActionPolling: (polling: Polling) => void;
};

export const Actions = ({ model, enabledActions, selectedKeys, onActionSelected, onActionPolling }: Props) => {
  const actions = model.getActions();

  // convert enabledActions to an associative array for easier reference..
  const enabledActionsMap = enabledActions?.reduce(
    (map, obj: string) => {
      map[obj] = true;
      return map;
    },
    {} as Record<string, boolean>,
  );


  const [actionInputRDJ, setActionInputRDJ] = useState<string>("");
  const ctx = useContext(UserContext);

  const [actionInputModel, setActionInputModel] = useState<FormContentModel>();
  const [actionInputTitle, setActionInputTitle] = useState<string>();
  const [selectedAction, setSelectedAction] = useState<Action>();

  // The completed action is called after ActionInputForm posts the input data
  const completedAction = () => {
    // IFF the completed action requires polling then perform the callback
    if (selectedAction?.polling) onActionPolling(selectedAction.polling);
  }

  const getOverlayDialog = () => {
    const disposeOverlayDialog = () => (document.getElementById("overlayFormDialog") as ojDialog)?.close();
    return (
      <Dialog id="overlayFormDialog" title={actionInputTitle}>
        <div slot="body" class="oj-bg-body">
          <ActionInputForm
            formModel={actionInputModel}
            setModel={setActionInputModel}
            callback={disposeOverlayDialog}
            completed={completedAction}
            action={selectedAction}
          ></ActionInputForm>
        </div>
      </Dialog>
    );
  };

  const _onActionSelected = (action: Action) => {
    // actions that specify an inputForm return an RDJ
    // with an ActionInputForm used to gather information from the user
    // Construct a model using the RDJ and provide it to the oj-dialog
    if (model.getActionFormInput(action)) {

      const references = [...selectedKeys?.values() || []] as string[];
      model
        .invokeAction(action, references)
        .then((response) => response.json())
        .then((rdj: RDJ) => {
          // Check for fileSaver - if present, download file and skip normal processing
          if (rdj.fileSaver) {
            const blob = new Blob([JSON.stringify(rdj.fileSaver.contents)], { type: rdj.fileSaver.mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = rdj.fileSaver.filename || 'project';
            a.click();
            URL.revokeObjectURL(url);
            return;
          }

          const cmf = new ContentModelFactory();
          cmf.rdjData = rdj;
          // cmf.baseUrl = ctx?.rdj;

          cmf
            .build(undefined)
            .then((model: ListContentModel | TableContentModel | FormContentModel | undefined) => {
              if (!(model instanceof FormContentModel)) {
                throw new Error("Action input must be a form");
              }

              model.rowsSelectedForActionInput = references;

              setActionInputTitle(action.label);
              setActionInputModel(model);
              setSelectedAction(action);
              // Defer open until after the Dialog element is mounted and set position imperatively
              // This was the previously working behavior; keep it here to ensure precise centering.
              requestAnimationFrame(() => {
                const dlg = document.getElementById("overlayFormDialog") as ojDialog | null;
                if (!dlg) return;

                // Use string form for my/at; mirrors original working behavior
                const centeredPos = { my: "center", at: "center", of: window };

                // Wait for JET BusyContext so the element is upgraded before setProperty/open
                const bc = (Context as any).getContext(dlg).getBusyContext();
                bc.whenReady().then(() => {
                  try {
                    (dlg as any).setProperty?.("position", centeredPos);
                  } catch (_e) {
                    try {
                      (dlg as any).position = centeredPos as any;
                    } catch (_e2) {
                      // no-op
                    }
                  }
                  dlg.open();
                });
              });
            });
        });
    } else {
      onActionSelected(action);
    }
  };
  const getAction = (action: Action) => {
    const getImage = (action: Action) => 
      ActionRedwoodMap[action.name] ? (
        <span slot='startIcon' class={ActionRedwoodMap[action.name]}>

        </span>
      )
        :
      (
        <img
          slot="startIcon"
          alt={action.label}
          src={requireAsset(`wrc/assets/images/action-${action.name.toLowerCase()}-icon-blk_24x24.png`)}
        ></img>
      )
    ;

    const getLabelText = (action: Action) => {
      let label: string | undefined;
      if (action.saveFirstLabel && model instanceof FormContentModel) {
        const formModel = model as FormContentModel;
        if (model.hasChanges()) label = action.saveFirstLabel;
      }
      return label || action.label;
    };

    const getLabel = (action: Action) => {
      const label = getLabelText(action);
      return (
        <span
          class="oj-navigationlist-item-label"
          style={{ alignContent: "center" }}
        >
          {label}
        </span>
      );
    };

    if (action.actions) {
      const actionMenuName = action.name + "Menu";
      const actionMenuRef = useRef<ojMenu>(null);
      return (
        <span class="wrc-action">
          <oj-c-button
            id={action.name}
            data-testid={action.name}
            disabled={!enabledActionsMap?.[action.name]}
            chroming="solid"
            label={getLabelText(action)}
            onojAction={() => actionMenuRef.current!.open()}
          >
            {getImage(action)}
            {getLabel(action)}
          </oj-c-button>
          <oj-menu
            ref={actionMenuRef}
            id={actionMenuName}
            aria-labelledby={action.name}
            openOptions={{ launcher: action.name }}
            slot="menu"
            onojMenuAction={(event: ojMenu.ojMenuAction) => {
              const actionToInvoke = action.actions?.find(
                (subaction) => subaction.name === event.detail.selectedValue,
              );
              if (actionToInvoke) _onActionSelected(actionToInvoke);
            }}
          >
            <>
              {action.actions.map((subaction) => (
                <oj-option
                  disabled={!enabledActionsMap?.[subaction.name]}
                  id={subaction.name}
                  value={subaction.name}
                >
                  {subaction.label}
                </oj-option>
              ))}
            </>
          </oj-menu>
        </span>
      );
    }

    return (
      <span class="wrc-action">
        <oj-c-button
          data-testid={action.name}
        disabled={!enabledActionsMap?.[action.name]}
        chroming="solid"
        label={getLabelText(action)}
        onojAction={(event: CButtonElement.ojAction) => {
          _onActionSelected(action);
          return true;
        }}
      >
        {getImage(action)}
        {getLabel(action)}
      </oj-c-button>
      </span>
    );
  };

  return (
    <>
      {getOverlayDialog()}
      <div class="wrc-actions-bar oj-flex oj-sm-align-items-center">
        {actions?.map((action) => getAction(action))}
      </div>
    </>
  );
};
