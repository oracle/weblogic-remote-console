// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.Locale;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class LocalizerTest {

  @Test
  public void shouldEscapeHtmlArgsForLocalizedHtmlString() {
    Localizer localizer = new Localizer("console_backend_resource_bundle", Locale.ENGLISH);
    LocalizableString pattern = new LocalizableString("<p>{0}</p>");

    String actual = localizer.localizeHtmlString(pattern, "<img src=x onerror=alert(1)>&\"'");

    assertEquals(
      "<p>&lt;img src=x onerror=alert(1)&gt;&amp;&quot;&#39;</p>",
      actual
    );
  }

  @Test
  public void shouldPreserveHtmlPatternForLocalizedHtmlString() {
    Localizer localizer = new Localizer("console_backend_resource_bundle", Locale.ENGLISH);
    LocalizableString pattern = new LocalizableString("<p>The search results for ''{0}'' as of {1}.</p>");

    String actual = localizer.localizeHtmlString(pattern, "abc<def>", "now & later");

    assertEquals(
      "<p>The search results for 'abc&lt;def&gt;' as of now &amp; later.</p>",
      actual
    );
  }
}