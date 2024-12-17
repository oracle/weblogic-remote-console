// Copyright (c) 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import javax.ws.rs.core.MediaType;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.DownloadValue;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.LabelValue;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.Value;

/** 
 * Custom code for processing the NodeManagerRuntimeMBean
 */
public class NodeManagerRuntimeMBeanCustomizer {

  private NodeManagerRuntimeMBeanCustomizer() {
  }

  public static SettableValue getDownloadLogLink(
    InvocationContext ic,
    @Source(property = "Reachable") SettableValue reachable
  ) {
    Value value = null;
    if (reachable.getValue().asBoolean().getValue()) {
      if (!supportsLogDownload(ic)) {
        String label = ic.getLocalizer().localizeString(LocalizedConstants.NODE_MANAGER_LOG_DOWNLOAD_NOT_SUPPORTED);
        value = new LabelValue(label);
      } else {
        String machine = ic.getBeanTreePath().getLastSegment().getKey();
        Path path = new Path("domainRuntime.downloads.NodeManagerLogs");
        path.addComponent(machine);
        String label = ic.getLocalizer().localizeString(LocalizedConstants.NODE_MANAGER_LOG_DOWNLOAD_LABEL);
        String download = machine + "NodeManager.log";
        value = new DownloadValue(label, path, MediaType.TEXT_PLAIN, download);
      }
    } else {
      String label = ic.getLocalizer().localizeString(LocalizedConstants.NODE_MANAGER_LOG_NOT_AVAILABLE_LABEL);
      value = new LabelValue(label);
    }
    return new SettableValue(value);
  }

  private static boolean supportsLogDownload(InvocationContext ic) {
    boolean support = ic.getPageRepo().getBeanRepo().getBeanRepoDef().supportsCapabilities(
        List.of("NodeManagerLog"));
    return support;
  }
}
