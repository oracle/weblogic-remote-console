// Copyright (c) 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

/**
 * Interface for reading yaml files from a directory.
 */
public interface YamlDirectoryReader {
  public <T> T readYaml(String relativeYamlPath, Class<T> type, boolean mustExist);

  public default <T> T readYaml(String relativeYamlPath, Class<T> type) {
    return readYaml(relativeYamlPath, type, false);
  }
}