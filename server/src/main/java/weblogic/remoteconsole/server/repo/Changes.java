// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;

/**
 * This class holds the change manager's list of added / modified / deleted
 * beans (i.e. shopping cart contents) as well as the current status of
 * change manager.
 */
public class Changes {
  private ChangeManagerStatus changeManagerStatus;
  private List<AddedBean> additions = new ArrayList<>();
  private List<ModifiedBeanProperty> modifications = new ArrayList<>();
  private List<RemovedBean> removals = new ArrayList<>();

  public Changes(ChangeManagerStatus changeManagerStatus) {
    this.changeManagerStatus = changeManagerStatus;
  }

  // Returns the current status of the change manager.
  public ChangeManagerStatus getChangeManagerStatus() {
    return changeManagerStatus;
  }

  // Returns the list of added beans
  public List<AddedBean> getAdditions() {
    return this.additions;
  }

  // Returns the list of modified beans
  public List<ModifiedBeanProperty> getModifications() {
    return this.modifications;
  }

  // Returns the list of deleted beans
  public List<RemovedBean> getRemovals() {
    return this.removals;
  }
}
