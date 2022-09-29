// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

/**
 * This POJO mirrors the yaml source file format for configuring information
 * about a link
 */
public class LinkDefSource {
  private StringValue label = new StringValue();
  private StringValue root = new StringValue();
  private StringValue resourceData = new StringValue();
  private StringValue notFoundMessage = new StringValue();
  private ListValue<String> requiredCapabilities = new ListValue<>();

  // The name of the root that for this link.
  // Matches the *_ROOT constants in weblogic.remoteconsole.server.providers.Root
  public String getRoot() {
    return root.getValue();
  }

  public void setRoot(String value) {
    root.setValue(value);
  }

  // The template for creating resourceData links
  // given this link def and a bean tree path.
  // For example, if
  //   resourceData = DomaiRuntime/ServerLifeCycleRuntimes/<Server>
  // and
  //   bean tree path = Domain/Servers/AdminServer
  // then the tree-relative path is
  //   Domain/ServerLifeCycleRuntimes/AdminServer
  //
  // resourceData always starts from the root of the bean tree
  public String getResourceData() {
    return resourceData.getValue();
  }
  
  public void setResourceData(String value) {
    resourceData.setValue(value);
  }

  // The text to display if the corresponding bean from
  // resolving this template with a bean tree path doesn't exist.
  // For example, if
  // 1) resourceData is DomainRuntime/ServerLifeCycleRuntimes/<Server>
  // 2) bean tree path is Domain/Servers/AdminServer
  // 3) AdminServer isn't currently running
  // then DomainRuntime/ServerLifeCycleRuntimes/AdminServer doesn't exist
  // and we want to display a message to the user saying that
  // there's no monitoring info available for AdminServer because it
  // isn't currrently running.
  public String getNotFoundMessage() {
    return notFoundMessage.getValue();
  }

  public void setNotFoundMessage(String value) {
    notFoundMessage.setValue(value);
  }

  // The english label to display for this link on the page
  public String getLabel() {
    return label.getValue();
  }

  public void setLabel(String value) {
    label.setValue(value);
  }

  // The bean repo capabilities that are required for this link to be present
  public List<String> getRequiredCapabilities() {
    return requiredCapabilities.getValue();
  }
  
  public void setRequiredCapabilities(List<String> val) {
    requiredCapabilities.setValue(val);
  }
}
