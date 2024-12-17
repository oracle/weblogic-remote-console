// Copyright (c) 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;

import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Page;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.TableRow;

/** 
 * Custom code for processing the user and group mbeans
 */
public class UserGroupMBeanCustomizer {

  private static final int MAX_USERS = 1000; // must be the same as UserGroupUtils MAX_USERS
  private static final int MAX_GROUPS = 1000; // must be the same as UserGroupUtils MAX_GROUPS

  public static void customizeUsersTable(InvocationContext ic, Page page) {
    customizeTable(ic, page, MAX_USERS, LocalizedConstants.TOO_MANY_USERS);
  }

  public static void customizeGroupsTable(InvocationContext ic, Page page) {
    customizeTable(ic, page, MAX_GROUPS, LocalizedConstants.TOO_MANY_GROUPS);
  }

  private static void customizeTable(InvocationContext ic, Page page, int max, LocalizableString tooMany) {
    // The extension will return one more than the maximum so that we can tell
    // the difference between having the maximum and having too many.
    // Trim back to the maximum so that we have a nice round number.
    List<TableRow> rows = page.asTable().getRows();
    if (rows.size() > max) {
      while (rows.size() > max) {
        rows.remove(max);
      }
      page.setLocalizedIntroductionHTML(
        ic.getLocalizer().localizeString(tooMany, rows.size())
        + ic.getLocalizer().localizeString(page.getPageDef().getIntroductionHTML())
      );
    }
  }

  public static SettableValue getStatus(
    InvocationContext ic,
    @Source(property = "Status") SettableValue statusValue
  ) {
    String status = statusValue.getValue().asString().getValue();
    if ("OK".equals(status)) {
      status = ic.getLocalizer().localizeString(LocalizedConstants.USER_GROUP_READER_STATUS_OK);
    }
    return new SettableValue(new StringValue(status), false);
  }
}
