// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.SliceDef;
import weblogic.remoteconsole.common.repodef.SlicesDef;
import weblogic.remoteconsole.common.repodef.schema.SliceDefSource;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * yaml-based implementation of the SliceDef interface.
 */
class SliceDefImpl implements SliceDef {

  private SlicesDefImpl slicesDefImpl;

  private SliceDefSource source;

  private SliceDefImpl sliceDefImpl;

  private LocalizableString label;

  private List<SliceDef> contentDefs = new ArrayList<>();

  SliceDefImpl(
    SlicesDefImpl slicesDefImpl,
    SliceDefSource source,
    SliceDefImpl sliceDefImpl
  ) {
    this.slicesDefImpl = slicesDefImpl;
    this.source = source;
    this.sliceDefImpl = sliceDefImpl;
    String englishLabel = getSource().getLabel();
    if (StringUtils.isEmpty(englishLabel)) {
      // There isn't a custom label.  Use the name.
      englishLabel = StringUtils.camelCaseToUpperCaseWords(getName());
    }
    this.label = new LocalizableString(getLocalizationKey("label"), englishLabel);
    for (SliceDefSource sliceDefSource : getSource().getSlices()) {
      getContentDefs().add(new SliceDefImpl(getSlicesDefImpl(), sliceDefSource, this));
    }
  }

  private SlicesDefImpl getSlicesDefImpl() {
    return this.slicesDefImpl;
  }

  @Override
  public SlicesDef getSlicesDef() {
    return getSlicesDefImpl();
  }
  
  private SliceDefSource getSource() {
    return this.source;
  }

  private SliceDefImpl getSliceDefImpl() {
    return this.sliceDefImpl;
  }

  @Override
  public SliceDef getSliceDef() {
    return getSliceDefImpl();
  }

  @Override
  public LocalizableString getLabel() {
    return this.label;
  }

  @Override
  public String getName() {
    return getSource().getName();
  }

  @Override
  public List<SliceDef> getContentDefs() {
    return this.contentDefs;
  }

  private String getLocalizationKey(String key) {
    // Don't include the type since the strings should be shared
    // across slices if they happen to have the same text.
    return "slices." + getName() + "." + key;
  }
}
