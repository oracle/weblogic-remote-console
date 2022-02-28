// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.util.ArrayList;
import java.util.List;

/**
 * Contains overall information about a PSU of a Weblogic version, including how
 * to detect whether the domain is using that PSU by looking for some mbean properties.
 */
public class WebLogicPSU {

  // The WebLogic version of this PSU
  private WebLogicVersion weblogicVersion;

  // The previous PSU of this WebLogic version, null if this is the first PSU
  private WebLogicPSU previousPSU;

  // The name of this PSU (e.g. psu210930, i.e. psuYYMMDD)
  // (used to locate the corresponding harvested YAML files)
  private String name;

  // Whether this instance is the current PSU wls version,
  // i.e. the one that the hand coded yaml files were
  // written to match.
  private boolean currentPSU;

  // A list of mbean properties beneath the DomainMBean that should be
  // present if the domain is using this PSU.
  // The format is the WebLogic REST path to the property
  // beneath the DomainMBean, e.g. securityConfiguration.secureMode.warnOnPatches
  private List<Path> markerMBeanProperties = new ArrayList<>();

  WebLogicPSU(
    String name,
    String... markerMBeanProperties
  ) {
    this.name = name;
    for (String markerMBeanProperty : markerMBeanProperties) {
      this.markerMBeanProperties.add(new Path(markerMBeanProperty));
    }
  }

  void setWebLogicVersion(WebLogicVersion weblogicVersion) {
    this.weblogicVersion = weblogicVersion;
  }

  public WebLogicVersion getWebLogicVersion() {
    return weblogicVersion;
  }

  void setPreviousPSU(WebLogicPSU previousPSU) {
    this.previousPSU = previousPSU;
  }

  public WebLogicPSU getPreviousPSU() {
    return previousPSU;
  }

  public String getName() {
    return name;
  }

  public void setCurrentPSU(boolean currentPSU) {
    this.currentPSU = currentPSU;
  }

  public boolean isCurrentPSU() {
    return currentPSU;
  }

  public List<Path> getMarkerMBeanProperties() {
    return markerMBeanProperties;
  }

  @Override
  public String toString() {
    return getWebLogicVersion() + " " + getName();
  }
}
