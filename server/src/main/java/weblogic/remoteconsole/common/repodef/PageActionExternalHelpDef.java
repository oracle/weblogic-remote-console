// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

/**
 * This interface describes a link to external help about an action on a page.
 *
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface PageActionExternalHelpDef {

  // Returns the correponding action
  public PageActionDef getPageActionDef();

  // Returns the link's title (e.g. "MBean Info")
  public LocalizableString getTitle();

  // Returns the link's label (e.g. "ServerRunimeMBean.forceShutdown")
  public LocalizableString getLabel();

  // Returns the link's intro's label (e.g. "MBean Operation:")
  public LocalizableString getIntroLabel();

  // Returns a link to the external website that contains the help to display.
  public String getHref();
}
