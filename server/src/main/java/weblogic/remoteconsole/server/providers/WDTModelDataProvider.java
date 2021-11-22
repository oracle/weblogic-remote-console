// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.io.InputStream;
import java.util.Map;

import weblogic.remoteconsole.server.repo.InvocationContext;

/**
 * The Provider interface for WDT Models
*/
public interface WDTModelDataProvider extends Provider {
  public void parseModel(InputStream is, boolean isJson, InvocationContext ic);

  public Map<String, Object> getModel();

  public boolean isJson();
}
