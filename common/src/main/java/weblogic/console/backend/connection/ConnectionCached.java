// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.connection;

/**
 * The ConnectionCached interface is implemented by any class that will be cached per Console
 * Backend Connection.
 * <p>
 * A default method is defined for use when the connection is removed such that the cached object
 * can perform any required cleanup actions.
 * <p>
 * The Console Backend Connection implements the ConnectionLifecycleCache interface for setting
 * and retrieving the cached objects.
 */
public interface ConnectionCached {

  /**
   * The optional callback method used when the Connection has been removed by the Console Backend
   * Connection Manager.
   *
   * @param id The Connection ID that has been removed
   */
  public default void connectionRemoved(Connection connection) {
  }
}
