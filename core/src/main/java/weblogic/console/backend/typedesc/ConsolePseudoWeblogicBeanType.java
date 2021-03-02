// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.typedesc;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.backend.utils.ListUtils;

/**
 * This POJO mirrors the yaml file format for configuring console-specific information about a
 * pseudo weblogic bean type, e.g. JDBCMultiDataSourceSystemResourcePseudoMBean/pseudo-type.yaml
 */
public class ConsolePseudoWeblogicBeanType {

  // the corresponding weblogic bean type
  private String weblogicBeanType;

  // the name of this pseudo mbean type
  private String name;

  // If specified, then the pseudo type will include only these properties from the
  // corresponding weblogic bean type.
  // Must not be specified if 'exclude' is specified
  private List<String> include = new ArrayList<>();

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getWeblogicBeanType() {
    return weblogicBeanType;
  }

  public void setWeblogicBeanType(String weblogicBeanType) {
    this.weblogicBeanType = weblogicBeanType;
  }

  public List<String> getInclude() {
    return include;
  }

  public void setInclude(List<String> include) {
    this.include = ListUtils.nonNull(include);
  }

  // If specified, then the pseudo type will include all of the properties from the
  // corresponding weblogic bean type except for these.
  // Must not be specified if 'include' is specified.
  private List<String> exclude = new ArrayList<>();

  public List<String> getExclude() {
    return exclude;
  }

  public void setExclude(List<String> exclude) {
    this.exclude = ListUtils.nonNull(exclude);
  }
}
