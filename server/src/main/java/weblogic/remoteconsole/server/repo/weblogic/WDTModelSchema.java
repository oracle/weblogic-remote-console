// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;
 
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * WDT Model schema
 */
public class WDTModelSchema {

  // Section names
  public static final String SECTION_TOPOLOGY = "topology";
  public static final String SECTION_RESOURCES = "resources";
  public static final String SECTION_APP_DEPLOYMENTS = "appDeployments";
  public static final String SECTION_DOMAIN_INFO = "domainInfo";
  public static final String SECTION_KUBERNETES = "kubernetes";

  public static final Map<String, Set<String>> SUPPORTED_SECTION_CONTENTS =
    Map.of(
      SECTION_TOPOLOGY,
      Set.of(
        "AdminConsole",
        "CdiContainer",
        "Cluster",
        "EmbeddedLDAP",
        "JMX",
        "JPA",
        "JTA",
        "Log",
        "LogFilter",
        "Machine",
        "MigratableTarget",
        "NMProperties",
        "RestfulManagementServices",
        "Security",
        "SecurityConfiguration",
        "Server",
        "ServerTemplate",
        "UnixMachine",
        "VirtualHost",
        "VirtualTarget",
        "WSReliableDeliveryPolicy",
        "XMLEntityCache",
        "XMLRegistry"
      ),
      SECTION_RESOURCES,
      Set.of(
        "CoherenceClusterSystemResource",
        "FileStore",
        "ForeignJNDIProvider",
        "JDBCStore",
        "JDBCSystemResource",
        "JMSBridgeDestination",
        "JMSServer",
        "JMSSystemResource",
        "JoltConnectionPool",
        "MailSession",
        "MessagingBridge",
        "ODLConfiguration",
        "OHS",
        "Partition",
        "PartitionWorkManager",
        "PathService",
        "ResourceGroup",
        "ResourceGroupTemplate",
        "ResourceManagement",
        "SAFAgent",
        "SelfTuning",
        "ShutdownClass",
        "SingletonService",
        "StartupClass",
        "SystemComponent",
        "WebAppContainer",
        "WLDFSystemResource",
        "WTCServer"
       ),
       SECTION_APP_DEPLOYMENTS,
       Set.of(
         "Application",
         "Library"
       )
    );

  public static final List<String> SUPPORTED_SECTIONS =
    List.of(
      SECTION_TOPOLOGY,
      SECTION_RESOURCES,
      SECTION_APP_DEPLOYMENTS
    );

  public static final List<String> UNSUPPORTED_SECTIONS =
    List.of(
      SECTION_DOMAIN_INFO,
      SECTION_KUBERNETES
    );

  public static final List<String> KNOWN_SECTIONS =
    List.of(
      SECTION_DOMAIN_INFO,
      SECTION_TOPOLOGY,
      SECTION_RESOURCES,
      SECTION_APP_DEPLOYMENTS,
      SECTION_KUBERNETES
    );
}
