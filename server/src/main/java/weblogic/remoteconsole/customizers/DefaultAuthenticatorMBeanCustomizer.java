// Copyright (c) 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;

import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Page;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.TableRow;

/** 
 * Custom code for processing the DefaultAuthenticatorMBean
 */
public class DefaultAuthenticatorMBeanCustomizer {

  private static final int MAX_USERS = 1000; // must be the same as DefaultAuthenticatorUtils MAX_USERS
  private static final int MAX_GROUPS = 1000; // must be the same as DefaultAuthenticatorUtils MAX_GROUPS

  public static Response<Void> customizeUsersTable(InvocationContext ic, Page page) {
    return customizeTable(ic, page, MAX_USERS, LocalizedConstants.TOO_MANY_USERS);
  }

  public static Response<Void> customizeGroupsTable(InvocationContext ic, Page page) {
    return customizeTable(ic, page, MAX_GROUPS, LocalizedConstants.TOO_MANY_GROUPS);
  }

  private static Response<Void> customizeTable(InvocationContext ic, Page page, int max, LocalizableString tooMany) {
    Response<Void> response = new Response<>();
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
    return response.setSuccess(null);
  }
}
