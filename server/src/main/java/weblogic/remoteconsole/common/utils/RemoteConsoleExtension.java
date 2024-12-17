// Copyright (c) 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.util.jar.JarFile;

/** 
 * Contains information about a remote console extension.
 * 
 * Note: The WRC caches the extension's yamls based on the name and version.
 * Therefore, the extension writer MUST change the name and/or version
 * whenever they change the yamls.
 */
public interface RemoteConsoleExtension {

  String getName();

  String getVersion();

  JarFile getJarFile();
}
