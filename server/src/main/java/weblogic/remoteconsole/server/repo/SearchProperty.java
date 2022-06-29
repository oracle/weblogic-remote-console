// Copyright (c) 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * Specifies extra properties to return in the search results if present in a bean
 * that passes the filters for a general search.
 */
public class SearchProperty {

  // Selects a property by its exact name, including scope
  // e.g. for a ServerMBean: ListenPort, SSL.ListenPort
  private String propertyName;

  // Selects properties on the bean's pages whose localized label contains a string (any case)
  // e.g. for a ServerMBean and english: 'listen port' would find 'ListenP ort' and "SSL Listen Port"
  private String propertyLabelContains;

  public String getPropertyName() {
    return propertyName;
  }

  public void setPropertyName(String val) {
    propertyName = val;
  }

  public String getPropertyLabelContains() {
    return propertyLabelContains;
  }

  public void setPropertyLabelContains(String val) {
    propertyLabelContains = val;
  }
}
