// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import weblogic.remoteconsole.common.repodef.yaml.BeanRepoDefImpl;
import weblogic.remoteconsole.common.repodef.yaml.PageRepoDefImpl;
import weblogic.remoteconsole.common.utils.WebLogicVersion;

/**
 * Base class for describing the pages for a WebLogic mbean tree.
 * 
 * The pages are defined in yaml files under resources/src/main/resources.
 */
public abstract class WebLogicPageRepoDef extends PageRepoDefImpl {
  private WebLogicVersion weblogicVersion;

  protected WebLogicPageRepoDef(
    String name,
    WebLogicVersion weblogicVersion,
    BeanRepoDefImpl beanRepoDefImpl,
    String navTreeRootTypeName
  ) {
    super(
      name,
      beanRepoDefImpl,
      new WebLogicYamlReader(weblogicVersion),
      navTreeRootTypeName
    );
    this.weblogicVersion = weblogicVersion;
  }

  protected WebLogicVersion getWeblogicVersion() {
    return this.weblogicVersion;
  }

  @Override
  public String getResourceBundleName() {
    return WebLogicLocalizationUtils.getResourceBundleName(getWeblogicVersion().getDomainVersion());
  }
}
