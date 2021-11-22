// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import weblogic.remoteconsole.common.repodef.yaml.YamlReader;
import weblogic.remoteconsole.common.utils.WebLogicVersion;

/**
 * Utilty class for reading yaml files describing the pages
 * and types for a WebLogic version.
 * 
 * It searches for them in directly in the webapp and
 * in harvestedWeblogicBeanTypes/<weblogic version>.
 */
class WebLogicYamlReader extends YamlReader {
  WebLogicYamlReader(WebLogicVersion weblogicVersion) {
    super("harvestedWeblogicBeanTypes/" + weblogicVersion.getDomainVersion());
  }
}
