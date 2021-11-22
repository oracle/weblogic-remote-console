// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import weblogic.remoteconsole.common.repodef.BeanRepoDef;

/**
 * This interface manages a bean tree.
 */
public interface BeanRepo {

  // Get the corresponding repo def that describes the types, properties and actions
  // in this repo.
  public BeanRepoDef getBeanRepoDef();

  // Specifies whether this repo is a bean reader repo.
  public default boolean isBeanReaderRepo() {
    return this instanceof BeanReaderRepo;
  }

  // Converts this repo to a bean reader repo.
  // Throws a ClassCastException if this repo is not a .
  public default BeanReaderRepo asBeanReaderRepo() {
    return (BeanReaderRepo)this;
  }

  // Specifies whether this repo is a bean editor repo.
  public default boolean isBeanEditorRepo() {
    return this instanceof BeanReaderRepo;
  }

  // Converts this repo to a bean editor repo.
  // Throws a ClassCastException if this repo is not a BeanEditorRepo.
  public default BeanEditorRepo asBeanEditorRepo() {
    return (BeanEditorRepo)this;
  }

  // Specifies whether this repo is a change manager bean repo.
  public default boolean isChangeManagerBeanRepo() {
    return this instanceof ChangeManagerBeanRepo;
  }

  // Converts this repo to a change manager bean repo.
  // Throws a ClassCastException if this repo is not a ChangeManagerBeanRepo.
  public default ChangeManagerBeanRepo asChangeManagerBeanRepo() {
    return (ChangeManagerBeanRepo)this;
  }
}
