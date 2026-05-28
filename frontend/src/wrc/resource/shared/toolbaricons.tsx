/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import { useEffect, useRef, useState } from "preact/hooks";
import { CButtonElement } from "oj-c/button";

import "oj-c/button";
import SyncIntervalDialog from "./syncintervaldialog";
import NavigationToolbar from "./navigationtoolbar";

type Props = Readonly<{
  showHelp: boolean;
  onHelpClick: () => void;
  syncEnabled: boolean;
  onSyncClick: () => void;
  actionPolling?: boolean;
  pageContext?: string;
}>;

/**
 * ToolbarIcons handles the buttons on the right side of the toolbar
 */
const ToolbarIcons = ({
    showHelp,
    onHelpClick,
    syncEnabled,
    onSyncClick,
    actionPolling = false,
    pageContext
  }: Props) => {
  const [syncInterval, setSyncInterval] = useState(0);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const timerId = useRef<number | null>(null);

  useEffect(() => {
    if (!syncEnabled || actionPolling) setAutoSyncEnabled(false);
    else if (isSyncTimerEnabled()) startSyncTimer();
    return () => cancelSyncTimer();
  }, [syncInterval, autoSyncEnabled, syncEnabled, actionPolling]);

  // Timer should only run IFF sync is enabled and auto sync enabled
  const isSyncTimerEnabled = () => (autoSyncEnabled && syncEnabled);

  // Timer indicater shows for auto sync or action polling
  const isTimerIndicatorEnabled = () => (isSyncTimerEnabled() || actionPolling);

  // Sync interval enabled when sync enabled unless action polling
  const isSyncIntervalEnabled = () => (syncEnabled && !actionPolling);

  const syncTooltip = isTimerIndicatorEnabled()
    ? t["wrc-form-toolbar"].icons.sync.tooltipOn
    : t["wrc-form-toolbar"].icons.sync.tooltip;
  const helpTooltip = t["wrc-form-toolbar"].icons.help.tooltip;

  // Start the auto sync timer using syncInterval in seconds
  const startSyncTimer = () => {
    cancelSyncTimer();
    if (syncInterval > 0) {
      // Handle the sync action and set the timer...
      onSyncClick();
      timerId.current = window.setInterval(onSyncClick, syncInterval * 1000);
    }
  };

  // Cancel the auto sync timer IFF running
  const cancelSyncTimer = () => {
    if (timerId.current) {
      window.clearInterval(timerId.current);
      timerId.current = null;
    }
  };

  // Set the auto sync timer from the SyncIntervalDialog
  const onSyncIntervalSet = (newSyncInterval: number) => {
    setSyncInterval(newSyncInterval);
    setAutoSyncEnabled(newSyncInterval > 0);
  };

  // Handle the sync button press
  const handleSyncAction = (event: CButtonElement.ojAction) => {
    if (event?.preventDefault) event.preventDefault();
    // Toggle auto sync IFF sync interval and not action polling
    if ((syncInterval > 0) && !actionPolling) {
      setAutoSyncEnabled(!autoSyncEnabled);
      return;
    }
    // Otherwise handle the sync action...
    onSyncClick();
  };

  // The bounce icon style is applied to the sync icon when auto sync is enabled
  return (
    <div class="oj-flex oj-sm-flex-items-initial oj-sm-justify-content-flex-end">
      <div id="navigation-toolbar-icon" class="oj-flex-item">
        <NavigationToolbar pageContext={pageContext} />
      </div>
      <div id="toolbar-separator-vertical" class="oj-flex-item">
        <span role="separator" aria-orientation="vertical" class="oj-toolbar-separator wrc-vertical-bar"></span>
      </div>
      <div id="page-help-toolbar-icon" class="oj-flex-item">
        <oj-c-button
          chroming="borderless"
          onojAction={onHelpClick}
          tooltip={helpTooltip}
          aria-label={helpTooltip}
          data-testid="help"
        >
          <span slot="startIcon" class={`${showHelp ? 'oj-ux-ico-help-circle-s' : 'oj-ux-ico-help'}`}></span>
        </oj-c-button>
      </div>
      <div id="toolbar-separator-vertical" class="oj-flex-item">
        <span role="separator" aria-orientation="vertical" class="oj-toolbar-separator wrc-vertical-bar"></span>
      </div>
      <div id="sync-toolbar-icon" class={`oj-flex-item ${isTimerIndicatorEnabled() ? 'wrc-sync-bounce' : ''}`}>
        <oj-c-button
          chroming="borderless"
          onojAction={handleSyncAction}
          disabled={!syncEnabled}
          tooltip={syncTooltip}
          aria-label={syncTooltip}
          data-testid="sync"
        >
          <span slot="startIcon" class="oj-ux-ico-refresh"></span>
        </oj-c-button>
      </div>
      <SyncIntervalDialog syncEnabled={isSyncIntervalEnabled()} onSyncIntervalSet={onSyncIntervalSet}/>
    </div>
  );
};

export default ToolbarIcons;
