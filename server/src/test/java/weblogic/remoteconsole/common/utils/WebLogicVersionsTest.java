// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.util.Set;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class WebLogicVersionsTest {

  @Test
  public void latestVersionIs261() {
    WebLogicVersion version = WebLogicVersions.getLatestVersion();

    assertEquals("26.1.0.0.0", version.getDomainVersion());
    assertTrue(version.isLatestVersion());
    assertSame(version, WebLogicVersions.getVersion("26.1.0.0.0"));
    assertSame(version, WebLogicVersions.getVersion("27.0.0.0.0"));
    assertEquals(
      "15.1.1.0.0",
      WebLogicVersions.getVersion("25.0.0.0.0").getDomainVersion()
    );
  }

  @Test
  public void versionMetadataUses261Documentation() {
    WebLogicVersion version = WebLogicVersions.getVersion("26.1.0.0.0");

    assertEquals(
      "https://docs.oracle.com/en/middleware/standalone/weblogic-server/26.1.0/wlmbr/mbeans/DomainMBean.html",
      version.getMBeanTypeJavadocUrl("DomainMBean")
    );
    assertEquals(
      "https://docs.oracle.com/en/middleware/standalone/coherence/26.1.0/manage-coherence",
      version.getCoherenceEdocsHelpTopicUrl("manage-coherence")
    );
  }

  @Test
  public void genericHelpTopicUrlsUseVersionSpecificContexts() {
    String genericTopicUrl =
      "http://www.oracle.com/pls/topic/lookup?ctx=@FMW_VERSION@&amp;id=example";

    assertEquals(
      "http://www.oracle.com/pls/topic/lookup?ctx=wls2610&id=example",
      WebLogicVersions.getVersion("26.1.0.0.0").getGenericHelpTopicUrl(genericTopicUrl)
    );
    assertEquals(
      "http://www.oracle.com/pls/topic/lookup?ctx=wls1511&id=example",
      WebLogicVersions.getVersion("15.1.1.0.0").getGenericHelpTopicUrl(genericTopicUrl)
    );
    assertEquals(
      "http://www.oracle.com/pls/topic/lookup?ctx=fmw1412&id=example",
      WebLogicVersions.getVersion("14.1.2.0.0").getGenericHelpTopicUrl(genericTopicUrl)
    );
  }

  @Test
  public void capabilitiesReflect261Activation() {
    Set<String> latestCapabilities =
      WebLogicVersions.getVersionCapabilities(WebLogicVersions.getVersion("26.1.0.0.0"));
    Set<String> previousCapabilities =
      WebLogicVersions.getVersionCapabilities(WebLogicVersions.getVersion("15.1.1.0.0"));

    assertTrue(latestCapabilities.contains("26.1.0.0.0OrAfter"));
    assertFalse(latestCapabilities.contains("Before26.1.0.0.0"));
    assertTrue(previousCapabilities.contains("Before26.1.0.0.0"));
    assertTrue(previousCapabilities.contains("15.1.1.0.0OrAfter"));
  }

  @Test
  public void retiredVersionsUse12214Metadata() {
    WebLogicVersion version = WebLogicVersions.getVersion("12.2.1.4.0");

    assertSame(version, WebLogicVersions.getVersion("12.2.1.5.0"));
    assertSame(version, WebLogicVersions.getVersion("12.2.1.6.0"));
  }

  @Test
  public void harvested261DomainMBeanIsVisible() {
    assertNotNull(
      Thread.currentThread().getContextClassLoader().getResource(
        "harvestedWeblogicBeanTypes/26.1.0.0.0/DomainMBean.yaml"
      )
    );
  }
}
