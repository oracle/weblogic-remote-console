// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

/**
 * This POJO mirrors the yaml source file format for configuring information
 * about the links for a type, e.g. DomainMBean/links.yaml
 */
public class LinksDefSource {
  private ListValue<LinkDefSource> instanceLinks = new ListValue<>();
  private ListValue<LinkDefSource> collectionLinks = new ListValue<>();

  // The links for instances of the type, i.e. the links to
  // display for a ServerMBean.
  public List<LinkDefSource> getInstanceLinks() {
    return instanceLinks.getValue();
  }

  public void setInstanceLinks(List<LinkDefSource> value) {
    instanceLinks.setValue(value);
  }

  public void addInstanceLink(LinkDefSource value) {
    instanceLinks.add(value);
  }

  // The links for collections of the type, i.e. the links to
  // display for ServerMBean collections.
  public List<LinkDefSource> getCollectionLinks() {
    return collectionLinks.getValue();
  }

  public void setCollectionLinks(List<LinkDefSource> value) {
    collectionLinks.setValue(value);
  }

  public void addCollectionLink(LinkDefSource value) {
    collectionLinks.add(value);
  }
}
