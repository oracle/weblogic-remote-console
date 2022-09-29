// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import weblogic.remoteconsole.common.repodef.yaml.BeanRepoDefImpl;
import weblogic.remoteconsole.common.repodef.yaml.YamlReader;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.common.utils.WebLogicRoles;

/**
 * Base class for describing the bean types for a WebLogic mbean tree.
 * 
 * The types are defined in yaml files under resources/src/main/resources
 * and weblogic-bean-types/src/main/resources/harvestedWeblogicBeanTypes/<weblogic version>
 */
public abstract class WebLogicBeanRepoDef extends BeanRepoDefImpl {
  private boolean removeMissingPropertiesAndTypes;
  private WebLogicYamlReader yamlReader;

  protected WebLogicBeanRepoDef(WebLogicMBeansVersion mbeansVersion) {
    super(mbeansVersion);
    // If the WLS version isn't the one that we hand-coded yaml files against
    // (e.g. nav tree, types, PDYs) then remove mbean types and properties that aren't
    // in this WLS version or supported by the user's roles from the pages or
    // we're not building the english resource bundle (i.e. capabilities isn't set
    // to All)
    removeMissingPropertiesAndTypes = true;
    if (mbeansVersion.getWebLogicVersion().isCurrentVersion()
        && mbeansVersion.getRoles().contains(WebLogicRoles.ADMIN)
        && mbeansVersion.getPSU() != null
        && mbeansVersion.getPSU().isCurrentPSU()
        && mbeansVersion.getCapabilities().contains("All")
    ) {
      removeMissingPropertiesAndTypes = false;
    }
    this.yamlReader = new WebLogicYamlReader(mbeansVersion);
  }

  @Override
  protected boolean isRemoveMissingPropertiesAndTypes() {
    return removeMissingPropertiesAndTypes;
  }

  @Override
  protected YamlReader getYamlReader() {
    return yamlReader;
  }
}
