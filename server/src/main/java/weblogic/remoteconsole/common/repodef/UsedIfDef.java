// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.List;

import weblogic.remoteconsole.server.repo.Value;

/**
 * This interface describes the conditions when a feature should be displayed.
 * There are derived interfaces for the various features that can be
 * conditionally displayed, e.g. PagePropertyUsedIfDef.
 * 
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface UsedIfDef {

  // The property whose value determines whether the feature should be displayed.
  public PagePropertyDef getPropertyDef();

  // The list of property values that indicate that this feature should be displayed.
  // i.e. if the property's current value is any of these values, then the
  // feature should be displayed.
  public List<Value> getValues(); // null, String, boolean, int, long
}
