// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.List;

/**
 * This interface describes a property on a form or table page.
 * 
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface PagePropertyDef extends BeanPropertyDef {

  // Get the corresponding page def
  public PageDef getPageDef();

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

  // Get the legal value defs for this property.
  public List<LegalValueDef> getLegalValueDefs();

  // Species whether this property def has a corresponding list of options.
  public boolean isSupportsOptions();

  // If this property supports options, returns resourceData templates
  // for computing the options' bean tree paths.
  // For example:
  //   Domain/Servers
  //   Domain/Clusters
  //   Domain/JMSSystemResources/<JMSSystemResource>/JMSResource/Quotas
  // Otherwise returns null.
  public List<String> getOptionsSources();

  // Whether to add None to the list of available options.
  public boolean isAllowNoneOption();

  // The label (form property name or table column name)
  // to display on the page for this property.
  public LocalizableString getLabel();

  // When this property should displayed to the user.
  // If null, then it should always be displayed.
  public PagePropertyUsedIfDef getUsedIfDef();

  // Info about how to present this property to the user.
  // (e.g. inline field help or whether to display a number as hex).
  // Returns null if there are no special presentation rules for this property.
  public PagePropertyPresentationDef getPresentationDef();

  // Info about linking to external documentation about this property
  // (e.g. links to mbean javadoc about this property).
  // Returns null if there is no external documentation available.
  public PagePropertyExternalHelpDef getExternalHelpDef();

  // Whether this property is just for the page (true)
  // or whether it's stored in the bean repo too (false)
  public boolean isPageLevelProperty();

  // Whether to return this property if it's in a hidden column on the page.
  // Normally, all of the columns are fetched (since it isn't expensive)
  // so that the CFE doesn't need to do another round trip when the user
  // changes which columns are displayed.
  // However, some properties, like the ServerLifeCycleRuntimeMBean's State
  // property, are very expensive to compute, and slow the table down.
  // So, it's better to not fetch them until the user wants to see them.
  public boolean isDontReturnIfHiddenColumn();
}
