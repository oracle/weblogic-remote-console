// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import weblogic.remoteconsole.common.repodef.yaml.BeanRepoDefImpl;
import weblogic.remoteconsole.common.repodef.yaml.YamlReader;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;

/**
 * Base class for describing the bean types for a WebLogic mbean tree.
 * 
 * The types are defined in yaml files under resources/src/main/resources
 * and weblogic-bean-types/src/main/resources/harvestedWeblogicBeanTypes/<weblogic version>
 */
public abstract class WebLogicBeanRepoDef extends BeanRepoDefImpl {
  private WebLogicYamlReader yamlReader;

  protected WebLogicBeanRepoDef(WebLogicMBeansVersion mbeansVersion) {
    super(mbeansVersion);
    this.yamlReader = new WebLogicYamlReader(mbeansVersion);
  }

  @Override
  protected YamlReader getYamlReader() {
    return yamlReader;
  }
}
