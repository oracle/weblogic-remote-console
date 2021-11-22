// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import weblogic.remoteconsole.common.utils.Path;

/**
 * This POJO mirrors the yaml source file format for customizing information
 * about a value on a feature of a type (i.e. a property value, an action parameter
 * value or an action return value).
 */
public class BeanValueDefCustomizerSource {
  private BooleanValue referenceAsReferences = new BooleanValue();
  private BooleanValue dateAsLong = new BooleanValue();

  protected void merge(BeanValueDefCustomizerSource from, Path fromContainedBeanPath) {
    referenceAsReferences.merge(from.referenceAsReferences, fromContainedBeanPath);
    dateAsLong.merge(from.dateAsLong, fromContainedBeanPath);
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
    referenceAsReferences.setValue(value);
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
    dateAsLong.setValue(value);
  }
}
