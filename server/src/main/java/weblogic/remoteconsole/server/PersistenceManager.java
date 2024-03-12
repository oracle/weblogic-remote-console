// Copyright (c) 2022, 2023, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server;

import java.io.File;
import java.util.logging.Logger;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import weblogic.remoteconsole.server.repo.InvocationContext;

/**
 * This class manages the console backend's persisted data.
 *
 * It maintains an in-memory map from a 'key' that identifies a persistable
 * feature (e.g. TableCustomizations, RecentSearches, Dashboards) to
 * the persisted data for that feature.  This data is shared by all
 * providers that support that feature.  For example, the 'Dashboards'
 * are shared by all providers.
 *
 * Typically each provider has its own in-memory representation of the
 * data (e.g. the filtering rules and results for a custom filtering dashboard).
 * This cached data can become out of date when another provider
 * modifies the CBE-wide data for the feature.  To help with this,
 * the persistence manager timestamps the data so that providers
 * can tell when their cached data needs to be updated.
 * 
 * For example, if one provider creates, deletes or modifies a custom
 * filtering dashboard, then the other providers need to catch up if/when the user
 * tries to use the custom filtering dashboard in those providers.
 *
 * If the remote console supports persistence, then this class is initialized
 * with the name of the directory where the data should be stored
 * (e.g. WKTUI, electron WRC, testing pipelines).  This class will
 * read the data into memory (on-demand), and will write it back
 * out when a provider changes it.
 * 
 * Otherwise, it's initialized with a null directory name, and the data
 * only lives in memory (e.g. browser WRC)
 */
public class PersistenceManager<T> {

  private static final Logger LOGGER = Logger.getLogger(PersistenceManager.class.getName());

  private static PersistenceConfigurator persistenceConfigurator;
  private static ObjectMapper mapper;

  private Class<T> clazz;
  private String key;
  private State state;

  /**
   * Initializes the persistence manager.
   * 
   * If the remote console supports persistence, then
   * persistenceDirectoryPath is contains the name of
   * an existing directory where the persistence manager
   * should store its data.
   * 
   * If the remote console does not support persistence then
   * persistenceDirectoryPath is null and the PersistenceManager
   * only stores the data in-memory.
   */
  public static void initialize(PersistenceConfigurator configurator) {
    PersistenceManager.persistenceConfigurator = configurator;
    if (configurator == null) {
      LOGGER.finest("Persistence not supported.");
      return;
    }
    mapper = new ObjectMapper().enable(SerializationFeature.ORDER_MAP_ENTRIES_BY_KEYS);
  }

  /**
   * Construct a typed persistence manager for a feature.
   * It's responsible for persisting the data for that feature
   * for the entire CBE.
   */
  public PersistenceManager(Class<T> clazz, String key) {
    this.clazz = clazz;
    // FortifyIssueSuppression Key Management: Hardcoded Encryption Key
    // This is normal variable, not an encryption key.  It's fine.
    this.key = key;
  }

  /**
   * Get the state that's shared across the entire CBE for a feature,
   * e.g. the list of recent searches.
   * 
   * If there is no data for this feature, the returned state's data will be null.
   */
  public State get(InvocationContext ic) {
    LOGGER.finest("get " + key);
    if (!isCurrent(ic)) {
      state = new State(readPersistedData(ic));
    }
    return state;
  }

  private boolean isCurrent(InvocationContext ic) {
    if (state == null) {
      // we haven't tried to read in the file for this key yet
      return false;
    }
    if (!supportsPersistence(ic)) {
      // any data we already have in memory is current
      return true;
    }
    File file = getPersistenceFile(ic);
    if (file.exists()) {
      if (file.lastModified() > state.getTimeStamp()) {
        // the file is newer than what we have in memory
        return false;
      } else {
        // the file is older than what what we have in memory
        return true;
      }
    } else {
      if (state.getData() != null) {
        // we had data but now the file doesn't exist
        return false;
      } else {
        // we didn't have data and the file doesn't exist
        return true;
      }
    }
  }

  private T readPersistedData(InvocationContext ic) {
    if (!supportsPersistence(ic)) {
      return null;
    }
    File file = getPersistenceFile(ic);
    if (!file.exists()) {
      return null;
    }
    try {
      return mapper.readValue(file, clazz);
    } catch (Throwable t) {
      LOGGER.severe(
        "Problem reading"
        + " " + file.getAbsolutePath()
        + " : " + t.getMessage()
      );
      return null;
    }
  }

  /**
   * Used for reporting problems in the data in this feature's persistent file.
   */
  public void reportBadFormat(InvocationContext ic, String problem) {
    LOGGER.severe("Bad format " + getPersistenceFile(ic).getAbsolutePath() + " : " + problem);
  }

  /**
   * Set the state that's shared across the entire CBE for a feature,
   * e.g. the list of recent searches.
   * 
   * It also records a timestamp so that we can tell when the
   * state is out of date because the underlying persistence file
   * has been changed.
   * 
   * If the remote console supports persistence, then the new
   * state will be persisted.  If data is not null, then it
   * will be written to <key>.protected in the persistence directory.
   * If it is null, then <key>.json will be removed.
   */
  public void set(InvocationContext ic, T data) {
    LOGGER.finest("set " + key);
    state = new State(data);
    writePersistentData(ic, data);
  }

  private void writePersistentData(InvocationContext ic, T data) {
    if (!supportsPersistence(ic)) {
      return;
    }
    persistenceConfigurator.getDirectory(ic).mkdirs();
    File file = getPersistenceFile(ic);
    if (data == null) {
      if (file.exists()) {
        try {
          file.delete();
        } catch (Throwable t) {
          LOGGER.severe(
            "Problem deleting"
            + " " + file.getAbsolutePath()
            + " : " + t.getMessage()
          );
        }
      }
    } else {
      try {
        mapper.writerWithDefaultPrettyPrinter().writeValue(file, data);
      } catch (Throwable t) {
        LOGGER.severe(
          "Problem writing to"
          + " " + file.getAbsolutePath()
          + " : " + t.getMessage()
        );
      }
    }
  }

  private static boolean supportsPersistence(InvocationContext ic) {
    return (persistenceConfigurator != null)
      && (persistenceConfigurator.getDirectory(ic) != null);
  }

  public static boolean shouldIPersistProjects(InvocationContext ic) {
    return (persistenceConfigurator != null)
      && persistenceConfigurator.shouldIPersistProjects(ic);
  }

  private File getPersistenceFile(InvocationContext ic) {
    return new File(persistenceConfigurator.getDirectory(ic), key + ".json");
  }

  public static String getPersistenceFilePath(InvocationContext ic) {
    return supportsPersistence(ic) ? persistenceConfigurator.getDirectory(ic).getPath() : null;
  }

  /**
   * Used to return the persisted state for a feature.
   */
  public class State {
    private long timeStamp;
    private T data;

    private State(T data) {
      this.timeStamp = System.currentTimeMillis();
      this.data = data;
    }

    // The timestamp of the data being returned for this feature.
    public long getTimeStamp() {
      return timeStamp;
    }

    // The persistent data for this feature.  Null indicates that
    // there is no persisted data for this feature.
    public T getData() {
      return data;
    }

    @Override
    public String toString() {
      return "State<timeStamp=" + timeStamp + ", data=" + data + ">";
    }
  }

  public static interface PersistenceConfigurator {
    // This may return null if persistence is supported in this instance in
    // general, but not for this InvocationContext.  This occurs, for example,
    // in the case of the Hosted version when persistence is only supported for
    // logged-in users
    public File getDirectory(InvocationContext ic);

    public boolean shouldIPersistProjects(InvocationContext ic);
  }
}
