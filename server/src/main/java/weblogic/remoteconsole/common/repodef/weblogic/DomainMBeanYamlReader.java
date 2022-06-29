// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefSource;

/**
 * Creates the yaml that describes the pages and types a DomainMBean.
 * 
 * It starts off with the harvested and hand-coded yaml for DomainMBean and:
 * 
 * 1) adds in a SimpleSearches child that holds a collection of
 *    fabricated beans that return the results of recent simple searches
 */
class DomainMBeanYamlReader extends WebLogicBeanTypeYamlReader {

  DomainMBeanYamlReader(WebLogicYamlReader yamlReader) {
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
    return source;
  }
}
