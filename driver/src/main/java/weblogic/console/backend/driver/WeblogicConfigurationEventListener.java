// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

/**
 * Interface for receiving notifications about the Weblogic configuration.
 * <p>
 * Note: the methods should return promptly and must handle any exceptions
 * (e.g. log them then return)
 */
public interface WeblogicConfigurationEventListener {
  public void configurationChanged(String weblogicConfigurationVersion);

  public void changesCancelled(String weblogicConfigurationVersion);
}
