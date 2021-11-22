// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This interface manages editing a bean tree.
 *
 * It supports reading the bean tree as well as creating, updating
 * and deleting beans.
 * 
 * Derived interfaces add methods for managing transactions
 * since different page repos can have different transaction models.
 */
public interface BeanEditorRepo extends BeanReaderRepo {

  // Update some properties on a bean in the bean repo.
  public Response<Void> updateBean(InvocationContext ic, BeanPropertyValues propertyValues);

  // Create a new bean in the bean repo
  public Response<Void> createBean(InvocationContext ic, BeanPropertyValues propertyValues);

  // Delete a bean from the bean repo
  public Response<Void> deleteBean(InvocationContext ic, BeanTreePath beanTreePath);
}
