// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import weblogic.remoteconsole.common.repodef.HelpTopicDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.HelpTopicDefSource;
import weblogic.remoteconsole.common.repodef.schema.PageDefSource;
import weblogic.remoteconsole.common.utils.CustomizerInvocationUtils;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * yaml-based implementation of the PageDef interface.
 */
public abstract class PageDefImpl implements PageDef {
  private PageRepoDefImpl pageRepoDefImpl;
  private BaseBeanTypeDefImpl typeDefImpl;
  private PagePath pagePath;
  private PageDefSource source;
  private LocalizableString introductionHTML;
  private List<HelpTopicDefImpl> helpTopicDefImpls = new ArrayList<>();
  private List<HelpTopicDef> helpTopicDefs;
  private LocalizableString helpPageTitle;
  private List<PagePropertyDefImpl> allPropertyDefImpls = new ArrayList<>();
  private List<PagePropertyDef> allPropertyDefs;

  protected PageDefImpl(PageRepoDefImpl pageRepoDefImpl, PagePath pagePath, PageDefSource source) {
    this.pageRepoDefImpl = pageRepoDefImpl;
    this.pagePath = pagePath;
    this.source = source;
    this.typeDefImpl =
      getPageRepoDefImpl()
      .getBeanRepoDefImpl()
      .getTypeDefImpl(
        pagePath.getPagesPath().getTypeDef().getTypeName()
      );
    customizePageDefSource();
    this.introductionHTML = createIntroductionHTML();
    createHelpTopicDefsAndImpls();
  }

  PageRepoDefImpl getPageRepoDefImpl() {
    return pageRepoDefImpl;
  }

  BaseBeanTypeDefImpl getTypeDefImpl() {
    return typeDefImpl;
  }

  @Override
  public PagePath getPagePath() {
    return pagePath;
  }

  protected PageDefSource getSource() {
    return source;
  }

  @Override
  public LocalizableString getIntroductionHTML() {
    return introductionHTML;
  }

  @Override
  public LocalizableString getHelpPageTitle() {
    return helpPageTitle;
  }

  List<HelpTopicDefImpl> getHelpTopicDefImpls() {
    return helpTopicDefImpls;
  }

  @Override
  public List<HelpTopicDef> getHelpTopicDefs() {
    return helpTopicDefs;
  }

  List<PagePropertyDefImpl> getAllPropertyDefImpls() {
    return allPropertyDefImpls;
  }

  @Override
  public List<PagePropertyDef> getAllPropertyDefs() {
    return allPropertyDefs;
  }

  @Override
  public String getCustomizePageDefMethod() {
    return source.getCustomizePageDefMethod();
  }

  @Override
  public String getCustomizePageMethod() {
    return source.getCustomizePageMethod();
  }

  // If the page def source specifies the name of a java method
  // that can customize the page def source, call it.  That is,
  // we start off by reading in the PDY, then call some java code
  // that can adjust it.  For example, this is used for the
  // JDBCSystemResourceMBean's create form, which needs to add in
  // a bunch of stuff to support all of the different JDBC drivers
  // that WLS supports.
  private void customizePageDefSource() {
    String customizerName = source.getCustomizePageDefSourceMethod();
    if (StringUtils.isEmpty(customizerName)) {
      return;
    }
    Method method = CustomizerInvocationUtils.getMethod(customizerName);
    CustomizerInvocationUtils.checkSignature(method, Void.TYPE, PagePath.class, PageDefSource.class);
    List<Object> args = new ArrayList<>();
    args.add(pagePath);
    args.add(source);
    CustomizerInvocationUtils.invokeMethod(method, args);
  }

  protected void createUsedIfDefImpls() {
    for (PagePropertyDefImpl propertyDefImpl : allPropertyDefImpls) {
      propertyDefImpl.createUsedIfDefImpl();
    }
  }

  protected List<PagePropertyDefImpl> createPropertyDefImpls(
    List<BeanPropertyDefCustomizerSource> propertyCustomizerSources
  ) {
    return createPropertyDefImpls(propertyCustomizerSources, false);
  }

  protected List<PagePropertyDefImpl> createPropertyDefImpls(
    List<BeanPropertyDefCustomizerSource> propertyCustomizerSources,
    boolean searchSubTypes
  ) {
    List<PagePropertyDefImpl> rtn = new ArrayList<>();
    for (BeanPropertyDefCustomizerSource propertyCustomizerSource : propertyCustomizerSources) {
      PagePropertyDefImpl propDefImpl = getPropertyDefImpl(propertyCustomizerSource, searchSubTypes);
      if (propDefImpl != null) {
        rtn.add(propDefImpl);
      }
    }
    allPropertyDefImpls.addAll(rtn);
    allPropertyDefs = Collections.unmodifiableList(allPropertyDefImpls);
    return rtn;
  }

  private PagePropertyDefImpl getPropertyDefImpl(
    BeanPropertyDefCustomizerSource propertyCustomizerSource,
    boolean searchSubTypes
  ) {
    if (propertyCustomizerSource.getDefinition() == null) {
      // Find the property on the type
      BeanPropertyDefImpl beanPropertyDefImpl =
        getTypeDefImpl().getPropertyDefImpl(new Path(propertyCustomizerSource.getName()), searchSubTypes);
      if (beanPropertyDefImpl == null) {
        return null;
      }
      // Make a copy of the property and overlay any page-specific customizations
      return new PagePropertyDefImpl(this, beanPropertyDefImpl, propertyCustomizerSource);
    } else {
      // The property isn't on the type.  Instead the 'definition' in the PDY
      // gives the rest of the info about the property.
      // Copy over the name so that we don't need to specify it twice in the PDY:
      propertyCustomizerSource.getDefinition().setName(propertyCustomizerSource.getName());
      return new PagePropertyDefImpl(this, propertyCustomizerSource);
    }
  }

  private LocalizableString createIntroductionHTML() {
    String englishIntroductionHTML = getSource().getIntroductionHTML();
    if (StringUtils.isEmpty(englishIntroductionHTML)) {
      // This page doesn't provide an intro.  Use its type's description instead.
      return getTypeDefImpl().getDescriptionHTML();
    } else {
      return new LocalizableString(getLocalizationKey("introductionHTML"), englishIntroductionHTML);
    }
  }

  private void createHelpTopicDefsAndImpls() {
    int index = 0;
    for (HelpTopicDefSource helpTopicDefSource : getSource().getHelpTopics()) {
      getHelpTopicDefImpls().add(new HelpTopicDefImpl(this, helpTopicDefSource, index++));
    }
    helpTopicDefs = Collections.unmodifiableList(getHelpTopicDefImpls());
  }

  // This class's constuctor can't initialize the page help title since each
  // each derived class uses a different algorithm to compute the title
  // and since it would be cumbersome for the derived classes to pass the
  // title into this consructor.
  //
  // To minimize code duplication, this class handles storing and returning
  // the title.  It provide an abstract getEnglishHelpPageTitle method
  // that each derived class must implement.  It also provides an
  // initializeHelpPageTitle method that each derived class's constructor
  // must call after calling this class's constructor.  This method
  // calls the getEnglishHelpPageTitle to let the derived class compute
  // the appropriate english title, then creates a localizable string
  // from it.
  protected void initializeHelpPageTitle() {
    helpPageTitle =
      new LocalizableString(
        getLocalizationKey("helpPageTitle"),
        getEnglishHelpPageTitle(getTypeDefImpl().getInstanceName())
      );
  }

  protected abstract String getEnglishHelpPageTitle(String typeInstanceName);

  String getLocalizationKey(String key) {
    return getTypeDefImpl().getLocalizationKey(getPageKey() + "." + key);
  }

  protected abstract String getPageKey();

  SliceFormDefImpl asSliceFormDefImpl() {
    return (SliceFormDefImpl)this;
  }

  SliceTableDefImpl asSliceTableDefImpl() {
    return (SliceTableDefImpl)this;
  }

  CreateFormDefImpl asCreateFormDefImpl() {
    return (CreateFormDefImpl)this;
  }

  TableDefImpl asTableDefImpl() {
    return (TableDefImpl)this;
  }

  @Override
  public String toString() {
    return getPagePath().toString();
  }
}
