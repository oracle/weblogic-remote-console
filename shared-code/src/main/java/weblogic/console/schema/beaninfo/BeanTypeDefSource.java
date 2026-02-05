// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.schema.beaninfo;

import java.util.List;

import weblogic.console.schema.ListValue;
import weblogic.console.schema.StringValue;
import weblogic.console.schema.Value;
import weblogic.console.schema.YamlSource;

/**
 * This POJO mirrors the yaml file format for a type, e.g. ClusterMBean.yaml
 * 
 * It parallels the information available in a WebLogic bean info,
 * which is a superset of what's available from a normal java bean info.
 */
public class BeanTypeDefSource extends YamlSource {
  private StringValue name = StringValue.create();
  private StringValue descriptionHTML = StringValue.create();
  private ListValue<String> baseTypes = ListValue.create();
  private ListValue<String> derivedTypes = ListValue.create();
  private ListValue<BeanPropertyDefSource> properties = ListValue.create();
  private ListValue<BeanActionDefSource> actions = ListValue.create();
  private Value<RolesDefSource> roles = Value.create();

  // The full name of the type, e.g. weblogic.management.configuration.ServerMBean
  public String getName() {
    return name.getValue();
  }

  public void setName(String value) {
    name = name.setValue(value);
  }

  // The english description of this type
  public String getDescriptionHTML() {
    return descriptionHTML.getValue();
  }

  public void setDescriptionHTML(String value) {
    descriptionHTML = descriptionHTML.setValue(value);
  }

  // The names of all the types this type extends.
  public List<String> getBaseTypes() {
    return baseTypes.getValue();
  }

  public void setBaseTypes(List<String> value) {
    baseTypes = baseTypes.setValue(value);
  }

  public void addBaseType(String value) {
    baseTypes = baseTypes.add(value);
  }

  // The names of all the types that extend this type.
  public List<String> getDerivedTypes() {
    return derivedTypes.getValue();
  }

  public void setDerivedTypes(List<String> value) {
    derivedTypes = derivedTypes.setValue(value);
  }

  public void addDerivedType(String value) {
    derivedTypes = derivedTypes.add(value);
  }

  // The properties defined on this type (doesn't include inherited properties)
  public List<BeanPropertyDefSource> getProperties() {
    return properties.getValue();
  }

  public void setProperties(List<BeanPropertyDefSource> value) {
    properties = properties.setValue(value);
  }

  public void addProperty(BeanPropertyDefSource value) {
    properties = properties.add(value);
  }

  // The actions defined on this type (doesn't include inherited actions)
  public List<BeanActionDefSource> getActions() {
    return actions.getValue();
  }

  public void setActions(List<BeanActionDefSource> value) {
    actions = actions.setValue(value);
  }

  public void addAction(BeanActionDefSource value) {
    actions = actions.add(value);
  }

  // The roles that are allowed to access this type
  public RolesDefSource getRoles() {
    return roles.getValue();
  }

  public void setRoles(RolesDefSource value) {
    roles = roles.setValue(value);
  }

  @Override
  protected void validateExtension() {
    super.validateExtension();
    validateExtensionChildren(getProperties(), "properties");
    validateExtensionChildren(getActions(), "actions");
    validateExtensionChild(getRoles(), "roles");
  }
}
