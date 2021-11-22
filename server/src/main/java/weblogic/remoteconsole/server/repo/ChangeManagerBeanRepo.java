// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This interface manages editing an online WebLogic edit session.
 */
public interface ChangeManagerBeanRepo extends BeanEditorRepo {

  // Ensure that an edit session has been started.
  // It's a no-op if an edit session has already been started (v.s. an error).
  public Response<Void> startEdit(InvocationContext ic);

  // Save the changes to the pending configuration directory.
  public Response<Void> saveChanges(InvocationContext ic);

  // Commit the changes (i.e. save them to the config directory
  // and have the running servers start using any dynamic changes.
  public Response<Void> commitChanges(InvocationContext ic);

  // Discard the changes (and the pending configuration directory).
  public Response<Void> discardChanges(InvocationContext ic);
}
