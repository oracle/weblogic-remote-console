// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.CreateFormPagePath;
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

/**
 * Class for reading yaml files describing the pages and types for a bean type.
 * Provides a default implementation that can be used for types that are
 * completely defined in yaml files.
 * 
 * Used to help dynamically create beans based on the underlying
 * weblogic beans.
 * 
 * For example, we create a parallel set of runtime mbeans that aggregate
 * the trees of per-server runtime mbeans so that the user can get a domain-wide
 * view of them (e.g. see an application across all the servers it's
 * currently running on).
 */
class WebLogicBeanTypeYamlReader {

  private WebLogicYamlReader yamlReader;

  public static WebLogicBeanTypeYamlReader getTypeYamlReader(WebLogicYamlReader yamlReader, String type) {
    if ("DomainMBean".equals(type)) {
      return new DomainMBeanYamlReader(yamlReader);
    }
    if ("DomainRuntimeMBean".equals(type)) {
      return new DomainRuntimeMBeanYamlReader(yamlReader);
    }
    if ("ClusterMBean".equals(type)) {
      return new ClusterMBeanYamlReader(yamlReader);
    }
    if ("RunningServerRuntimeMBean".equals(type)) {
      return new RunningServerRuntimeMBeanYamlReader(yamlReader);
    }
    if ("NotRunningServerRuntimeMBean".equals(type)) {
      return new NotRunningServerRuntimeMBeanYamlReader(yamlReader);
    }
    if (AggregatedRuntimeMBeanNameHandler.INSTANCE.isFabricatedType(type)) {
      return new AggregatedRuntimeMBeanYamlReader(yamlReader);
    }
    if (DelegatedServerRuntimeMBeanNameHandler.INSTANCE.isFabricatedType(type)) {
      return new DelegatedServerRuntimeMBeanYamlReader(yamlReader);
    }
    if (DelegatedServerLifeCycleRuntimeMBeanNameHandler.INSTANCE.isFabricatedType(type)) {
      return new DelegatedServerLifeCycleRuntimeMBeanYamlReader(yamlReader);
    }
    return new WebLogicBeanTypeYamlReader(yamlReader);
  }

  WebLogicBeanTypeYamlReader(WebLogicYamlReader yamlReader) {
    this.yamlReader = yamlReader;
  }

  protected WebLogicYamlReader getYamlReader() {
    return yamlReader;
  }

  BeanTypeDefSource getBeanTypeDefSource(String type) {
    return getYamlReader().getDefaultBeanTypeDefSource(type);
  }

  BeanTypeDefCustomizerSource getBeanTypeDefCustomizerSource(BeanTypeDef typeDef) {
    return getYamlReader().getDefaultBeanTypeDefCustomizerSource(typeDef);
  }

  PseudoBeanTypeDefSource getPseudoBeanTypeDefSource(String type) {
    return getYamlReader().getDefaultPseudoBeanTypeDefSource(type);
  }

  BeanTypeDefExtensionSource getBeanTypeDefExtensionSource(BeanTypeDef typeDef) {
    return getYamlReader().getDefaultBeanTypeDefExtensionSource(typeDef);
  }

  SliceFormDefSource getSliceFormDefSource(SlicePagePath pagePath, SlicesDefImpl slicesDefImpl) {
    return getYamlReader().getDefaultSliceFormDefSource(pagePath, slicesDefImpl);
  }

  SliceTableDefSource getSliceTableDefSource(SlicePagePath pagePath, SlicesDefImpl slicesDefImpl) {
    return getYamlReader().getDefaultSliceTableDefSource(pagePath, slicesDefImpl);
  }

  CreateFormDefSource getCreateFormDefSource(CreateFormPagePath pagePath) {
    return getYamlReader().getDefaultCreateFormDefSource(pagePath);
  }

  TableDefSource getTableDefSource(TablePagePath pagePath) {
    return getYamlReader().getDefaultTableDefSource(pagePath);
  }

  SlicesDefSource getSlicesDefSource(BeanTypeDef typeDef) {
    return getYamlReader().getDefaultSlicesDefSource(typeDef);
  }

  NavTreeDefSource getNavTreeDefSource(String type) {
    return getYamlReader().getDefaultNavTreeDefSource(type);
  }

  LinksDefSource getLinksDefSource(BeanTypeDef typeDef) {
    return getYamlReader().getDefaultLinksDefSource(typeDef);
  }
}
