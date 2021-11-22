// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

/**
 * This POJO mirrors the yaml source file format for customizing information about pseudo type,
 * e.g. JDBCProxySystemResourceMBean/pseudo-type.yaml
 *
 * There are a few WebLogic mbeans that, even though they really should be split into
 * a set of heterogeneous types, each with its own set of properties, are represented
 * by one type with all the properties and one property that indicates the 'type'.
 * Which properties are relevant is determined by the property that indicates the type.
 * This is especially used by JDBCSystemResourceMBean, which logically should be
 * split up into several kinds, e.g. generic, grid link, multi, active gridlink.
 * 
 * A pseudo type is a way to configure this in yaml so that the rest of the CBE
 * and CFE sees separate types.  Basically a pseudo type says "I'm a type that
 * wraps the following properties of the underlying real bean type'.
 *
 * Currently the remote console only uses this to handle JDBC system resources.
 */
public class PseudoBeanTypeDefSource {
  private StringValue name = new StringValue();
  private StringValue baseType = new StringValue();
  private ListValue<String> include = new ListValue<>();
  private ListValue<String> exclude = new ListValue<>();

  // the name of this pseudo bean type
  public String getName() {
    return name.getValue();
  }

  public void setName(String value) {
    name.setValue(value);
  }

  // The corresponding base bean type's name
  public String getBaseType() {
    return baseType.getValue();
  }

  public void setBaseType(String value) {
    baseType.setValue(value);
  }

  // If specified, then the pseudo type will include only these properties
  // from the corresponding bean type.
  // Must not be specified if 'exclude' is specified
  public List<String> getInclude() {
    return include.getValue();
  }

  public void setInclude(List<String> value) {
    include.setValue(value);
  }

  public void addInclude(String value) {
    include.add(value);
  }

  // If specified, then the pseudo type will include all of the properties
  // from the corresponding weblogic bean type except for these.
  // Must not be specified if 'include' is specified.

  public List<String> getExclude() {
    return exclude.getValue();
  }

  public void setExclude(List<String> value) {
    exclude.setValue(value);
  }

  public void addExclude(String value) {
    exclude.add(value);
  }

  // Note: the base type's 'subTypes' configures the mapping
  // from the property on the base type that indicates the type
  // and the corresponding pseudo type.
}
