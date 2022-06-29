// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

/**
 * This class holds results of an options source on a page.
 */
public class OptionsSource {
  private String label = "";
  private String resourceData = "";
  private BeanTreePath beanTreePath = null;

  public OptionsSource(BeanTreePath beanTreePath) {
    this.beanTreePath = beanTreePath;
  }

  public OptionsSource(String label, String resourceData) {
    this.label = label;
    this.resourceData = resourceData;
  }

  public BeanTreePath getBeanTreePath() {
    return beanTreePath;
  }

  public String getLabel() {
    return label;
  }

  public String getResourceData() {
    return resourceData;
  }
}
