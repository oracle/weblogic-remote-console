// Copyright (c) 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * Base interface for POJOs that mirror yaml files)
 */
public class YamlSource {

  private String yamlFile;
  private Path path;

  public void validateExtension(String yamlFile) {
    validateExtension(yamlFile, new Path());
  }

  protected void validateExtension(String yamlFile, Path path) {
    this.yamlFile = yamlFile;
    this.path = path;
    validateExtension();
    this.yamlFile = null;
    this.path = null;
  }

  protected void validateExtension() {
  }

  protected void validateExtensionChild(YamlSource child, String childName) {
    if (child != null) {
      child.validateExtension(yamlFile, path.childPath(childName));
    }
  }

  protected <T extends YamlSource> void validateExtensionChildren(List<T> children, String childrenName) {
    if (children != null) {
      for (YamlSource child : children) {
        validateExtensionChild(child, childrenName);
      }
    }
  }

  protected void validateExtensionStringPropertyNotSpecified(String val, String property) {
    if (!StringUtils.isEmpty(val)) {
      extensionPropertySpecifiedError(property);
    }
  }

  protected void extensionPropertySpecifiedError(String property) {
    extensionPropertyError(property, "must not be specified");
  }

  protected void extensionPropertyError(String property, String error) {
    throw new AssertionError(
      "Extension yaml error: " + yamlFile + " " + path.childPath(property) + " " + error
    );
  }
}
