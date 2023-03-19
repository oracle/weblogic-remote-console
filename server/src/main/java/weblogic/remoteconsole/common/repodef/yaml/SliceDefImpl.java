// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.SliceDef;
import weblogic.remoteconsole.common.repodef.SlicePagePath;
import weblogic.remoteconsole.common.repodef.SlicesDef;
import weblogic.remoteconsole.common.repodef.schema.SliceDefSource;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * yaml-based implementation of the SliceDef interface.
 */
class SliceDefImpl implements SliceDef {

  private SlicesDefImpl slicesDefImpl;

  private SliceDefSource source;

  private SliceDefImpl sliceDefImpl;

  private LocalizableString label;

  private Path slice = new Path();

  private List<SliceDef> contentDefs = new ArrayList<>();

  static SliceDefImpl createSliceDefImpl(
    SlicesDefImpl slicesDefImpl,
    SliceDefSource source,
    SliceDefImpl sliceDefImpl
  ) {
    SliceDefImpl newSliceDefImpl = new SliceDefImpl(slicesDefImpl, source, sliceDefImpl);
    if (newSliceDefImpl.getSource().getSlices().isEmpty()) {
      // See whether the yaml file for this slice exists.

      // create the page path to this slice
      PageRepoDefImpl pageRepo = slicesDefImpl.getPageRepoDefImpl();
      SlicePagePath pagePath =
        pageRepo.newSlicePagePath(slicesDefImpl.getTypeDef(), newSliceDefImpl.getSlice());

      // see whether a yalm file for this slice exists
      YamlReader reader = pageRepo.getYamlReader();
      if (reader.getSliceFormDefSource(pagePath, slicesDefImpl) == null
            && reader.getSliceTableDefSource(pagePath, slicesDefImpl) == null) {
        // the yaml for this slice doesn't exist. skip the slice.
        return null;
      }
    } else {
      // See whether the yaml file for any of this slice's child slices exists.
      if (newSliceDefImpl.getContentDefs().isEmpty()) {
        // none of the child slices' yaml files exist. skip the slice.
        return null;
      }
    }
    return newSliceDefImpl;
  }

  private SliceDefImpl(
    SlicesDefImpl slicesDefImpl,
    SliceDefSource source,
    SliceDefImpl sliceDefImpl
  ) {
    this.slicesDefImpl = slicesDefImpl;
    this.source = source;
    this.sliceDefImpl = sliceDefImpl;
    if (sliceDefImpl != null) {
      slice = sliceDefImpl.getSlice();
    }
    slice = slice.childPath(source.getName());
    String englishLabel = getSource().getLabel();
    if (StringUtils.isEmpty(englishLabel)) {
      // There isn't a custom label.  Use the name.
      englishLabel = StringUtils.camelCaseToUpperCaseWords(getName());
    }
    this.label = new LocalizableString(getLocalizationKey("label"), englishLabel);
    for (SliceDefSource sliceDefSource : getSource().getSlices()) {
      if (slicesDefImpl.getBeanRepoDefImpl().supportsCapabilities(sliceDefSource.getRequiredCapabilities())) {
        SliceDefImpl newSliceDefImpl = createSliceDefImpl(getSlicesDefImpl(), sliceDefSource, this);
        if (newSliceDefImpl != null) {
          getContentDefs().add(newSliceDefImpl);
        }
      }
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

  private Path getSlice() {
    return this.slice;
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
