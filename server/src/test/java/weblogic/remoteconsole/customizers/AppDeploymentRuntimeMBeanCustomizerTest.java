// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import org.junit.jupiter.api.Test;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.Value;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;

public class AppDeploymentRuntimeMBeanCustomizerTest {

  @Test
  public void shouldNormalizeNullPlanToNullStringValue() {
    Value normalized = AppDeploymentRuntimeMBeanCustomizer.normalizeRedeployPlanPathValue(null);
    assertNull(normalized.asString().getValue());
  }

  @Test
  public void shouldNormalizeEmptyPlanToNullStringValue() {
    Value normalized = AppDeploymentRuntimeMBeanCustomizer.normalizeRedeployPlanPathValue(new StringValue(""));
    assertNull(normalized.asString().getValue());
  }

  @Test
  public void shouldNormalizeWhitespacePlanToNullStringValue() {
    Value normalized = AppDeploymentRuntimeMBeanCustomizer.normalizeRedeployPlanPathValue(new StringValue("   \t  "));
    assertNull(normalized.asString().getValue());
  }

  @Test
  public void shouldKeepNonEmptyPlanUnchanged() {
    StringValue original = new StringValue("/tmp/stage/MyApp/plan/Plan.xml");
    Value normalized = AppDeploymentRuntimeMBeanCustomizer.normalizeRedeployPlanPathValue(original);
    assertSame(original, normalized);
  }
}