// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.Date;

/**
 * This class holds a Date value.
 */
public class DateValue extends Value {

  private Date value;

  public DateValue(Date value) {
    this.value = value;
  }

  public Date getValue() {
    return this.value;
  }

  @Override
  public String toString() {
    return "DateValue<" + getValue() + ">";
  }
}
