// Copyright (c) 2024, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.console.schema.ListValue;
import weblogic.console.schema.YamlSource;

/**
 * This POJO mirrors the yaml source file format for extending type.yaml
 */
public class BeanTypeDefCustomizerExtensionSource extends YamlSource {
  private ListValue<BeanPropertyDefCustomizerSource> properties = new ListValue<>();
  private ListValue<BeanChildDefCustomizerSource> children = new ListValue<>();
  private ListValue<SubTypeDefSource> subTypes = new ListValue<>();

  // The list of properties on this type that have been customized.
  public List<BeanPropertyDefCustomizerSource> getProperties() {
    return properties.getValue();
  }

  public void setProperties(List<BeanPropertyDefCustomizerSource> value) {
    properties.setValue(value);
  }

  public void addProperty(BeanPropertyDefCustomizerSource value) {
    properties.add(value);
  }

  // The list of children (i.e. collections and singletons) on this
  // type that have been customized.
  public List<BeanChildDefCustomizerSource> getChildren() {
    return children.getValue();
  }

  public void setChildren(List<BeanChildDefCustomizerSource> value) {
    children.setValue(value);
  }

  public void addChild(BeanChildDefCustomizerSource value) {
    children.add(value);
  }

  // The list of instantiable derived (sub) types of this type.
  // If not empty, then this type is heterogeneous.

  public List<SubTypeDefSource> getSubTypes() {
    return subTypes.getValue();
  }

  public void setSubTypes(List<SubTypeDefSource> value) {
    subTypes.setValue(value);
  }

  public void addSubTypes(SubTypeDefSource value) {
    subTypes.add(value);
  }

  @Override
  protected void validateExtension() {
    super.validateExtension();
    validateExtensionChildren(getChildren(), "children");
    validateExtensionChildren(getProperties(), "properties");
    validateExtensionChildren(getSubTypes(), "subTypes");
  }
}