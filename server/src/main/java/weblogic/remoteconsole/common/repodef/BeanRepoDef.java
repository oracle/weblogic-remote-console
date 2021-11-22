// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

/**
 * This interface describes a bean repository.
 *
 * It contains all of the information about the repo that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 *
 * A repo has one root.
 *
 * For example, the WebLogic Edit Tree has one root
 * that has a Domain child under it.
 *
 * For example, the WebLogic Runtime Tree has one root
 * that has Domain and DomainRuntime children under it.
 */
public interface BeanRepoDef {

  // Returns the root type of this repo (e.g. the type
  // in the WebLogic Runtime Tree repo that can return
  // the DOmain and DomainRuntime trees as children).
  public BeanTypeDef getRootTypeDef();

  // Finds the definition of a type given its name.
  // The name can either be a fully qualified name or
  // a leaf name (e.g. weblogic.management.configuration.ServerMBean
  // or just ServerMBean).
  // Returns null if the type can't be found.
  public BeanTypeDef getTypeDef(String typeName);
}
