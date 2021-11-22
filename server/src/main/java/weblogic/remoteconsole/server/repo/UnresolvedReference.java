// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This class holds an unresolved reference.
 * 
 * These are used to represent references in a WDT model
 * that are not defined in that model.
 * 
 * For example, a domain maybe be created from two WDT models,
 * one that configures a server which refers to Cluster1
 * but does not define Cluster1, and another that defines Cluster1.
 * 
 * Since currently the remote console only edits one WDT model at
 * a time, it uses this class to handle this use case.
 */
public class UnresolvedReference extends Value {
  private String key;

  public UnresolvedReference(String key) {
    this.key = key;
  }

  public String getKey() {
    return key;
  }

  @Override
  public String toString() {
    return "UnresolvedReference<" + getKey() + ">";
  }
}
