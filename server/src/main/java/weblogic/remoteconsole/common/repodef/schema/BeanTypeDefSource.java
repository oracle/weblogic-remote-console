// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

/**
 * This POJO mirrors the yaml file format for a type, e.g. ClusterMBean.yaml
 * 
 * It parallels the information available in a WebLogic bean info,
 * which is a superset of what's available from a normal java bean info.
 */
public class BeanTypeDefSource {
  private StringValue name = new StringValue();
  private StringValue descriptionHTML = new StringValue();
  private ListValue<String> baseTypes = new ListValue<>();
  private ListValue<String> derivedTypes = new ListValue<>();
  private ListValue<BeanPropertyDefSource> properties = new ListValue<>();
  private ListValue<BeanActionDefSource> actions = new ListValue<>();
  private Value<RolesDefSource> roles = new Value<>(null);

  // The full name of the type, e.g. weblogic.management.configuration.ServerMBean
  public String getName() {
    return name.getValue();
  }

  public void setName(String value) {
    name.setValue(value);
  }

  // The english description of this type
  public String getDescriptionHTML() {
    return descriptionHTML.getValue();
  }

  public void setDescriptionHTML(String value) {
    descriptionHTML.setValue(value);
  }

  // The names of all the types this type extends.
  public List<String> getBaseTypes() {
    return baseTypes.getValue();
  }

  public void setBaseTypes(List<String> value) {
    baseTypes.setValue(value);
  }

  public void addBaseType(String value) {
    baseTypes.add(value);
  }

  // The names of all the types that extend this type.
  public List<String> getDerivedTypes() {
    return derivedTypes.getValue();
  }

  public void setDerivedTypes(List<String> value) {
    derivedTypes.setValue(value);
  }

  public void addDerivedType(String value) {
    derivedTypes.add(value);
  }

  // The properties defined on this type (doesn't include inherited properties)
  public List<BeanPropertyDefSource> getProperties() {
    return properties.getValue();
  }

  public void setProperties(List<BeanPropertyDefSource> value) {
    properties.setValue(value);
  }

  public void addProperty(BeanPropertyDefSource value) {
    properties.add(value);
  }

  // The actions defined on this type (doesn't include inherited actions)
  public List<BeanActionDefSource> getActions() {
    return actions.getValue();
  }

  public void setActions(List<BeanActionDefSource> value) {
    actions.setValue(value);
  }

  public void addAction(BeanActionDefSource value) {
    actions.add(value);
  }

  // The roles that are allowed to access this type
  public RolesDefSource getRoles() {
    return roles.getValue();
  }

  public void setRoles(RolesDefSource value) {
    roles.setValue(value);
  }
}
