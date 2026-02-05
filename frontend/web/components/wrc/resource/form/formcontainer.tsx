/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { Dispatch, StateUpdater, useContext, useEffect, useState } from "preact/hooks";
import {
  broadcastErrorMessage,
  broadcastMessageResponse,
} from "wrc/shared/controller/notification-utils";
import { FormContentModel } from "../../shared/model/formcontentmodel";
import { TableContentModel } from "../../shared/model/tablecontentmodel";
import { ListContentModel } from "../../shared/model/listcontentmodel";
import { Response } from "../../shared/typedefs/common";
import { Action, Polling, Property } from "../../shared/typedefs/pdj";
import { Actions } from "../actions";
import { UserContext } from "../resource";
import Form  from "./form";
import { FormIntro } from "./formintro";
import { TableIntro } from "../table/tableintro";
import FormToolbar from "./formtoolbar";
import TableToolbar from "../table/table-toolbar";
import FieldSettingsDialog from "./field-settings-dialog";
import SliceTable from "./slicetable";
import Tabs from "./tabs";
import Breadcrumbs from "../breadcrumbs";
import { Help } from "../shared/help";
import { KeySetImpl } from "ojs/ojkeyset";
import { subscribeToRefresh, RefreshDetail } from "wrc/shared/refresh";
import { isSuccessful } from "wrc/shared/messages";
import * as Logger from "ojs/ojlogger";
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";

type Props = {
  model: FormContentModel | TableContentModel;
  pageContext?: string;
};

/**
 * Render entire form container, which could be a help screen or
 * the toolbar, tabs, and form that comprise the form screen
 *
 * The content model may be a form or a table -- because a form can
 * contain a SliceTable
 *
 * @param model - model to render
 * @returns
 */
export const FormContainer = ({ model, pageContext }: Props) => {
  const [loading, setLoading] = useState(false);
  const [_1, setRefresh] = useState(false);
  const [contentModel, setModel] = useState<FormContentModel | TableContentModel | ListContentModel>(model);
  const [fieldSettingsOpen, setFieldSettingsOpen] = useState(false);
  const [fieldSettingsField, setFieldSettingsField] = useState<Property | undefined>(undefined);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<KeySetImpl<string>>(new KeySetImpl<string>());
  const [enabledActions, setEnabledActions] = useState<string[]>([]);

  useEffect(() => { setModel(model); }, [model]);

  // Update page title when the displayed content model changes (e.g., tab switch)
  useEffect(() => {
    const title = (contentModel as any)?.getPageTitle?.();
    if (title) {
      const appName = t["wrc-header"]?.text?.appName || "WebLogic Remote Console";
      document.title = `${appName} - ${title}`;
    }
  }, [contentModel]);

  // Ensure that any actionPolling is stopped when DOM destroyed
  useEffect(() => { return () => contentModel.stopPolling(); }, []);

  // Listen for global refresh requests (content scope)
  useEffect(() => {
    const unsubscribe = subscribeToRefresh((detail: RefreshDetail) => {
      const scope = detail?.scope || {};
      if (scope.content) {
        try {
          if (contentModel) {
            Promise.resolve(contentModel.refresh())
              .catch((err: any) => {
                // check for a 404 -- this means that the mbean being refreshed no longer exists
                // a common use case would be discarding shopping cart changes while editing a newly created server
                // for now just go back to the beginning...
                if (err && err.status === 404) {
                  // instead of propagating the error go to this mbean's parent, if unavailable go back to the beginning
                  let pathToForwardTo;

                  const breadcrumbs = model.getBreadcrumbs();
                  // get the penultimate breadcrumb...
                  if (breadcrumbs && breadcrumbs.length > 1) {
                    const breadcrumb = breadcrumbs[breadcrumbs.length - 2];

                    pathToForwardTo = breadcrumb.resourceData;
                  }

                  ctx?.context?.routerController?.navigateToAbsolutePath(
                    pathToForwardTo || "/api/-current-/group/",
                  );
                  return;
                }
                throw err;
              })
              .finally(() => {
                setRefresh((prev) => !prev);
              });
          } else {
            setRefresh((prev) => !prev);
          }
        } catch (_e) {
          setRefresh((prev) => !prev);
        }
      }
    });
    return unsubscribe;
  }, [contentModel]);

  // Listen once for global launcher events and open single FieldSettings dialog
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { fieldDescription: Property };
      if (detail?.fieldDescription) {
        setFieldSettingsField(detail.fieldDescription);
        setFieldSettingsOpen(true);
      }
    };
    document.addEventListener("open-field-settings", handler as EventListener);
    return () => {
      document.removeEventListener("open-field-settings", handler as EventListener);
    };
  }, []);

  const getToolbarArea = () => {
    if (contentModel instanceof FormContentModel) {
      return (
        <>
          <FormToolbar
            formModel={contentModel}
            setModel={setModel as Dispatch<StateUpdater<FormContentModel>>}
            showHelp={showHelp}
            onHelpClick={() => setShowHelp(!showHelp)}
            pageContext={pageContext}
            pageLoading={loading}
            onPageRefresh={() => setRefresh(prev => !prev)}
          />
          {!showHelp ? <FormIntro formModel={contentModel} setModel={setModel} /> : <></>}
        </>
      );
    } else if (contentModel instanceof TableContentModel) {
      return (
        <>
          <TableToolbar
            tableContent={contentModel}
            setTableContent={setModel}
            showHelp={showHelp}
            onHelpClick={() => setShowHelp(!showHelp)}
            pageContext={pageContext}
            pageLoading={loading}
            onPageRefresh={() => setRefresh(prev => !prev)}
          />
          {!showHelp ? <TableIntro tableContent={contentModel} /> : <></>}
        </>
      );
    } else {
      return <></>;
    }
  }

  const getTabContentArea = () => {
    if (contentModel instanceof TableContentModel) {
      return <SliceTable tableModel={contentModel as TableContentModel} pageContext={pageContext} onSelectionChanged={(keys: KeySetImpl<string>) => setSelectedKeys(keys)} />;
    } else if (contentModel instanceof FormContentModel) {
      return <Form formModel={contentModel} setModel={setModel} />;
    } else {
      return <></>;
    }
  };
  const ctx = useContext(UserContext);

  const beginPolling = (polling: Polling) => {
    contentModel.startPolling(polling, ()=>setRefresh(prev => !prev));
    setRefresh(prev => !prev); // Toolbar needs to know action polling has started
  };

  // Helper: robust selection count (avoid KeySetImpl internals)
  const getSelectionCount = (keys: KeySetImpl<string>) => Array.from(keys?.values?.() || []).length;

  // Compute enabled actions
  // - For sliceTable/TableContentModel: selection-aware enabling
  // - For forms and other models: enable all actions and subactions
  const computeEnabledActions = () => {
    const actions = contentModel.getActions?.() || [];
    // Non-table: enable everything (menus and subitems)
    if (!(contentModel instanceof TableContentModel)) {
      const all: string[] = [];
      actions.forEach((a: Action) => {
        all.push(a.name);
        if (a.actions) a.actions.forEach(sub => all.push(sub.name));
      });
      setEnabledActions(all);
      return;
    }

    // TableContentModel: selection-aware
    const newEnabled: string[] = [];
    const selectedCount = getSelectionCount(selectedKeys);

    const isEnabledFor = (a: Action) => {
      switch (a.rows) {
        case "multiple":
          return selectedCount > 0;
        case "one":
          return selectedCount === 1;
        case "none":
        default:
          return true;
      }
    };

    actions.forEach((a: Action) => {
      if (a.actions) {
        let anyEnabled = false;
        a.actions.forEach((sub) => {
          const enabled = isEnabledFor(sub);
          if (enabled) newEnabled.push(sub.name);
          anyEnabled = anyEnabled || enabled;
        });
        if (anyEnabled) newEnabled.push(a.name);
      } else {
        if (isEnabledFor(a)) newEnabled.push(a.name);
      }
    });

    setEnabledActions(newEnabled);
  };

  // Recompute when selection or model changes
  useEffect(() => {
    computeEnabledActions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKeys, contentModel]);

  const actionSelected = async (action: Action) => {
    const formModel = model as FormContentModel;

    // saveFirstLabel is a flag as well as a label.. if it's set then save the form first,
    // then on success invoke the action...
    // The save and invocation need to be done synchronously so rely on await for the save function
    if (action.saveFirstLabel && formModel.hasChanges()) {
      try {
        const response = await formModel.update();
        const messageResponse: Response = await response.json();

        const actionFailed = !isSuccessful(messageResponse);

        broadcastMessageResponse(ctx, messageResponse);

        if (actionFailed) {
          return;
        }

        if (!actionFailed) {
          formModel.clearChanges();
          await formModel.refresh();
        }
      } catch (err) {
        broadcastErrorMessage(ctx, err as Error);
      }
    }

    const references = (contentModel instanceof TableContentModel)
      ? ([...selectedKeys.values()].map((r) => JSON.parse(r as string)))
      : undefined;

    contentModel
      .invokeAction(action, references as any)
      .then((response) => response.json())
      .then((messageResponse: Response) => {
        if (action.polling) {
          beginPolling(action.polling);
        }

        broadcastMessageResponse(ctx, messageResponse);

        if (isSuccessful(messageResponse)) {
          ctx?.onActionCompleted?.({ action, messages: messageResponse.messages });
        }

        if (messageResponse.reinit) {
          ctx?.context?.applicationController?.resetDisplay();
        }

        if (messageResponse.resourceData?.resourceData) {
          ctx?.context?.routerController?.navigateToAbsolutePath(
            messageResponse.resourceData?.resourceData,
          );
        }
      })
      .catch((err: Error) => {
        Logger.error(err.message);
        broadcastErrorMessage(ctx, err);
      });
  };

  // not clear why the selection is set to 'multiple' ... just enable everything for now
  // enabledActions computed via selection-aware logic

  // Mark the DOM if there are changes -- this governs canExit behavior...
  const hasChangesFlag = (contentModel as FormContentModel)?.hasChanges?.();

  const isMainWindow = pageContext === 'main';

  return (
    <div>
      {isMainWindow ? <Breadcrumbs model={contentModel} /> : <></>}
      {contentModel instanceof FormContentModel ? (
        <FieldSettingsDialog
          open={fieldSettingsOpen}
          formModel={contentModel as FormContentModel}
          fieldDescription={fieldSettingsField}
          onClose={() => {
            setFieldSettingsOpen(false);
            setFieldSettingsField(undefined);
          }}
          onApply={() => setModel((contentModel as FormContentModel).clone())}
        />
      ) : (
        <></>
      )}
      {getToolbarArea()}
      <div id="cfe-form" data-has-changes={hasChangesFlag}>
        {showHelp ? (
          (contentModel instanceof FormContentModel || contentModel instanceof TableContentModel) ? (
            <Help model={contentModel} />
          ) : (
            <></>
          )
        ) : (
          <Tabs model={contentModel as FormContentModel | TableContentModel} setModel={setModel} setLoading={setLoading} pageContext={pageContext}>
            {loading ? (
              <></>
            ) : (
              <>
                <div
                  id="form-actions-strip-container"
                  class="cfe-actions-strip-container"
                >
                  <Actions
                    model={contentModel}
                    enabledActions={enabledActions}
                    selectedKeys={selectedKeys}
                    onActionSelected={actionSelected}
                    onActionPolling={beginPolling}
                  ></Actions>
                </div>
                {getTabContentArea()}
              </>
            )}
          </Tabs>
        )}
      </div>
    </div>
  );
};
