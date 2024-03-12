// Copyright (c) 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

/**
 * Custom JAXRS resource for the BuiltinFilteringDashboardMBean collection children
 */
public class BuiltinFilteringDashboardMBeanCollectionChildResource
  extends FilteringDashboardMBeanCollectionChildResource {

  @Override
  protected String getTypeName() {
    return "BuiltinFilteringDashboardMBean";
  }
}
