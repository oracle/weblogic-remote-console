// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.List;

/**
 * This interface describes a group navigation node underneath a type.
 *
 * It contains all of the information about the type that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface GroupNavTreeNodeDef extends NavTreeNodeDef {

  // Returns the group's child nodes.
  public List<NavTreeNodeDef> getContentDefs();
}
