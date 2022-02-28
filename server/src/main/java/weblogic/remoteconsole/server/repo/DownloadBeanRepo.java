// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.io.Writer;
import java.util.Map;

/**
 * The DownloadBeanRepo interface declares that the BeanRepo supports
 * the download of content on demand from the console backend server.
 * 
 * The download() method supplies a character based output stream
 * for writing the current data content of the BeanRepo.
 *
 * The getContent() method returns a Map of the download content
 * from the BeanRepo.
 */
public interface DownloadBeanRepo {
  /**
   * Download content using the supplied Writer and InvocationContext.
   */
  public void download(Writer writer, InvocationContext ic);

  /**
   * Obtain the download content as Map using the supplied InvocationContext.
   * @return a NULL when there is no content available
   */
  public Map<String, Object> getContent(InvocationContext ic);
}
