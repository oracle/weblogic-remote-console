// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.pagedesc;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.backend.utils.ListUtils;


/**
 * This POJO mirrors the yaml source file format for configuring information
 * about the links for a type, e.g. DomainMBean/links.yaml
 */
public class LinksSource {
  private List<LinkSource> forCollections = new ArrayList<>();
  private List<LinkSource> forInstances = new ArrayList<>();

  public void setInstanceLinks(List<LinkSource> forInstances) {
    this.forInstances = ListUtils.nonNull(forInstances);
  }

  public List<LinkSource> getInstanceLinks() {
    return forInstances;
  }

  public void setCollectionLinks(List<LinkSource> forCollections) {
    this.forCollections = ListUtils.nonNull(forCollections);
  }

  public List<LinkSource> getCollectionLinks() {
    return forCollections;
  }
}
