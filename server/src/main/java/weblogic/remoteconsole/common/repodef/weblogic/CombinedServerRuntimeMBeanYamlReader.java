// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.PagesPath;
import weblogic.remoteconsole.common.repodef.SlicePagePath;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefExtensionSource;
import weblogic.remoteconsole.common.repodef.schema.NavTreeDefSource;
import weblogic.remoteconsole.common.repodef.schema.NavTreeNodeDefSource;
import weblogic.remoteconsole.common.repodef.schema.SliceFormDefSource;
import weblogic.remoteconsole.common.repodef.schema.SlicesDefSource;
import weblogic.remoteconsole.common.repodef.yaml.SlicesDefImpl;

/**
 * Base implementation for dynamically creating the yaml that describes
 * the pages and types for a fabricated bean that pulls together the
 * ServerLifeCycleRuntimeMBean and corresponding ServerRuntimeMBean for
 * a server.
 */
abstract class CombinedServerRuntimeMBeanYamlReader extends WebLogicBeanTypeYamlReader {

  CombinedServerRuntimeMBeanYamlReader(WebLogicYamlReader yamlReader) {
    super(yamlReader);
  }

  protected abstract String getDelegatedType();

  protected abstract String getDelegatedProperty();

  @Override
  BeanTypeDefExtensionSource getBeanTypeDefExtensionSource(BeanTypeDef typeDef) {
    return getYamlReader().getBeanTypeDefExtensionSource(getDelegatedTypeDef(typeDef));
  }

  @Override
  SliceFormDefSource getSliceFormDefSource(SlicePagePath pagePath, SlicesDefImpl slicesDefImpl) {
    SliceFormDefSource source =
      getYamlReader().getSliceFormDefSource(getDelegatedSlicePagePath(pagePath), slicesDefImpl);
    if (source == null) {
      return null;
    }
    for (BeanPropertyDefCustomizerSource property : source.getProperties()) {
      delegateProperty(property);
    }
    for (BeanPropertyDefCustomizerSource property : source.getAdvancedProperties()) {
      delegateProperty(property);
    }
    return source;
  }

  private void delegateProperty(BeanPropertyDefCustomizerSource property) {
    property.setName(getDelegatedProperty() + "." + property.getName());
  }

  @Override
  SlicesDefSource getSlicesDefSource(BeanTypeDef typeDef) {
    return getYamlReader().getSlicesDefSource(getDelegatedTypeDef(typeDef));
  }

  @Override
  NavTreeDefSource getNavTreeDefSource(String type) {
    NavTreeDefSource source =
      getYamlReader().getNavTreeDefSource(getDelegatedType());
    if (source == null) {
      return null;
    }
    delegateNavTreeNodes(source.getContents());
    return source;
  }

  protected void delegateNavTreeNodes(List<NavTreeNodeDefSource> nodes) {
    for (NavTreeNodeDefSource node : nodes) {
      if (node.getType() == NavTreeNodeDefSource.Type.child) {
        node.setChild(getDelegatedProperty() + "." + node.getChild());
      }
      delegateNavTreeNodes(node.getContents());
    }
  }

  public SlicePagePath getDelegatedSlicePagePath(SlicePagePath pagePath) {
    return
      PagePath.newSlicePagePath(
        getDelegatedPagesPath(pagePath),
        pagePath.getSlicePath()
      );
  }

  public PagesPath getDelegatedPagesPath(PagePath pagePath) {
    return
      pagePath.getPagesPath().getPageRepoDef().newPagesPath(
        getDelegatedTypeDef(pagePath.getPagesPath().getTypeDef())
      );
  }

  private BeanTypeDef getDelegatedTypeDef(BeanTypeDef typeDef) {
    return typeDef.getBeanRepoDef().getTypeDef(getDelegatedType());
  }
}
