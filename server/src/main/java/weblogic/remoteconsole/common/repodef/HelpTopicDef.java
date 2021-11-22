// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

/**
 * This interface describes a help topic on a form or table page.
 * Basically, it's a link to an external website that has information
 * relevant to the page (e.g. a link to some WebLogic Server documentation)
 *
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface HelpTopicDef {

  // Returns the corresponding page.
  public PageDef getPageDef();

  // Returns the topic's label
  public LocalizableString getLabel();

  // Returns a link to an external website that contains the help.
  public String getHref();
}
