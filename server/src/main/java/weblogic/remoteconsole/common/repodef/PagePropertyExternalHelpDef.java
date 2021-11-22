// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

/**
 * This interface describes a link to external help about a property on a page.
 *
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface PagePropertyExternalHelpDef {

  // Returns the correponding property
  public PagePropertyDef getPagePropertyDef();

  // Returns the link's title (e.g. "MBean Info")
  public LocalizableString getTitle();

  // Returns the link's label (e.g. "SSLMBean.ListenPort")
  public LocalizableString getLabel();

  // Returns a link to the external website that contains the help to display.
  public String getHref();
}
