// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This class holds the status of the change manager (i.e. the WebLogic configuration transaction)
 */
public class ChangeManagerStatus {
  private boolean locked;
  private String lockOwner;
  private boolean hasChanges;
  private boolean mergeNeeded;
  private boolean supportsChanges;

  public ChangeManagerStatus(
    boolean locked,
    String lockOwner,
    boolean hasChanges,
    boolean mergeNeeded,
    boolean supportsChanges
  ) {
    this.locked = locked;
    this.lockOwner = lockOwner;
    this.hasChanges = hasChanges;
    this.mergeNeeded = mergeNeeded;
    this.supportsChanges = supportsChanges;
  }

  // Whether we're in a configuration transaction
  public boolean isLocked() {
    return locked;
  }

  // If we're in a configuration transaction, the name
  // of the WebLogic user that owns the edit lock.
  // (null otherwise)
  public String getLockOwner() {
    return lockOwner;
  }

  // If we're in configuration transaction, have any
  // changes been made to the configuration (false otherwise)
  public boolean isHasChanges() {
    return hasChanges;
  }

  // Whether there are any activated configuration changes from 
  // other edit sessions that need to be merged to this edit
  // session (regardless of whether we're in a configuration transaction)
  public boolean isMergeNeeded() {
    return mergeNeeded;
  }

  // Does this ChangeManagerBeanRepo support returning the
  // list of configuration changes, i.e. whether the remote
  // console REST extension has been installed in the domain.
  // Doesn't depend on whether we're in a configuration transaction.
  public boolean isSupportsChanges() {
    return supportsChanges;
  }
}
