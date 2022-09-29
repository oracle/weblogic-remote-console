// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.CreateFormPagePath;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.SlicePagePath;
import weblogic.remoteconsole.common.repodef.TablePagePath;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefExtensionSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefSource;
import weblogic.remoteconsole.common.repodef.schema.CreateFormDefSource;
import weblogic.remoteconsole.common.repodef.schema.LinksDefSource;
import weblogic.remoteconsole.common.repodef.schema.NavTreeDefSource;
import weblogic.remoteconsole.common.repodef.schema.PseudoBeanTypeDefSource;
import weblogic.remoteconsole.common.repodef.schema.SliceFormDefSource;
import weblogic.remoteconsole.common.repodef.schema.SliceTableDefSource;
import weblogic.remoteconsole.common.repodef.schema.SlicesDefSource;
import weblogic.remoteconsole.common.repodef.schema.TableDefSource;
import weblogic.remoteconsole.common.repodef.yaml.SlicesDefImpl;
import weblogic.remoteconsole.common.repodef.yaml.YamlReader;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.common.utils.WebLogicPSU;

/**
 * Utility class for reading yaml files describing the pages
 * and types for a WebLogic version.
 * 
 * It searches for them in directly in the webapp and
 * in harvestedWeblogicBeanTypes/<weblogic version>.
 * 
 * It's also creates them on-the-fly (in memory) for types
 * that aggregate runtime mbeans across running servers.
 * That is, it makes the aggregated runtime mbeans look like
 * real mbean types even though they aren't in WebLogic.
 */
class WebLogicYamlReader extends YamlReader {
  private List<String> typesYamlDirectories = new ArrayList<>();

  WebLogicYamlReader(WebLogicMBeansVersion mbeansVersion) {
    // Search for hand coded yamls first (e.g. for fabricated types)
    typesYamlDirectories.add("");
    String gaDir = "harvestedWeblogicBeanTypes/" + mbeansVersion.getWebLogicVersion().getDomainVersion();
    WebLogicPSU psu = mbeansVersion.getPSU();
    if (psu != null) {
      // Search the PSU version of the yamls first
      typesYamlDirectories.add(gaDir + "/" + psu.getName());
    }
    // Search the GA version of the yamls
    typesYamlDirectories.add(gaDir);
  }

  @Override
  protected List<String> getTypesYamlDirectories() {
    return typesYamlDirectories;
  }

  @Override
  public BeanTypeDefSource getBeanTypeDefSource(String type) {
    return getTypeYamlReader(type).getBeanTypeDefSource(type);
  }

  BeanTypeDefSource getDefaultBeanTypeDefSource(String type) {
    return super.getBeanTypeDefSource(type);
  }

  @Override
  public PseudoBeanTypeDefSource getPseudoBeanTypeDefSource(String type) {
    return getTypeYamlReader(type).getPseudoBeanTypeDefSource(type);
  }

  PseudoBeanTypeDefSource getDefaultPseudoBeanTypeDefSource(String type) {
    return super.getPseudoBeanTypeDefSource(type);
  }

  @Override
  public BeanTypeDefCustomizerSource getBeanTypeDefCustomizerSource(BeanTypeDef typeDef) {
    return getTypeYamlReader(typeDef).getBeanTypeDefCustomizerSource(typeDef);
  }

  BeanTypeDefCustomizerSource getDefaultBeanTypeDefCustomizerSource(BeanTypeDef typeDef) {
    return super.getBeanTypeDefCustomizerSource(typeDef);
  }

  @Override
  public BeanTypeDefExtensionSource getBeanTypeDefExtensionSource(BeanTypeDef typeDef) {
    return getTypeYamlReader(typeDef).getBeanTypeDefExtensionSource(typeDef);
  }

  BeanTypeDefExtensionSource getDefaultBeanTypeDefExtensionSource(BeanTypeDef typeDef) {
    return super.getBeanTypeDefExtensionSource(typeDef);
  }

  @Override
  public SliceFormDefSource getSliceFormDefSource(SlicePagePath pagePath, SlicesDefImpl slicesDefImpl) {
    return getTypeYamlReader(pagePath).getSliceFormDefSource(pagePath, slicesDefImpl);
  }

  SliceFormDefSource getDefaultSliceFormDefSource(SlicePagePath pagePath, SlicesDefImpl slicesDefImpl) {
    return super.getSliceFormDefSource(pagePath, slicesDefImpl);
  }

  @Override
  public SliceTableDefSource getSliceTableDefSource(SlicePagePath pagePath, SlicesDefImpl slicesDefImpl) {
    return getTypeYamlReader(pagePath).getSliceTableDefSource(pagePath, slicesDefImpl);
  }

  SliceTableDefSource getDefaultSliceTableDefSource(SlicePagePath pagePath, SlicesDefImpl slicesDefImpl) {
    return super.getSliceTableDefSource(pagePath, slicesDefImpl);
  }

  @Override
  public CreateFormDefSource getCreateFormDefSource(CreateFormPagePath pagePath) {
    return getTypeYamlReader(pagePath).getCreateFormDefSource(pagePath);
  }

  CreateFormDefSource getDefaultCreateFormDefSource(CreateFormPagePath pagePath) {
    return super.getCreateFormDefSource(pagePath);
  }

  @Override
  public TableDefSource getTableDefSource(TablePagePath pagePath) {
    return getTypeYamlReader(pagePath).getTableDefSource(pagePath);
  }

  TableDefSource getDefaultTableDefSource(TablePagePath pagePath) {
    return super.getTableDefSource(pagePath);
  }

  @Override
  public SlicesDefSource getSlicesDefSource(BeanTypeDef typeDef) {
    return getTypeYamlReader(typeDef).getSlicesDefSource(typeDef);
  }

  SlicesDefSource getDefaultSlicesDefSource(BeanTypeDef typeDef) {
    return super.getSlicesDefSource(typeDef);
  }

  @Override
  public NavTreeDefSource getNavTreeDefSource(String type) {
    return getTypeYamlReader(type).getNavTreeDefSource(type);
  }

  NavTreeDefSource getDefaultNavTreeDefSource(String type) {
    return super.getNavTreeDefSource(type);
  }

  @Override
  public LinksDefSource getLinksDefSource(BeanTypeDef typeDef) {
    return getTypeYamlReader(typeDef).getLinksDefSource(typeDef);
  }

  LinksDefSource getDefaultLinksDefSource(BeanTypeDef typeDef) {
    return super.getLinksDefSource(typeDef);
  }

  private WebLogicBeanTypeYamlReader getTypeYamlReader(PagePath pagePath) {
    return getTypeYamlReader(pagePath.getPagesPath().getTypeDef());
  }

  private WebLogicBeanTypeYamlReader getTypeYamlReader(BeanTypeDef typeDef) {
    return getTypeYamlReader(typeDef.getTypeName());
  }

  private WebLogicBeanTypeYamlReader getTypeYamlReader(String type) {
    return WebLogicBeanTypeYamlReader.getTypeYamlReader(this, type);
  }
}
