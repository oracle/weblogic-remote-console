// Copyright (c) 2025, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import weblogic.remoteconsole.server.repo.InvocationContext;

/**
 * The Provider interface for a property list
*/
public interface FileBasedProvider extends Provider {
  public void save(InvocationContext ic);
}
