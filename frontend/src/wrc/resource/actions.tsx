/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import "oj-c/button";
import { CButtonElement } from "oj-c/button";
import { ojDialog } from "ojs/ojdialog";
import { ojMenu } from "ojs/ojmenu";
import { Dialog } from "../display/dialog";
import { useContext, useEffect, useId, useRef, useState } from "preact/hooks";
import { requireAsset } from "wrc/shared/url";
import { Model } from "../shared/model/common";
import { ContentModelFactory } from "../shared/model/contentmodelfactory";
import { FormContentModel } from "../shared/model/formcontentmodel";
import { Action, Polling } from "../shared/typedefs/pdj";
import { RDJ, Reference } from "../shared/typedefs/rdj";
import { ActionInputForm } from "./form/actioninput";
import { UserContext } from "./resource";
import { KeySetImpl } from "ojs/ojkeyset";
import { ActionRedwoodMap } from "./action-redwood-map";
import { parseResponseJson, saveBlobToFile } from "../shared/model/transport";
import { broadcastErrorMessage } from "wrc/shared/controller/notification-utils";
import Context = require("ojs/ojcontext");

type Props = {
  model: Model;
  enabledActions?: string[];
  selectedKeys?: KeySetImpl<string | Reference>;
  onActionSelected: (action: Action) => void | Promise<void>;
  onActionPolling: (polling: Polling) => void;
};

type PendingActionOptions = {
  pendingActionName?: string;
  nextPendingActionName: string;
  setPendingActionName: (value: string | undefined) => void;
  invoke: () => Promise<void>;
  onError: (err: Error) => void;
};

export const invokePendingAction = async ({
  pendingActionName,
  nextPendingActionName,
  setPendingActionName,
  invoke,
  onError,
}: PendingActionOptions): Promise<void> => {
  if (pendingActionName) {
    return;
  }

  setPendingActionName(nextPendingActionName);

  try {
    await invoke();
  } catch (err) {
    onError(err as Error);
  } finally {
    setPendingActionName(undefined);
  }
};

export const Actions = ({ model, enabledActions, selectedKeys, onActionSelected, onActionPolling }: Props) => {
  const actions = model.getActions();
  const actionStatusId = useId();
  const waitCursorTimerRef = useRef<number | undefined>(undefined);
  const pendingActionLockRef = useRef(false);

  // convert enabledActions to an associative array for easier reference..
  const enabledActionsMap = enabledActions?.reduce(
    (map, obj: string) => {
      map[obj] = true;
      return map;
    },
    {} as Record<string, boolean>,
  );
  const ctx = useContext(UserContext);

  const [actionInputModel, setActionInputModel] = useState<FormContentModel>();
  const [actionInputTitle, setActionInputTitle] = useState<string>();
  const [selectedAction, setSelectedAction] = useState<Action>();
  const [pendingActionName, setPendingActionName] = useState<string>();
  const [pendingActionLabel, setPendingActionLabel] = useState<string>();
  const [showWaitCursor, setShowWaitCursor] = useState(false);
  const hasPendingAction = typeof pendingActionName !== "undefined";

  useEffect(() => {
    window.clearTimeout(waitCursorTimerRef.current);
    setShowWaitCursor(false);

    if (!hasPendingAction) {
      document.body.classList.remove("wrc-action-wait-cursor");
      return;
    }

    waitCursorTimerRef.current = window.setTimeout(() => {
      setShowWaitCursor(true);
    }, 2000);

    return () => {
      window.clearTimeout(waitCursorTimerRef.current);
    };
  }, [hasPendingAction]);

  useEffect(() => {
    document.body.classList.toggle("wrc-action-wait-cursor", showWaitCursor);

    return () => {
      document.body.classList.remove("wrc-action-wait-cursor");
    };
  }, [showWaitCursor]);

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

  const _onActionSelected = async (action: Action) => {
    // actions that specify an inputForm return an RDJ
    // with an ActionInputForm used to gather information from the user
    // Construct a model using the RDJ and provide it to the oj-dialog
    if (model.getActionFormInput(action)) {
      const references = [...selectedKeys?.values() || []] as string[];
      const response = await model.invokeAction(action, references);
      const rdj: RDJ = await parseResponseJson<RDJ>(response);

      // Check for fileSaver - if present, download file and skip normal processing
      if (rdj.fileSaver) {
        const blob = new Blob([JSON.stringify(rdj.fileSaver.contents)], { type: rdj.fileSaver.mimeType });
        saveBlobToFile(blob, rdj.fileSaver.filename || "project");
        return;
      }

      const cmf = new ContentModelFactory();
      cmf.rdjData = rdj;
      const actionModel = await cmf.build(undefined);
      if (!(actionModel instanceof FormContentModel)) {
        throw new Error("Action input must be a form");
      }

      actionModel.rowsSelectedForActionInput = references;

      setActionInputTitle(action.label);
      setActionInputModel(actionModel);
      setSelectedAction(action);

      await new Promise<void>((resolve) => {
        // Defer open until after the Dialog element is mounted and set position imperatively.
        requestAnimationFrame(() => {
          const dlg = document.getElementById("overlayFormDialog") as ojDialog | null;
          if (!dlg) {
            resolve();
            return;
          }

          const centeredPos = { my: "center", at: "center", of: window };
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
            resolve();
          });
        });
      });
      return;
    } else {
      await Promise.resolve(onActionSelected(action));
    }
  };

  const getActionLabelText = (action: Action) => {
    let label: string | undefined;
    if (action.saveFirstLabel && model instanceof FormContentModel) {
      if (model.hasChanges()) label = action.saveFirstLabel;
    }
    return label || action.label;
  };

  const runPendingAction = async (action: Action, pendingName = action.name) => {
    if (hasPendingAction || pendingActionLockRef.current) {
      return;
    }

    pendingActionLockRef.current = true;
    setPendingActionLabel(getActionLabelText(action));
    try {
      await invokePendingAction({
        pendingActionName,
        nextPendingActionName: pendingName,
        setPendingActionName,
        invoke: () => _onActionSelected(action),
        onError: (err) => broadcastErrorMessage(ctx, err),
      });
    } finally {
      pendingActionLockRef.current = false;
      setPendingActionLabel(undefined);
    }
  };

  const getPendingAttributes = (actionName: string) => {
    const isPending = pendingActionName === actionName;
    const classes = [
      isPending ? "wrc-action-button-pending" : "",
      showWaitCursor && isPending ? "wrc-action-button-waiting" : "",
    ].filter(Boolean).join(" ");

    return {
      class: classes || undefined,
      "aria-busy": isPending,
      "aria-pressed": isPending,
      "aria-disabled": hasPendingAction,
      "aria-describedby": isPending ? actionStatusId : undefined,
      "data-pending": isPending,
    };
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

    const getLabel = (action: Action) => {
      const label = getActionLabelText(action);
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
      const isPending = pendingActionName === action.name;
      return (
        <span class="wrc-action">
          <oj-c-button
            id={action.name}
            data-testid={action.name}
            disabled={!enabledActionsMap?.[action.name] || (hasPendingAction && !isPending)}
            chroming="solid"
            label={getActionLabelText(action)}
            onojAction={() => {
              if (!hasPendingAction) actionMenuRef.current!.open();
            }}
            {...getPendingAttributes(action.name)}
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
              if (actionToInvoke) void runPendingAction(actionToInvoke, action.name);
            }}
          >
            <>
              {action.actions.map((subaction) => (
                <oj-option
                  disabled={!enabledActionsMap?.[subaction.name] || hasPendingAction}
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
          disabled={!enabledActionsMap?.[action.name] || (hasPendingAction && pendingActionName !== action.name)}
          chroming="solid"
          label={getActionLabelText(action)}
          onojAction={(_event: CButtonElement.ojAction) => {
            if (hasPendingAction) {
              return true;
            }
            void runPendingAction(action);
            return true;
          }}
          {...getPendingAttributes(action.name)}
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
      <div class="wrc-actions-bar oj-flex oj-sm-align-items-center" aria-busy={hasPendingAction}>
        <span
          id={actionStatusId}
          class="oj-helper-hidden-accessible"
          aria-live="polite"
          aria-atomic="true"
        >
          {hasPendingAction ? `${pendingActionLabel || ""} ${t["wrc-indirect-field"].loading.value}` : ""}
        </span>
        {actions?.map((action) => getAction(action))}
      </div>
    </>
  );
};
