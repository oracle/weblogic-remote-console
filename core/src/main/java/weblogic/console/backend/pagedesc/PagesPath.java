// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

import weblogic.console.backend.typedesc.WeblogicBeanType;
import weblogic.console.backend.typedesc.WeblogicBeanTypes;

/**
 * This class contains the path needed to identify a set of yaml files for a bean type.
 * <p>
 * It has two parts:
 * <ul>
 *   <li>
 *     perspectivePath -
 *     each mbean type can have different perspectives
 *     e.g. a runtime mbean can have separate monitoring and control pages.
 *   </li>
 *   <li>
 *     beanType -
 *     the mbean type, e.g. ServerMBean
 *   </li>
 * </ul>
 */
public class PagesPath {

  private PerspectivePath perspectivePath;

  public PerspectivePath getPerspectivePath() {
    return this.perspectivePath;
  }

  private WeblogicBeanType beanType;

  public WeblogicBeanType getBeanType() {
    return this.beanType;
  }

  private String key;

  public String getKey() {
    return this.key;
  }

  public static PagesPath newConfigurationPagesPath(
    WeblogicBeanTypes types,
    WeblogicBeanType beanType
  ) throws Exception {
    return newConfigurationRootPagesPath(types).newPagesPath(beanType);
  }

  public static PagesPath newConfigurationRootPagesPath(WeblogicBeanTypes types) throws Exception {
    return new PagesPath(
      PerspectivePath.newConfigurationPerspectivePath(types), types.getDomainMBeanType());
  }

  public static PagesPath newMonitoringPagesPath(
    WeblogicBeanTypes types,
    WeblogicBeanType beanType
  ) throws Exception {
    return newMonitoringRootPagesPath(types).newPagesPath(beanType);
  }

  public static PagesPath newMonitoringRootPagesPath(WeblogicBeanTypes types) throws Exception {
    return new PagesPath(
      PerspectivePath.newMonitoringPerspectivePath(types),
      types.getDomainRuntimeMBeanType()
    );
  }

  public static PagesPath newControlPagesPath(
    WeblogicBeanTypes types,
    WeblogicBeanType beanType
  ) throws Exception {
    return newControlRootPagesPath(types).newPagesPath(beanType);
  }

  public static PagesPath newControlRootPagesPath(WeblogicBeanTypes types) throws Exception {
    return new PagesPath(
      PerspectivePath.newControlPerspectivePath(types),
      types.getDomainRuntimeMBeanType()
    );
  }

  /*ackage*/ PagesPath(PerspectivePath perspectivePath, WeblogicBeanType beanType) {
    this.perspectivePath = perspectivePath;
    this.beanType = beanType;
    this.key = getPerspectivePath().getKey() + "beanType=<" + getBeanType() + ">";
  }

  // Get a PagesPath for a set of pages in the same perspective as this path.
  public PagesPath newPagesPath(WeblogicBeanType beanType) throws Exception {
    return new PagesPath(getPerspectivePath(), beanType);
  }

  @Override
  public String toString() {
    return getKey();
  }
}
