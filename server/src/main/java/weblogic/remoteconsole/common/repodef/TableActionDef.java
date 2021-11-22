// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.List;

/**
 * This interface describes an action on a table page
 * (e.g. the action to start a server)
 *
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface TableActionDef extends BeanActionDef {

  // Returns the correponding page.
  public PageDef getPageDef();

  // Returns the action's label.
  public LocalizableString getLabel();

  // Returns when the action should be displayed.
  // Returns null if the action should always be displayed.
  public TableActionUsedIfDef getUsedIfDef();

  // Returns the name of this action, i.e. the name to put into the URLs for invoking actions
  // (e.g. domainRuntime/data/DomainRuntime/ServerLifeCycleRuntimes/MyServer?action=start)
  public String getActionMethod();

  // If this action is just a group of actions (e.g. the shutdown group has
  // graceful shutdown and force shutdown child actions), returns the child groups.
  // Returns an empty list of there are no child actions (i.e. if this is a leaf action).
  // Only leaf actions can be invoked
  public List<TableActionDef> getActionDefs();
}
