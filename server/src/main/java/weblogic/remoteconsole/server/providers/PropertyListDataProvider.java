// Copyright (c) 2020, 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.io.InputStream;
import java.util.Properties;

import weblogic.remoteconsole.server.repo.InvocationContext;

/**
 * The Provider interface for a property list
*/
public interface PropertyListDataProvider extends Provider {
  public void parse(InputStream is, InvocationContext ic);

  public String getPageDescription();

  public String getResourceData();

  public Properties getProperties();
}
