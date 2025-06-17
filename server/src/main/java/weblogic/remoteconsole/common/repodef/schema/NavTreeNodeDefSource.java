// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.console.schema.BooleanValue;
import weblogic.console.schema.ListValue;
import weblogic.console.schema.StringValue;
import weblogic.console.schema.Value;
import weblogic.console.schema.YamlSource;
import weblogic.console.schema.beaninfo.RolesDefSource;

/**
 * This POJO mirrors the yaml source file format for configuring information
 * a node in the nav tree.
 *
 * There are two kinds of nav tree nodes:
 * - ones that display a child bean of the type (collection or singleton)
 *   e.g. the DomainMBean's Servers collection
 * - ones that group other nav tree nodes in the UI
 *   e.g. the DomainMBean's Services node
 * 
 * This POJO is used to configure both and contains all the properties
 * needed to configure either kind of node.  It's 'type' property indicates
 * the node type (child or group).
 * 
 * Most of the other properties are type-specific (e.g. 'label' should
 * only be specified when 'type' is 'group').
 */
public class NavTreeNodeDefSource extends YamlSource {

  public enum Type {
    child,
    group
  }

  private Value<Type> type = Value.create(Type.child);
  private StringValue child = StringValue.create();
  private StringValue label = StringValue.create();
  private BooleanValue forceNotExpandable = BooleanValue.create();
  private ListValue<NavTreeNodeDefSource> contents = ListValue.create();
  private Value<RolesDefSource> roles = Value.create();

  // The type of the nav tree node.
  public Type getType() {
    return type.getValue();
  }

  public void setType(Type value) {
    type = type.setValue(value);
  }

  // The relative path name of the child bean property for this node.
  // For example, the JMSSystemResourceMBean's child nav tree node
  // that displays its JMSResource's Queues collection should set 'child'
  // to 'JMSResource.Queue'
  //
  // Should only be specified if 'type' is 'child'.
  public String getChild() {
    return child.getValue();
  }

  public void setChild(String value) {
    child = child.setValue(value);
  }

  // The english label to display for this node.
  //
  // Must be specified if 'type' is 'group'.
  //
  // May be specified if 'type' is 'child' to customize the collection/singleton's
  // label (otherwise its default label will be used)
  public String getLabel() {
    return label.getValue();
  }

  public void setLabel(String value) {
    label = label.setValue(value);
  }

  // Whether this node cannot be expanded even if it normally would be expandable.
  // For example, an AuthenticationProvider's Users child collection should not be expandable.
  // Must only be specified if 'type' is 'child'
  public boolean isForceNotExpandable() {
    return forceNotExpandable.getValue();
  }

  public void setForceNotExpandable(boolean value) {
    forceNotExpandable = forceNotExpandable.setValue(value);
  }

  // The nav tree nodes directly under this node.
  //
  // Must not be empty if 'type' is 'group'. (i.e. a group node must parent other nodes).
  // Must be empty if 'type' is 'child'. (i.e. a child node must be a leaf node).
  public List<NavTreeNodeDefSource> getContents() {
    return contents.getValue();
  }

  public void setContents(List<NavTreeNodeDefSource> value) {
    contents = contents.setValue(value);
  }

  public void addContent(NavTreeNodeDefSource value) {
    contents = contents.add(value);
  }

  // The roles that are allowed to view this node.
  // Here are the combinations:
  // 1) roles specified, group node:
  //      visible if the user is in one of the roles
  // 2) roles specified, child node
  //      visible if the user is in one of the roles AND the user is allowed to view the child
  // 3) roles not specified, group node:
  //      visible
  // 4) roles not specified, child node
  //      visible if the user is allowed to view the child
  public RolesDefSource getRoles() {
    return roles.getValue();
  }

  public void setRoles(RolesDefSource value) {
    roles = roles.setValue(value);
  }

  @Override
  protected void validateExtension() {
    super.validateExtension();
    validateExtensionChildren(getContents(), "contents");
  }
}
