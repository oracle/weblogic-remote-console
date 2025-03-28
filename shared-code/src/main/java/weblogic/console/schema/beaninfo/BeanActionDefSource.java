// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.schema.beaninfo;

import java.util.List;

import weblogic.console.schema.BooleanValue;
import weblogic.console.schema.ListValue;
import weblogic.console.schema.StringValue;
import weblogic.console.schema.Value;

/**
 * This POJO mirrors the yaml source file format for configuring harvested
 * bean info information about an action on a type,
 * e.g. ServerLifeCycleRuntimeMBean.yaml.
 *
 * Note: the inherited value from BeanValueDefSource
 * is the return type of the action.
 */
public class BeanActionDefSource extends BeanValueDefSource {
  private StringValue name = new StringValue();
  private StringValue descriptionHTML = new StringValue();
  private StringValue remoteName = new StringValue();
  private ListValue<BeanActionParamDefSource> parameters = new ListValue<>();
  private BooleanValue extension =  new BooleanValue();
  private Value<RolesDefSource> roles = new Value<>(null);
  private Impact impact = Impact.unknown;

  // Mirrors the JMX Operaration Impact
  public enum Impact {
    info, // reads
    action, // writes
    action_info, // writes and reads
    unknown // don't know
  }

  // A unique name for this action within the type.
  // Typically the arg list is added to it to make it unique,
  // e.g. shutdown_timeout_ignoreSessions
  public String getName() {
    return name.getValue();
  }

  public void setName(String value) {
    name.setValue(value);
  }

  // The action's description
  public String getDescriptionHTML() {
    return descriptionHTML.getValue();
  }

  public void setDescriptionHTML(String val) {
    descriptionHTML.setValue(val);
  }

  // The name of the action when the CBE needs to invoke it
  // e.g. the WebLogic REST url for shutdown_timeout_ignoreSessions
  // is .../serverLifeCycleRuntimes/<servername>/shutdown
  // so the remote name is 'shutdown'.
  public String getRemoteName() {
    return remoteName.getValue();
  }

  public void setRemoteName(String value) {
    remoteName.setValue(value);
  }

  // The input parameters of this action
  public List<BeanActionParamDefSource> getParameters() {
    return parameters.getValue();
  }

  public void setParameters(List<BeanActionParamDefSource> value) {
    parameters.setValue(value);
  }

  public void addParameter(BeanActionParamDefSource value) {
    parameters.add(value);
  }

  // Whether this property was defined in extension.yaml,
  // i.e. did not come from a harvested bean info
  public boolean isExtension() {
    return extension.getValue();
  }

  public void setExtension(boolean val) {
    extension.setValue(val);
  }

  // The roles that are allowed to invoke this action
  public RolesDefSource getRoles() {
    return roles.getValue();
  }
  
  public void setRoles(RolesDefSource value) {
    roles.setValue(value);
  }

  // The action's impact
  // e.g. info means it only reads, action means it does something ("writes")
  public Impact getImpact() {
    return impact;
  }

  public void setImpact(Impact value) {
    impact = value;
  }

  @Override
  protected void validateExtension() {
    super.validateExtension();
    validateExtensionChild(getRoles(), "roles");
    validateExtensionChildren(getParameters(), "parameters");
  }
}
