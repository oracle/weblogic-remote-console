// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.CollectionParamDef;
import weblogic.remoteconsole.common.utils.Path;

/**
 * yaml-based implementation of the CollectionParamDef interface.
 */
class CollectionParamDefImpl extends ParamDefImpl implements CollectionParamDef {
  private Path collectionPath;
  private BaseBeanChildDefImpl collectionDefImpl;
  private List<BeanPropertyDefImpl> propertyDefImpls;
  private List<BeanPropertyDef> propertyDefs;

  CollectionParamDefImpl(
    CustomizerDefImpl customizerDefImpl,
    Path collectionPath,
    BaseBeanChildDefImpl collectionDefImpl,
    List<BeanPropertyDefImpl> propertyDefImpls
  ) {
    super(customizerDefImpl);
    this.collectionPath = collectionPath;
    this.collectionDefImpl = collectionDefImpl;
    this.propertyDefImpls = new ArrayList<>(propertyDefImpls);
    this.propertyDefs = Collections.unmodifiableList(getPropertyDefImpls());
  }

  @Override
  public Path getCollectionPath() {
    return collectionPath;
  }

  BaseBeanChildDefImpl getCollectionDefImpl() {
    return collectionDefImpl;
  }

  @Override
  public BeanChildDef getCollectionDef() {
    return getCollectionDefImpl();
  }

  List<BeanPropertyDefImpl> getPropertyDefImpls() {
    return propertyDefImpls;
  }

  @Override
  public List<BeanPropertyDef> getPropertyDefs() {
    return propertyDefs;
  }
}
