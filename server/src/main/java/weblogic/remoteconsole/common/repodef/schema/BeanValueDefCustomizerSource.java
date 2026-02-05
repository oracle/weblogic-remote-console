// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import weblogic.console.schema.BooleanValue;
import weblogic.console.schema.YamlSource;
import weblogic.console.utils.Path;

/**
 * This POJO mirrors the yaml source file format for customizing information
 * about a value on a feature of a type (i.e. a property value, an action parameter
 * value or an action return value).
 */
public class BeanValueDefCustomizerSource extends YamlSource {
  private BooleanValue referenceAsReferences = BooleanValue.create();
  private BooleanValue dateAsLong = BooleanValue.create();
  private BooleanValue ordered = BooleanValue.create();
  private BooleanValue multiLineString = BooleanValue.create();
  private BooleanValue dynamicEnum = BooleanValue.create();

  protected void merge(BeanValueDefCustomizerSource from, Path fromContainedBeanPath) {
    referenceAsReferences = referenceAsReferences.merge(from.referenceAsReferences, fromContainedBeanPath);
    dateAsLong = dateAsLong.merge(from.dateAsLong, fromContainedBeanPath);
    ordered = ordered.merge(from.ordered, fromContainedBeanPath);
    multiLineString = multiLineString.merge(from.multiLineString, fromContainedBeanPath);
    dynamicEnum = dynamicEnum.merge(from.dynamicEnum, fromContainedBeanPath);
  }

  // Indicates that even though the value is an array of references,
  // it is logically a single reference since it is only allowed
  // to hold zero or one reference.
  //
  // Several of the WebLogic JMS mbeans use this.
  public boolean isReferenceAsReferences() {
    return referenceAsReferences.getValue();
  }

  public void setReferenceAsReferences(boolean value) {
    referenceAsReferences = referenceAsReferences.setValue(value);
  }

  // Indicates that even though the value is a long,
  // it really holds a date.
  //
  // For example, the ServerRuntimeMBean's ActivationType
  // property is a long that holds a date.
  public boolean isDateAsLong() {
    return dateAsLong.getValue();
  }

  public void setDateAsLong(boolean value) {
    dateAsLong = dateAsLong.setValue(value);
  }

  // Whether an array's values' order must be maintained.
  // Must not be specified for non-array fields.
  public boolean isOrdered() {
    return ordered.getValue();
  }

  public void setOrdered(boolean value) {
    ordered = ordered.setValue(value);
  }

  // Indicates that this value is a multi-lined string
  // (i.e. can contain newline characters and should be
  // displayed in a text area instead of a text box).
  public boolean isMultiLineString() {
    return multiLineString.getValue();
  }

  public void setMultiLineString(boolean value) {
    multiLineString = multiLineString.setValue(value);
  }

  // Whether options are used to specify instance-based legal values
  public boolean isDynamicEnum() {
    return dynamicEnum.getValue();
  }

  public void setDynamicEnum(boolean val) {
    dynamicEnum = dynamicEnum.setValue(val);
  }
}
