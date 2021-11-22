// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.List;

import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.UsedIfDef;
import weblogic.remoteconsole.common.repodef.schema.UsedIfDefSource;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.Value;

/**
 * yaml-based implementation of the UsedIfDef interface.
 */
class UsedIfDefImpl implements UsedIfDef {

  private UsedIfDefSource source;
  private PagePropertyDefImpl propertyDefImpl;
  private List<Value> values;

  UsedIfDefImpl(PageDefImpl pageDefImpl, UsedIfDefSource source) {
    this.source = source;
    initializePropertyDefImpl(pageDefImpl);
    this.values = ValueUtils.createValues(source.getValues());
  }

  private void initializePropertyDefImpl(PageDefImpl pageDefImpl) {
    Path containedBeanRelativePropertyPath = new Path(source.getProperty());
    Path propertyPath =
      source.getPropertyContainedBeanPath().childPath(containedBeanRelativePropertyPath);
    String want = propertyPath.getDotSeparatedPath();
    for (PagePropertyDefImpl candidatePropertyDefImpl : pageDefImpl.getAllPropertyDefImpls()) {
      if (want.equals(candidatePropertyDefImpl.getPropertyPath().getDotSeparatedPath())) {
        propertyDefImpl = candidatePropertyDefImpl;
        return;
      }
    }
    throw new AssertionError("Can't find property " + want + " for usedIf on " + pageDefImpl);
  }

  PagePropertyDefImpl getPropertyDefImpl() {
    return propertyDefImpl;
  }

  @Override
  public PagePropertyDef getPropertyDef() {
    return getPropertyDefImpl();
  }

  @Override
  public List<Value> getValues() {
    return values;
  }
}
