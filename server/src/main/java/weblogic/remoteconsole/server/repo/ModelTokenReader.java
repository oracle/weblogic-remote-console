// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * The ModelTokenReader interface declares that the Repo supports
 * WDT model token information used with a form and the property values.
 */
public interface ModelTokenReader {
  /**
   * Obtain the ModelTokens data using the InvocationContext.
   * A NULL value is returned when no data is available.
   */
  public ModelTokens getModelTokens(InvocationContext ic);
}
