// Copyright (c) 2021, 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.schema.PageDefSource;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Option;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.webapp.BaseResource;

/**
 * Custom code for processing the JDBCSystemResourceMBean
 */
public class JDBCSystemResourceMBeanCustomizer {
  private static final String JDBC_SYSTEM_RESOURCES = "/Domain/JDBCSystemResources";
  private static final String IDENTITY = "identity";
  private static final String DATA_SOURCE_LIST = "JDBCResource.JDBCDataSourceParams.DataSourceList";
  private static final String GLOBAL_TXN_PROTOCOL = "JDBCResource.JDBCDataSourceParams.GlobalTransactionsProtocol";

  private JDBCSystemResourceMBeanCustomizer() {
  }

  // Customize the JDBCSystemResourceMBean's PDY
  public static void customizeCreateFormPageDefSource(
    PagePath pagePath,
    PageDefSource pageDefSource
  ) {
    (new JDBCSystemResourceMBeanCreateFormSourceCustomizer(pagePath, pageDefSource)).customize();
  }

  // Customize the JDBCSystemResourceMBean collection's JAXRS Resource
  public static BaseResource createResource(InvocationContext ic) {
    if (ic.getBeanTreePath().isCollection() && ic.getPageRepo().isPageEditorRepo()) {
      // The tree is editable and the request is for the collection.
      // Use our own resource so that we can overload create.
      return new JDBCSystemResourceMBeanCreatableCollectionResource();
    }
    // This request is either for a collection child or for a read-only collection.
    // Return null to signal that the standard resource class should be used.
    return null;
  }

  // Get the list of XA data sources that an XA MDS datasource can use.
  public static Response<List<Option>> getXADataSourceOptions(
    InvocationContext ic,
    @Source(
      collection = JDBC_SYSTEM_RESOURCES,
      properties = {IDENTITY, DATA_SOURCE_LIST, GLOBAL_TXN_PROTOCOL}
    ) List<Map<String,Value>> dataSources
  ) {
    return getDataSourceOptions(ic, dataSources, true);
  }

  // Get the list of non-XA data sources that a non-XA MDS datasource can use.
  public static Response<List<Option>> getNonXADataSourceOptions(
    InvocationContext ic,
    @Source(
      collection = JDBC_SYSTEM_RESOURCES,
      properties = {IDENTITY, DATA_SOURCE_LIST, GLOBAL_TXN_PROTOCOL}
    ) List<Map<String,Value>> dataSources
  ) {
    return getDataSourceOptions(ic, dataSources, false);
  }

  private static Response<List<Option>> getDataSourceOptions(
    InvocationContext ic,
    List<Map<String,Value>> dataSources,
    boolean wantXA
  ) {
    List<Option> options = new ArrayList<>();
    for (Map<String,Value> dataSource : dataSources) {
      boolean isOption = false;
      Value dsList = dataSource.get(DATA_SOURCE_LIST);
      if (dsList.isString() && StringUtils.notEmpty(dsList.asString().getValue())) {
        // This is a multi data source.  Don't add it to the list of options
        // since a multi data source cannot reference another multi data source.
      } else {
        // This is not a multi data source so don't weed it out yet.
        Value protocol = dataSource.get(GLOBAL_TXN_PROTOCOL);
        if (protocol.isString()) {
          boolean isXA = "TwoPhaseCommit".equals(protocol.asString().getValue());
          if (isXA == wantXA) {
            // This data source matches the desired XA setting.
            // Add it to the list of options.
            isOption = true;
          }
        } else {
          // Protocol isn't a string (i.e. probably a model token) so
          // we can't get its value to see whether it's XA.
          // Just add it as an option, i.e. it's better to let the
          // user pick one that isn't appropriate than to not let the
          // user pick one that is appropriate.
          isOption = true;
        }
      }
      if (isOption) {
        options.add(new Option(ic, dataSource.get(IDENTITY)));
      }
    }
    return (new Response<List<Option>>()).setSuccess(options);
  }
}
