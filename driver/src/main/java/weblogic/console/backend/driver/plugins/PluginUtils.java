// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver.plugins;

import java.util.logging.Logger;
import javax.json.JsonArray;

import weblogic.console.backend.utils.Path;

/** Utilities used by plugin implementations */
public class PluginUtils {
  private static final Logger LOGGER = Logger.getLogger(PluginUtils.class.getName());

  public static Path identityToPath(JsonArray identity) {
    Path p = new Path();
    for (int i = 0; i < identity.size(); i++) {
      p.addComponent(identity.getString(i));
    }
    return p;
  }
}
