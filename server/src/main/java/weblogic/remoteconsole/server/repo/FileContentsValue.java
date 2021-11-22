// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.io.InputStream;

/**
 * This class holds the contents of a file as an input stream.
 */
public class FileContentsValue extends Value {

  private String fileName;
  private InputStream inputStream;
  private String mediaType;

  public FileContentsValue(String fileName, InputStream inputStream, String mediaType) {
    this.fileName = fileName;
    this.inputStream = inputStream;
    this.mediaType = mediaType;
  }

  public String getFileName() {
    return fileName;
  }

  public InputStream getInputStream() {
    return inputStream;
  }

  public String getMediaType() {
    return mediaType;
  }

  @Override
  public String toString() {
    return "FileContentsValue<" + getFileName() + "," + getMediaType() + ">";
  }
}
