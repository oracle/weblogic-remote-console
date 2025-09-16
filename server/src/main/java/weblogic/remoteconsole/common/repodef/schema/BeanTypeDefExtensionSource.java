// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.console.schema.ListValue;
import weblogic.console.schema.YamlSource;
import weblogic.console.schema.beaninfo.BeanActionDefSource;
import weblogic.console.schema.beaninfo.BeanPropertyDefSource;

/**
 * This POJO mirrors the yaml file format for adding exta properties and actions
 * to a type, e.g. JVMRuntimeMBean/extension.yaml
 */
public class BeanTypeDefExtensionSource extends YamlSource {
  private ListValue<BeanPropertyDefSource> properties = ListValue.create();
  private ListValue<BeanActionDefSource> actions = ListValue.create();

  // The list of extra properties to add to the type.
  public List<BeanPropertyDefSource> getProperties() {
    return properties.getValue();
  }

  public void setProperties(List<BeanPropertyDefSource> value) {
    properties = properties.setValue(value);
  }

  // The list of extra actions to add to the type.
  public List<BeanActionDefSource> getActions() {
    return actions.getValue();
  }

  public void setActions(List<BeanActionDefSource> value) {
    actions = actions.setValue(value);
  }

  @Override
  protected void validateExtension() {
    super.validateExtension();
    validateExtensionChildren(getProperties(), "properties");
    validateExtensionChildren(getActions(), "actions");
  }
}
