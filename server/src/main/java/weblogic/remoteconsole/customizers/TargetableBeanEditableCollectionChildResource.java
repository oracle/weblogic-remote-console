// Copyright (c) 2026, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import weblogic.remoteconsole.server.webapp.DeletableCollectionChildBeanResource;
import weblogic.remoteconsole.server.webapp.TargetableBeanUpdateHelper;
import weblogic.remoteconsole.server.webapp.UpdateHelper;

/**
 * Custom JAXRS resource for writable JMS targetable bean instances.
 */
public class TargetableBeanEditableCollectionChildResource extends DeletableCollectionChildBeanResource {

  @Override
  protected UpdateHelper createUpdateHelper() {
    return new TargetableBeanUpdateHelper();
  }
}
