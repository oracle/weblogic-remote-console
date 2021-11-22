// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

/**
 * This POJO mirrors the yaml file format for adding exta properties and actions
 * to a type, e.g. JVMRuntimeMBean/extension.yaml
 */
public class BeanTypeDefExtensionSource {
  private ListValue<BeanPropertyDefSource> properties = new ListValue<>();
  private ListValue<BeanActionDefSource> actions = new ListValue<>();

  // The list of extra properties to add to the type.
  public List<BeanPropertyDefSource> getProperties() {
    return properties.getValue();
  }

  public void setProperties(List<BeanPropertyDefSource> value) {
    properties.setValue(value);
  }

  // The list of extra actions to add to the type.
  public List<BeanActionDefSource> getActions() {
    return actions.getValue();
  }

  public void setActions(List<BeanActionDefSource> value) {
    actions.setValue(value);
  }
}
