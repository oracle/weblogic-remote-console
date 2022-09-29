// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.Date;

/**
 * Some of the WebLogic beans have long properties that really hold dates.
 * This class is used to represent their values.
 * It holds an epoch time where the value can be returned as a long, LongValue or DateValue.
 */
public class DateAsLongValue extends Value {

  private long value = 0;

  public DateAsLongValue(long value) {
    this.value = value;
  }

  public DateAsLongValue(Date date) {
    if (date != null) {
      this.value = date.getTime();
    }
  }

  public DateAsLongValue(LongValue longValue) {
    this((longValue != null) ? longValue.getValue() : 0L);
  }

  public DateAsLongValue(DateValue dateValue) {
    this((dateValue != null) ? dateValue.getValue() : null);
  }

  public long getValue() {
    return this.value;
  }

  public LongValue asLong() {
    return new LongValue(value);
  }

  public DateValue asDate() {
    Date date = (value > 0) ? new Date(value) : null;
    return new DateValue(date);
  }

  @Override
  public String toString() {
    return "DateAsLongValue<" + getValue() + ">";
  }
}
