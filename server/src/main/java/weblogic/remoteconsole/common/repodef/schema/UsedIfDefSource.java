// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.remoteconsole.common.utils.Path;

/**
 * This POJO mirrors the yaml source file format for configuring information
 * about a feature (e.g. an action or property) is enabled.
 */
public class UsedIfDefSource {
  private StringValue property = new StringValue();
  private ScalarValues values = new ScalarValues();
  private BooleanValue hide = new BooleanValue();

  public UsedIfDefSource() {
  }

  UsedIfDefSource(UsedIfDefSource from, Path fromContainedBeanPath) {
    property.merge(from.property, fromContainedBeanPath);
    values.merge(from.values, fromContainedBeanPath);
    hide.merge(from.hide, fromContainedBeanPath);
  }

  // Since Property is relative to the bean that specified it:
  public Path getPropertyContainedBeanPath() {
    return property.getContainedBeanPath();
  }

  // The relative path name from the type containing the feature to the child property
  // that holds the value that will determine whether the feature is enabled.
  //
  // The property must be a long, integer, string or boolean.
  //
  // For example, if the ServerMBean's ListenPort property should only be enabled
  // if its ListenPortEnabled property is true, then 'property' should be
  // 'ListenPortEnabled'.  But if it depends on its child 'SSL' bean's 'Enabled'
  // property, then 'property' should be 'SSL.Enabled'.
  public String getProperty() {
    return property.getValue();
  }

  public void setProperty(String value) {
    property.setValue(value);
  }

  // If the current value of 'property' is one of these values,
  // then the feature should be enabled, otherwise it should be disabled.
  //
  // The type of the values must match the type of the property.
  public List<Object> getValues() {
    return values.getValue();
  }

  public void setValues(List<Object> value) {
    values.setValue(value);
  }

  public void addValue(Object value) {
    values.add(value);
  }

  // When the current value of 'property' isn't one of 'values',
  // this determines whether the feature should not be displayed
  // on the page (i.e. hide is true) or whether it should be
  // be displayed but disabled (i.e. hide is false).
  public boolean isHide() {
    return hide.getValue();
  }

  public void setHide(boolean value) {
    hide.setValue(value);
  }
}
