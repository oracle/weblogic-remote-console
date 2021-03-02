// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

import weblogic.console.backend.typedesc.WeblogicBeanType;
import weblogic.console.backend.typedesc.WeblogicBeanTypes;

/**
 * This class contains the info needed to identify a set of yaml files for a perspective of the
 * pages for a bean tree.
 * <p>
 * It has two parts:
 * <p>
 * rootBeanType the root mbean type of the tree that contains this mbean type, e.g. DomainMBean
 * <p>
 * perspective A bean type can have different sets of pages (i.e. perspectives).
 * <p>
 * For example, ServerRuntimeMBean has different sets of monitoring and control pages (tables & slices).
 * <p>
 * The vast majority of bean types only have one set of pages - config editing for config beans
 * and monitoring for runtime mbeans.
 * <p>
 * To keep the file name sizes down, each bean has a default set of pages (config editing for
 * config beans and monitoring for runtime mbeans):
 * <ul>
 *   <li>monitoring PDYs
 *     <ul>
 *       <li>ServerRuntimeMBean/table.yaml</li>
 *       <li>ServerRuntimeMBean/slices.yaml</li>
 *       <li>ServerRuntimeMBean/slices/General/form.yaml</li>
 *     </ul>
 *   </li>
 *   <li>control PDYs
 *     <ul>
 *       <li>ServerRuntimeMBean/control/table.yaml</li>
 *       <li>ServerRuntimeMBean/control/slices.yaml</li>
 *       <li>ServerRuntimeMBean/control/slices/General/form.yaml</li>
 *     </ul>
 *   </li>
 *   <li>configuration editing PDYs
 *     <ul>
 *       <li>ServerMBean/table.yaml</li>
 *       <li>ServerMBean/slices.yaml</li>
 *       <li>ServerMBean/slices/General/form.yaml</li>
 *       <li>ServerMBean/createForm.yaml</li>
 *     </ul>
 *   </li>
 * </ul>
 * <p>
 * 'perspective' indicates which set of pages to use.
 * <p>
 * 'defaulPerspective' indicates whether this is the default perspective for this root bean type.
 * when true, then corrensponding the PDY paths do not include the perspective name.
 * <p>
 * Note: type.yaml, pseudo-type.yaml and extension.yaml contain overall information about the
 * type that applies to all of the pages for the type, regardless of perspective.
 */
public class PerspectivePath {
  private static final String CONFIGURATION = "configuration";
  private static final String MONITORING = "monitoring";
  private static final String CONTROL = "control";

  private WeblogicBeanType rootBeanType;

  public WeblogicBeanType getRootBeanType() {
    return this.rootBeanType;
  }

  private String perspective;

  public String getPerspective() {
    return this.perspective;
  }

  private boolean defaultPerspective;

  public boolean isDefaultPerspective() {
    return defaultPerspective;
  }

  private String key;

  public String getKey() {
    return this.key;
  }

  public static PerspectivePath newPerspectivePath(
    WeblogicBeanTypes types,
    String perspective
  ) throws Exception {
    if (CONFIGURATION.equals(perspective)) {
      return newConfigurationPerspectivePath(types);
    } else if (MONITORING.equals(perspective)) {
      return newMonitoringPerspectivePath(types);
    } else if (CONTROL.equals(perspective)) {
      return newControlPerspectivePath(types);
    } else {
      throw new AssertionError("Unsupported perspective " + perspective);
    }
  }

  public static PerspectivePath newConfigurationPerspectivePath(
    WeblogicBeanTypes types
  ) throws Exception {
    // DomainMBean's default perspective is configuration
    return new PerspectivePath(types.getDomainMBeanType(), CONFIGURATION, true);
  }

  public static PerspectivePath newMonitoringPerspectivePath(
    WeblogicBeanTypes types
  ) throws Exception {
    // DomainRuntimeMBean's default perspective is monitoring
    return new PerspectivePath(types.getDomainRuntimeMBeanType(), MONITORING, true);
  }

  public static PerspectivePath newControlPerspectivePath(
    WeblogicBeanTypes types
  ) throws Exception {
    // DomainRuntimeMBean also supports a control perspective
    return new PerspectivePath(types.getDomainRuntimeMBeanType(), CONTROL, false);
  }

  /*package*/ PerspectivePath(
    WeblogicBeanType rootBeanType,
    String perspective,
    boolean defaultPerspective
  ) {
    this.rootBeanType = rootBeanType;
    this.perspective = perspective;
    this.defaultPerspective = defaultPerspective;
    this.key = "perspective=<" + getPerspective() + ">";
  }

  @Override
  public String toString() {
    return getKey();
  }
}
