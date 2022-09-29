// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

/**
 * This interface describes a link underneath a type.
 *
 * It contains all of the information about the link that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface LinkDef {

  public LinksDef getLinkDefs();

  // The name of the root that for this link.
  // Matches the *_ROOT constants in weblogic.remoteconsole.server.providers.Root
  public String getRoot();

  // Returns the template for creating resourceData links
  // given this link def and a bean tree path.
  // For example, if
  //   resourceData = DomaiRuntime/ServerLifeCycleRuntimes/<Server>
  // and
  //   bean tree path = Domain/Servers/AdminServer
  // then the tree-relative path is
  //   Domain/ServerLifeCycleRuntimes/AdminServer
  //
  // resourceData always starts from the root of the bean tree
  public String getResourceData();

  // Get the text to display if the corresponding bean from
  // resolving this template with a bean tree path doesn't exist.
  // For example, if
  // 1) resourceData is DomainRuntime/ServerLifeCycleRuntimes/<Server>
  // 2) bean tree path is Domain/Servers/AdminServer
  // 3) AdminServer isn't currently running
  // then DomainRuntime/ServerLifeCycleRuntimes/AdminServer doesn't exist
  // and we want to display a message to the user saying that
  // there's no monitoring info available for AdminServer because it
  // isn't currrently running.
  public LocalizableString getNotFoundMessage();

  // Get the label to display for this link on the page
  public LocalizableString getLabel();
}
