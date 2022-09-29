// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import weblogic.remoteconsole.common.repodef.yaml.BeanRepoDefImpl;
import weblogic.remoteconsole.common.repodef.yaml.PageRepoDefImpl;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;

/**
 * Base class for describing the pages for a WebLogic mbean tree.
 * 
 * The pages are defined in yaml files under resources/src/main/resources.
 */
public abstract class WebLogicPageRepoDef extends PageRepoDefImpl {
  private WebLogicMBeansVersion mbeansVersion;

  protected WebLogicPageRepoDef(
    String name,
    WebLogicMBeansVersion mbeansVersion,
    BeanRepoDefImpl beanRepoDefImpl,
    String rootName
  ) {
    super(
      name,
      beanRepoDefImpl,
      new WebLogicYamlReader(mbeansVersion),
      rootName
    );
    this.mbeansVersion = mbeansVersion;
  }

  protected WebLogicMBeansVersion getMBeansVersion() {
    return mbeansVersion;
  }

  @Override
  public String getResourceBundleName() {
    return
      WebLogicLocalizationUtils.getResourceBundleName(
        getMBeansVersion().getWebLogicVersion().getDomainVersion()
      );
  }
}
