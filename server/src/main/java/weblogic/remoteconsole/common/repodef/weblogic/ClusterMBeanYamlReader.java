// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.schema.SliceDefSource;
import weblogic.remoteconsole.common.repodef.schema.SlicesDefSource;

/**
 * Creates the yaml that describes the pages and types a ClusterMBean.
 * 
 * It starts off with the harvested and hand-coded yaml for ClusterMBean and
 * removes the 'Servers' slice for WDT.
 */
class ClusterMBeanYamlReader extends WebLogicBeanTypeYamlReader {

  ClusterMBeanYamlReader(WebLogicYamlReader yamlReader) {
    super(yamlReader);
  }

  @Override
  SlicesDefSource getSlicesDefSource(BeanTypeDef typeDef) {
    SlicesDefSource source = super.getSlicesDefSource(typeDef);
    if (typeDef.getBeanRepoDef() instanceof WDTBeanRepoDef) {
      List<SliceDefSource> slices = source.getSlices();
      for (int i = 0; i < slices.size(); i++) {
        if ("Servers".equals(slices.get(i).getName())) {
          slices.remove(i);
          break;
        }
      }
    }
    return source;
  }
}
