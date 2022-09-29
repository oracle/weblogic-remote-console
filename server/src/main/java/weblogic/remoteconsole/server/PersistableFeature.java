// Copyright (c) 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server;

import java.util.logging.Logger;

import weblogic.remoteconsole.server.repo.InvocationContext;

/**
 * This abstract class helps manage the shared persistent data of a feature
 * across the providers that support the feature.
 */
public abstract class PersistableFeature<T> {

  private static final Logger LOGGER = Logger.getLogger(PersistableFeature.class.getName());

  private PersistenceManager<T>.State state = null;

  protected void refresh(InvocationContext ic) {
    LOGGER.finest("refresh");
    PersistenceManager<T>.State newState = getPersistenceManager().get();
    if (newState != state) {
      LOGGER.finest("reloading");
      state = newState;
      try {
        fromPersistedData(ic, state.getData());
      } catch (BadFormatException e) {
        getPersistenceManager().reportBadFormat(e.getMessage());
      }
    }
  }

  protected void update(InvocationContext ic) {
    LOGGER.finest("update");
    getPersistenceManager().set(toPersistedData(ic));
  }

  // Return the persistence manager for this feature for the entire CBE.
  protected abstract PersistenceManager<T> getPersistenceManager();

  // Update whatever this feature stores in memory to match what
  // has been persisted for the entire CBE for this feature.
  protected abstract void fromPersistedData(InvocationContext ic, T data);

  // Convert whatever this feature stores in memory to the POJO
  // that should be persisted for the entire CBE for this feature.
  protected abstract T toPersistedData(InvocationContext ic);

  public static class BadFormatException extends RuntimeException {
    public BadFormatException(String message) {
      super(message);
    }
  }
}
