// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import java.util.Set;

import weblogic.remoteconsole.common.repodef.yaml.BeanRepoDefImpl;
import weblogic.remoteconsole.common.repodef.yaml.YamlReader;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersions;
import weblogic.remoteconsole.common.utils.WebLogicRoles;
import weblogic.remoteconsole.common.utils.WebLogicVersion;

/**
 * Base class for describing the bean types for a WebLogic mbean tree.
 * 
 * The types are defined in yaml files under resources/src/main/resources
 * and weblogic-bean-types/src/main/resources/harvestedWeblogicBeanTypes/<weblogic version>
 */
public abstract class WebLogicBeanRepoDef extends BeanRepoDefImpl {
  private boolean removeMissingPropertiesAndTypes;
  private WebLogicYamlReader yamlReader;

  @Override
  protected boolean isRemoveMissingPropertiesAndTypes() {
    return removeMissingPropertiesAndTypes;
  }

  @Override
  protected YamlReader getYamlReader() {
    return yamlReader;
  }

  protected WebLogicBeanRepoDef(WebLogicMBeansVersion mbeansVersion) {
    super(mbeansVersion);
    // If the WLS version isn't the one that we hand-coded yaml files against
    // (e.g. nav tree, types, PDYs) then remove mbean types and properties that aren't
    // in this WLS version or supported by the user's roles from the pages.
    WebLogicVersion weblogicVersion = mbeansVersion.getWebLogicVersion();
    this.removeMissingPropertiesAndTypes =
      weblogicVersion.isCurrentVersion() && mbeansVersion.getRoles().contains(WebLogicRoles.ADMIN) ? false : true;
    this.yamlReader = new WebLogicYamlReader(weblogicVersion);
  }

  // Temporary scaffolding:
  protected WebLogicBeanRepoDef(WebLogicVersion weblogicVersion, Set<String> roles) {
    this(
      WebLogicMBeansVersions.getVersion(
        weblogicVersion,
        false, // supports security warnings
        roles
      )
    );
  }
}
