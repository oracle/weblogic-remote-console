// Copyright (c) 2022, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanRepoDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.schema.BeanChildDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefSource;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * Creates the yaml that describes the pages and types a DomainRuntimeMBean.
 * 
 * It starts off with the harvested and hand-coded yaml for DomainRuntimeMBean
 * and adds a corresponding aggregated child for every child of
 * the ServerRuntimeMBean (e.g. AggregatedLibraryRuntimes,
 * AggregatedApplicationRuntimes).  That is, it adds the
 * fabricated child beans that aggregate the per-server child
 * mbeans so that the user can get a domain-wide view of the mbeans
 * (e.g. see an application across the servers it's currently unning on)
 */
class DomainRuntimeMBeanYamlReader extends WebLogicBeanTypeYamlReader {

  private static final AggregatedRuntimeMBeanNameHandler AGGREGATED_NAME_HANDLER =
    AggregatedRuntimeMBeanNameHandler.INSTANCE;

  private static final String SERVER_RUNTIME_MBEAN = "ServerRuntimeMBean";
  private static final String DASHBOARDS = "Dashboards";

  DomainRuntimeMBeanYamlReader(WebLogicYamlReader yamlReader) {
    super(yamlReader);
  }

  @Override
  BeanTypeDefSource getBeanTypeDefSource(BeanRepoDef repoDef, String type) {
    BeanTypeDefSource source = super.getBeanTypeDefSource(repoDef, type);
    // For every aggregatable child under a server runtime mbean,
    // add a corresponding aggregated property under the domain runtime mbean
    BeanTypeDefSource serverRuntimeSource = getYamlReader().getBeanTypeDefSource(repoDef, SERVER_RUNTIME_MBEAN);
    BeanTypeDef serverRuntimeTypeDef = repoDef.getTypeDef(SERVER_RUNTIME_MBEAN);
    aggregateChildren(source, serverRuntimeSource.getProperties());
    return source;
  }

  private void aggregateChildren(
    BeanTypeDefSource source,
    List<BeanPropertyDefSource> propertyDefs
  ) {
    for (BeanPropertyDefSource propertyDef : propertyDefs) {
      String propertyType = propertyDef.getType();
      if (AGGREGATED_NAME_HANDLER.isFabricatableType(propertyType)) {
        propertyDef.setType(AGGREGATED_NAME_HANDLER.getFabricatedJavaType(propertyType));
        propertyDef.setName(AGGREGATED_NAME_HANDLER.getFabricatedName(propertyDef.getName()));
        source.getProperties().add(propertyDef);
      }
    }
  }

  @Override
  BeanTypeDefCustomizerSource getBeanTypeDefCustomizerSource(BeanTypeDef typeDef) {
    BeanTypeDefCustomizerSource domainRuntimeCustomizerSource = super.getBeanTypeDefCustomizerSource(typeDef);
    // Force the Dashboards child to be deletable:
    {
      BeanChildDefCustomizerSource childCustomizer = new BeanChildDefCustomizerSource();
      childCustomizer.setName(DASHBOARDS);
      childCustomizer.setDeletable(true);
      childCustomizer.setLabel("Dashboards");
      domainRuntimeCustomizerSource.addChild(childCustomizer);
    }
    // The names of the aggregated properties added to the DomainRuntimeMBean to
    // parallel the ones under the ServerRuntimeMBean start with 'Aggregated' so
    // they won't collide with ones with the same name.  For example,
    // both DomainRuntimeMBean and ServerRuntimeMBean have a SNMPAgentRuntime
    // property.  So, the one added to the DomainRuntimeMBean is called
    // AggregatedSNMPAgentRuntime.
    // Make sure these aggregated properties labels are the same as
    // the ones under the ServerRuntimeMBean (i.e. SNMP Agent Runtime
    // instead of Aggregated SNMP Agent Runtime).  This is OK since
    // they're displayed under different nodes in the nav tree.
    BeanTypeDefSource serverRuntimeSource =
      getYamlReader().getBeanTypeDefSource(typeDef.getBeanRepoDef(), SERVER_RUNTIME_MBEAN);
    BeanTypeDef serverRuntimeTypeDef = typeDef.getBeanRepoDef().getTypeDef(SERVER_RUNTIME_MBEAN);
    BeanTypeDefCustomizerSource serverRuntimeCustomizerSource =
      getYamlReader().getBeanTypeDefCustomizerSource(serverRuntimeTypeDef);
    aggregateProperties(
      domainRuntimeCustomizerSource,
      serverRuntimeCustomizerSource,
      serverRuntimeSource.getProperties()
    );
    return domainRuntimeCustomizerSource;
  }

  private void aggregateProperties(
    BeanTypeDefCustomizerSource domainRuntimeCustomizerSource,
    BeanTypeDefCustomizerSource serverRuntimeCustomizerSource,
    List<BeanPropertyDefSource> propertyDefs
  ) {
    for (BeanPropertyDefSource propertyDef : propertyDefs) {
      if (propertyDef.isChild() && AGGREGATED_NAME_HANDLER.isFabricatableJavaType(propertyDef.getType())) {
        String unaggName = propertyDef.getName();
        BeanChildDefCustomizerSource childCustomizer =
          findOrCreateChildCustomizer(unaggName, serverRuntimeCustomizerSource.getChildren());
        childCustomizer.setName(AGGREGATED_NAME_HANDLER.getFabricatedName(unaggName));
        if (StringUtils.isEmpty(childCustomizer.getLabel())) {
          // e.g. set the label for the AggregatedApplicationRuntimes property
          // to 'Application Runtimes' - i.e. the same label that would have
          // been computed for the ServerRuntimeMBean's ApplicationRuntimes property.
          childCustomizer.setLabel(StringUtils.camelCaseToUpperCaseWords(unaggName));
        }
        domainRuntimeCustomizerSource.addChild(childCustomizer);
      }
    }
  }

  private BeanChildDefCustomizerSource findOrCreateChildCustomizer(
    String childName,
    List<BeanChildDefCustomizerSource> unaggChildCustomizers
  ) {
    // See if the child was customized on the unaggregated type.
    for (BeanChildDefCustomizerSource cc : unaggChildCustomizers) {
      if (cc.getName().equals(childName)) {
        return cc;
      }
    }
    // It wasn't.  Make one.
    BeanChildDefCustomizerSource rtn = new BeanChildDefCustomizerSource();
    rtn.setName(childName);
    return rtn;
  }
}
