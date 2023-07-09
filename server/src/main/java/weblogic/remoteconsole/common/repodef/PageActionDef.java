// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.List;

/**
 * This interface describes an action on a page (e.g. the action to start a server)
 *
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface PageActionDef extends BeanActionDef {

  // Returns the correponding page.
  public PageDef getPageDef();

  // Returns the action's label.
  public LocalizableString getLabel();

  // Returns the action's label on the help page.
  public LocalizableString getHelpLabel();

  // The name of the custom static method that invokes this action.
  // If null, then the standard mechanisms are used.
  public String getActionMethod();

  // Get the help summary.
  // The UI should either display the summary or the details.
  // It should not display both since typically the detailed help
  // is the summary plus some extra info.
  public LocalizableString getHelpSummaryHTML();

  // Get the help details.
  // The UI should either display the summary or the details.
  // It should not display both since typically the detailed help
  // is the summary plus some extra info.
  public LocalizableString getDetailedHelpHTML();

  // Info about linking to external documentation about this action
  // (e.g. links to mbean javadoc about this action).
  // Returns null if there is no external documentation available.
  public PageActionExternalHelpDef getExternalHelpDef();

  // Whether this action is just for the page (true)
  // or whether it's supported by the bean repo too (false)
  public boolean isPageLevelAction();

  // If this action is just a group of actions (e.g. the shutdown group has
  // graceful shutdown and force shutdown child actions), returns the child groups.
  // Returns an empty list of there are no child actions (i.e. if this is a leaf action).
  // Only leaf actions can be invoked
  public List<PageActionDef> getActionDefs();

  // How many rows this action needs:
  // none     - the action takes no rows (i.e. applies to the entire table)
  // one      - the action takes exactly one row
  // multiple - the action takes one or more rows
  // Only used by actions on tables and slice tables
  public String getRows();

  // Only leaf actions are invokable.
  // The others are just for grouping in the UI.
  public default boolean isInvokable() {
    return getActionDefs().isEmpty();
  }

  // The input form for gathering the args needed to invoke this action.
  // Returns null if no args are needed.
  ActionInputFormDef getInputFormDef();

  // Whether, and how, the CFE should auto reload the table
  // after invoking this action.  Returns null if the CFE should
  // not turn on auto reload.
  public PageActionPollingDef getPollingDef();

}
