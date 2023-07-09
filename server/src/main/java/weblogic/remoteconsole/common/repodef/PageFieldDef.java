// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.List;

/**
 * This interface describes a field on a form or table page.
 * 
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface PageFieldDef extends BeanFieldDef {

  // Info about how to present this property to the user.
  // (e.g. inline field help or whether to display a number as hex).
  // Returns null if there are no special presentation rules for this property.
  public PageFieldPresentationDef getPresentationDef();

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

  // Species whether this field def has a corresponding list of options.
  public boolean isSupportsOptions();

  // If this field supports options, returns resourceData templates
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
  // to display on the page for this field.
  public LocalizableString getLabel();

  // Whether this field is just for the page (true)
  // or whether it's stored in the bean repo too (false)
  public boolean isPageLevelField();
}
