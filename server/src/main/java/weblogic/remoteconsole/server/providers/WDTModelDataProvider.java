// Copyright (c) 2020, 2025, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.util.List;
import java.util.Map;
import java.util.Properties;

import weblogic.remoteconsole.server.repo.InvocationContext;

/**
 * The Provider interface for WDT Models
*/
public interface WDTModelDataProvider extends FileBasedProvider {
  public Map<String, Object> getModel(InvocationContext ic);

  public boolean isJson();

  public List<PropertySource> getPropertySources(InvocationContext ic);

  public interface PropertySource {
    String getName();

    String getResourceData();

    Properties getProperties();
  }
}
