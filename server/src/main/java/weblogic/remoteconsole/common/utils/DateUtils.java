// Copyright (c) 2023, 2025, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import weblogic.console.utils.StringUtils;

/**
 * General purpose date utilities needed by the console backend.
 */
public class DateUtils {

  private DateUtils() {
  }

  // Convert a Date to an user-visible string.
  public static String formatDate(Date date) {
    if (date == null) {
      return null;
    }
    return getFormat().format(date);
  }

  // Convert a user-visible string to a Date
  public static Date parseDate(String dateAsString) throws ParseException {
    if (StringUtils.isEmpty(dateAsString)) {
      return null;
    }
    return getFormat().parse(dateAsString);
  }

  // Convert a Date to a long that's rounded to the user-visible format
  // (helps with making >=, ... predictable)
  public static long getRoundedDateAsLong(Date date) {
    if (date == null) {
      return 0; // -1 ?
    }
    try {
      Date roundedDate = parseDate(formatDate(date));
      return roundedDate.getTime();
    } catch (ParseException e) {
      throw new AssertionError(date.toString(), e);
    }
  }

  private static SimpleDateFormat getFormat() {
    return new SimpleDateFormat("EEE MMM dd kk:mm:ss z yyyy");
  }
}
