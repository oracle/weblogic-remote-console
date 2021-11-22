// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import weblogic.remoteconsole.common.repodef.SliceFormDef;
import weblogic.remoteconsole.common.repodef.SliceFormPresentationDef;
import weblogic.remoteconsole.common.repodef.schema.SliceFormPresentationDefSource;

/**
 * yaml-based implementation of the SliceFormPresentationDef interface
 */
class SliceFormPresentationDefImpl implements SliceFormPresentationDef {
  private SliceFormPresentationDefSource source;
  private SliceFormDefImpl sliceFormDefImpl;

  public SliceFormPresentationDefImpl(
    SliceFormDefImpl sliceFormDefImpl,
    SliceFormPresentationDefSource source
  ) {
    this.sliceFormDefImpl = sliceFormDefImpl;
    this.source = source;
  }

  SliceFormDefImpl getSliceFormDefImpl() {
    return sliceFormDefImpl;
  }

  @Override
  public SliceFormDef getSliceFormDef() {
    return getSliceFormDefImpl();
  }

  @Override
  public boolean isUseCheckBoxesForBooleans() {
    return source.isUseCheckBoxesForBooleans();
  }

  @Override
  public boolean isSingleColumn() {
    return source.isSingleColumn();
  }
}
