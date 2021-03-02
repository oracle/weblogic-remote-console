// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

/** Interface managing a registered weblogic configuration event listener */
public interface WeblogicConfigurationEventListenerRegistration {
  public void unregister() throws Exception;
}
