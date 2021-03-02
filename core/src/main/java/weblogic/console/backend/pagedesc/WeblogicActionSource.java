// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.backend.typedesc.ConsoleWeblogicBeanUsedIf;
import weblogic.console.backend.utils.ListUtils;

/**
 * This POJO mirrors the yaml source file format for configuring information about an action on
 * a weblogic bean's table page, e.g. ServerLifeCycleRuntimeMBean/table.yaml
 */
public class WeblogicActionSource {

  private String name;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  private String label = "";

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  private ConsoleWeblogicBeanUsedIf usedIf;

  public ConsoleWeblogicBeanUsedIf getUsedIf() {
    return usedIf;
  }

  public void setUsedIf(ConsoleWeblogicBeanUsedIf usedIf) {
    this.usedIf = usedIf;
  }

  private boolean asynchronous = false;

  public boolean isAsynchronous() {
    return asynchronous;
  }

  public void setAsynchronous(boolean asynchronous) {
    this.asynchronous = asynchronous;
  }

  // Customizes the implementation of this action.  Optional.
  //
  // required signature:
  //
  //  public static JsonObject <method>(
  //
  //    // the connection to the weblogic domain:
  //    Connection connection,
  //
  //    // the identity of the bean to invoke the action on
  //    WeblogicBeanIdentity identity,
  //
  //    // the object that manages the weblogic runtime:
  //    WeblogicRuntime runtime,
  //
  //    // the name of the action, in PDY terms
  //    String action,
  //
  //    // the arguments for invoking the action (in weblogic REST terms)
  //    JsonObject arguments
  //  ) throws Exception
  //
  //  This method is fully responsible for invoking the action
  //  - ensuring that identity exists
  //  - ensuring that the arguments are valid
  //  - 
  //  - returning returning the data to return to the client (in weblogic REST terms)
  private String actionMethod; // <package>.<class>.<method>

  public String getActionMethod() {
    return this.actionMethod;
  }

  public void setActionMethod(String actionMethod) {
    this.actionMethod = actionMethod;
  }

  private List<WeblogicActionSource> actions = new ArrayList<>();

  public List<WeblogicActionSource> getActions() {
    return actions;
  }

  public void setActions(List<WeblogicActionSource> actions) {
    this.actions = ListUtils.nonNull(actions);
  }

  // TBD - a UI hint for selecting an icon?
}
