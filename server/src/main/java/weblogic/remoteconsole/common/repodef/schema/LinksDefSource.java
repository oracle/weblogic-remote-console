// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.console.schema.ListValue;
import weblogic.console.schema.YamlSource;

/**
 * This POJO mirrors the yaml source file format for configuring information
 * about the links for a type, e.g. DomainMBean/links.yaml
 */
public class LinksDefSource extends YamlSource {
  private ListValue<LinkDefSource> instanceLinks = ListValue.create();
  private ListValue<LinkDefSource> collectionLinks = ListValue.create();

  // The links for instances of the type, i.e. the links to
  // display for a ServerMBean.
  public List<LinkDefSource> getInstanceLinks() {
    return instanceLinks.getValue();
  }

  public void setInstanceLinks(List<LinkDefSource> value) {
    instanceLinks = instanceLinks.setValue(value);
  }

  public void addInstanceLink(LinkDefSource value) {
    instanceLinks = instanceLinks.add(value);
  }

  // The links for collections of the type, i.e. the links to
  // display for ServerMBean collections.
  public List<LinkDefSource> getCollectionLinks() {
    return collectionLinks.getValue();
  }

  public void setCollectionLinks(List<LinkDefSource> value) {
    collectionLinks = collectionLinks.setValue(value);
  }

  public void addCollectionLink(LinkDefSource value) {
    collectionLinks = collectionLinks.add(value);
  }

  @Override
  protected void validateExtension() {
    super.validateExtension();
    validateExtensionChildren(getInstanceLinks(), "instanceLinks");
    validateExtensionChildren(getCollectionLinks(), "collectionLinks");
  }
}
