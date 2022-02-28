// Copyright (c) 2020, 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import java.util.List;
import java.util.Map;

import weblogic.remoteconsole.server.repo.InvocationContext;

/**
 * The Provider interface for WDT Models
*/
public interface WDTCompositeDataProvider extends Provider {
  public void checkModels(InvocationContext ic);

  public List<Map<String, Object>> getModels();
}
