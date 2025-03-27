// Copyright (c) 2024, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import weblogic.console.utils.Path;

/**
 * This class holds the info for an href that contains a downloadable link.
 */
public class DownloadValue extends Value {

  private String label;
  private Path path; // connection relative path to the endpoint to use to download the file
  private String mediaType;
  private String fileName;

  public DownloadValue(
    String label,
    Path path,
    String mediaType,
    String fileName
  ) {
    this.label = label;
    this.path = path;
    this.mediaType = mediaType;
    this.fileName = fileName;
  }


  public String getLabel() {
    return label;
  }

  public Path getPath() {
    return path;
  }

  public String getMediaType() {
    return mediaType;
  }

  public String getFileName() {
    return fileName;
  }

  @Override
  public String toString() {
    return "DownloadValue<" + getLabel() + "," + getPath() + "," + getMediaType() + "," + getFileName() + ">";
  }
}
