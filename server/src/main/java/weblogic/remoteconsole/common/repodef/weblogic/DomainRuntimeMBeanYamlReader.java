// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.schema.BeanChildDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefSource;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * Creates the yaml that describes the pages and types a DomainRuntimeMBean.
 * 
 * It starts off with the harvested and hand-coded yaml for DomainRuntimeMBean and:
 * 
 * 1) Adds 'Dashboards' and 'RecentSearches' children that hold collections of
 *    fabricated beans for dashboards and recent simple search results.
 *
 * 2) Adds a CombinedServerRuntimes child that holds a collection of
 *    fabricated beans that pull together the ServerLifeCycleRuntime and
 *    ServerRuntime mbeans.
 * 
 * 3) Adds a corresponding aggregated child for every child of
 *    the ServerRuntimeMBean (e.g. AggregatedLibraryRuntimes,
 *    AggregatedApplicationRuntimes).  That is, it adds the
 *    fabricated child beans that aggregate the per-server child
 *    mbeans so that the user can get a domain-wide view of the mbeans
 *    (e.g. see an application across the servers it's currently
 *    running on)
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
  BeanTypeDefSource getBeanTypeDefSource(String type) {
    BeanTypeDefSource source = super.getBeanTypeDefSource(type);
    // Add the fabricated collection of beans for recent simple search results
    {
      BeanPropertyDefSource property = new BeanPropertyDefSource();
      property.setName("RecentSearches");
      property.setType("weblogic.management.SimpleSearchMBean");
      property.setArray(true);
      property.setRelationship("containment");
      property.setDescriptionHTML("<p>Recent search results.</p>");
      source.getProperties().add(property);
    }
    // Add the fabricated collection of beans for dashboards
    {
      BeanPropertyDefSource property = new BeanPropertyDefSource();
      property.setName(DASHBOARDS);
      property.setType("weblogic.management.DashboardMBean");
      property.setArray(true);
      property.setRelationship("containment");
      property.setDescriptionHTML("<p>Dashboards.</p>");
      source.getProperties().add(property);
    }
    // Add the fabricated collection of beans that merge ServerLifeCycleRuntimeMBean and ServerRuntimeMBean
    {
      BeanPropertyDefSource property = new BeanPropertyDefSource();
      property.setName("CombinedServerRuntimes");
      property.setType("weblogic.management.runtime.CombinedServerRuntimeMBean");
      property.setArray(true);
      property.setRelationship("containment");
      property.setDescriptionHTML("<p>All the configured and/or running servers in the domain.</p>");
      source.getProperties().add(property);
    }
    // For every aggregatable child under a server runtime mbean,
    // add a corresponding aggregated property under the domain runtime mbean
    BeanTypeDefSource serverRuntimeSource = getYamlReader().getBeanTypeDefSource(SERVER_RUNTIME_MBEAN);
    for (BeanPropertyDefSource property : serverRuntimeSource.getProperties()) {
      String propertyType = property.getType();
      if (AGGREGATED_NAME_HANDLER.isFabricatableType(propertyType)) {
        property.setType(AGGREGATED_NAME_HANDLER.getFabricatedJavaType(propertyType));
        property.setName(AGGREGATED_NAME_HANDLER.getFabricatedName(property.getName()));
        source.getProperties().add(property);
      }
    }
    return source;
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
    BeanTypeDefSource serverRuntimeSource = getYamlReader().getBeanTypeDefSource(SERVER_RUNTIME_MBEAN);
    BeanTypeDefCustomizerSource serverRuntimeCustomizerSource =
      getYamlReader().getBeanTypeDefCustomizerSource(
        typeDef.getBeanRepoDef().getTypeDef(SERVER_RUNTIME_MBEAN)
      );
    for (BeanPropertyDefSource propertyDef : serverRuntimeSource.getProperties()) {
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
    return domainRuntimeCustomizerSource;
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
