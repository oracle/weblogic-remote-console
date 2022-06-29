// Copyright (c) 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server;

import java.util.logging.Logger;

/**
 * This abstract class helps manage the shared persistent data of a feature
 * across the providers that support the feature.
 */
public abstract class PersistableFeature<T> {

  private static final Logger LOGGER = Logger.getLogger(PersistableFeature.class.getName());

  private PersistenceManager<T>.State state = null;

  protected void refresh() {
    LOGGER.finest("refresh");
    PersistenceManager<T>.State newState = getPersistenceManager().get();
    if (state == null || state.getTimeStamp() != newState.getTimeStamp()) {
      LOGGER.finest("reloading");
      state = newState;
      try {
        fromPersistedData(state.getData());
      } catch (BadFormatException e) {
        getPersistenceManager().reportBadFormat(e.getMessage());
      }
    }
  }

  protected void update() {
    LOGGER.finest("update");
    getPersistenceManager().set(toPersistedData());
  }

  // Return the persistence manager for this feature for the entire CBE.
  protected abstract PersistenceManager<T> getPersistenceManager();

  // Update whatever this feature stores in memory to match what
  // has been persisted for the entire CBE for this feature.
  protected abstract void fromPersistedData(T data);

  // Convert whatever this feature stores in memory to the POJO
  // that should be persisted for the entire CBE for this feature.
  protected abstract T toPersistedData();

  public static class BadFormatException extends RuntimeException {
    public BadFormatException(String message) {
      super(message);
    }
  }
}
