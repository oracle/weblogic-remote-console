// Copyright (c) 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import java.util.List;
import java.util.Map;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.Value;

/**
 * Customizes updating a JDBCSystemResourceMBean
 */
public class JDBCSystemResourceMBeanUpdateHelper extends UpdateHelper {

  private static final String PROP_DRIVER_NAME
    = "JDBCResource.JDBCDriverParams.DriverName";
  private static final String PROP_GLOBAL_TRANSACTIONS_PROTOCOL
    = "JDBCResource.JDBCDataSourceParams.GlobalTransactionsProtocol";

  public JDBCSystemResourceMBeanUpdateHelper() {
    super();
  }

  @Override
  protected Response<Void> updateUnderlyingBeans(InvocationContext ic, List<FormProperty> properties) {
    Response<Void> response = super.updateUnderlyingBeans(ic, properties);
    if (response.isSuccess()) {
      validateTransactionConfiguration(ic, response);
    }
    return response;
  }

  private void validateTransactionConfiguration(InvocationContext ic, Response<Void> updateResponse) {
    Response<Map<String,Value>> getResponse =
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().getBeanProperties(
        ic,
        List.of(PROP_DRIVER_NAME, PROP_GLOBAL_TRANSACTIONS_PROTOCOL),
        false
      );
    if (!getResponse.isSuccess()) {
      // we had a problem getting the info needed for validation.
      // we've already made the changes.
      // just skip the validation since all the validation does is warn, not block.
    } else {
      Map<String,Value> propToValue = getResponse.getResults();
      String driverName = propToValue.get(PROP_DRIVER_NAME).asString().getValue();
      Boolean isXA = JDBCSystemResourceMBeanCustomizerUtils.isXADriver(driverName);
      if (isXA == null) {
        // we don't know whether the driver supports global transactions.
        // don't do any validation.
      } else {
        String protocol = propToValue.get(PROP_GLOBAL_TRANSACTIONS_PROTOCOL).asString().getValue();
        boolean isTwoPhaseCommit = "TwoPhaseCommit".equals(protocol);
        // Temporarily report these as info messages so that the CFE won't treat them as
        // errors and think that the page is still dirty:
        if (isXA && !isTwoPhaseCommit) {
          updateResponse.addSuccessMessage(
            ic.getLocalizer().localizeString(
              LocalizedConstants.JDBC_XA_DRIVER_INCOMPATIBLE_GLOBAL_TRANSACTIONS_PROTOCOL
            )
          );
        } else if (!isXA && isTwoPhaseCommit) {
          updateResponse.addSuccessMessage(
            ic.getLocalizer().localizeString(
              LocalizedConstants.JDBC_NON_XA_DRIVER_INCOMPATIBLE_GLOBAL_TRANSACTIONS_PROTOCOL
            )
          );
        }
      }
    }
  }
}
