// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This class holds results of an options source on a page.
 */
public class OptionsSource {
  private BeanTreePath optionsSource;

  public BeanTreePath getOptionsSource() {
    return this.optionsSource;
  }

  public OptionsSource(BeanTreePath optionsSource) {
    this.optionsSource = optionsSource;
  }
}
