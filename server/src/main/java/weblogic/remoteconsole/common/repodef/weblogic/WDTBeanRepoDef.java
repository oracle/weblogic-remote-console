// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.weblogic;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.schema.BeanChildDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefSource;
import weblogic.remoteconsole.common.repodef.schema.PseudoBeanTypeDefSource;
import weblogic.remoteconsole.common.repodef.yaml.BaseBeanTypeDefImpl;
import weblogic.remoteconsole.common.repodef.yaml.BeanChildDefImpl;
import weblogic.remoteconsole.common.repodef.yaml.BeanPropertyDefImpl;
import weblogic.remoteconsole.common.repodef.yaml.BeanRepoDefImpl;
import weblogic.remoteconsole.common.repodef.yaml.NormalBeanTypeDefImpl;
import weblogic.remoteconsole.common.repodef.yaml.PseudoBeanTypeDefImpl;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;

/**
 * Defines the bean types for WDT
 */
public class WDTBeanRepoDef extends WebLogicBeanRepoDef {

  @Override
  protected boolean isEditable() {
    return true;
  }

  @Override
  protected String[] getRootChildNames() {
    return new String[] { "DomainMBean" };
  }

  public WDTBeanRepoDef(WebLogicMBeansVersion mbeansVersion) {
    super(mbeansVersion);
    createRootTypeDefImpl();
  }

  @Override
  protected NormalBeanTypeDefImpl createNormalBeanTypeDefImpl(BeanTypeDefSource typeDefSource) {
    return new WDTNormalBeanTypeDefImpl(this, typeDefSource);
  }

  @Override
  protected PseudoBeanTypeDefImpl createPseudoBeanTypeDefImpl(PseudoBeanTypeDefSource pseudoTypeDefSource) {
    return new WDTPseudoBeanTypeDefImpl(this, pseudoTypeDefSource);
  }

  private static class WDTNormalBeanTypeDefImpl extends NormalBeanTypeDefImpl {
    private WDTNormalBeanTypeDefImpl(
      BeanRepoDefImpl beanRepoDefImpl,
      BeanTypeDefSource source
    ) {
      super(beanRepoDefImpl, source);
    }

    @Override
    protected BeanPropertyDefImpl createBeanPropertyDefImpl(
      Path parentPath,
      BeanPropertyDefSource source,
      BeanPropertyDefCustomizerSource customizerSource
    ) {
      return new WDTBeanPropertyDefImpl(this, parentPath, source, customizerSource);
    }

    @Override
    protected BeanChildDefImpl createBeanChildDefImpl(
      Path parentPath,
      BeanPropertyDefSource source,
      BeanChildDefCustomizerSource customizerSource
    ) {
      return new WDTBeanChildDefImpl(this, parentPath, source, customizerSource);
    }

    @Override
    protected boolean isSupported(BeanPropertyDefSource source) {
      // The WLS REST api omits properties for a variety of reasons:
      //
      // - because the property is excluded or obsolete
      //
      // - because the property was deprecated before the first version of the WLS REST api
      //
      // - because the property is explictly excluded from the REST api
      //   (usually because the property's type isn't supported by REST, e.g. List, Map, CompositeData)
      //
      // WDT doesn't have all these restrictions.  For example, it supports
      // properties that were deprecated before the first version of the WLS REST api.
      //
      // Today, our pages only include properties that are supported by the WLS REST api.
      // However, when we read in a WDT model, it can include some properties that the
      // WLS REST api doesn't support, and needs to be able to write them back out,
      // even though the user can never see them on the pages.  To do this, it needs
      // the typing info for these properties.
      //
      // So, for WDT, expose all of the properties except for obsolete and
      // excluded ones (since WDT doesn't support them).
      return !source.isExclude() && StringUtils.isEmpty(source.getObsolete());
    }
  }

  private static class WDTPseudoBeanTypeDefImpl extends PseudoBeanTypeDefImpl {
    private WDTPseudoBeanTypeDefImpl(
      BeanRepoDefImpl beanRepoDefImpl,
      PseudoBeanTypeDefSource source
    ) {
      super(beanRepoDefImpl, source);
    }

    @Override
    protected BeanPropertyDefImpl createBeanPropertyDefImpl(
      Path parentPath,
      BeanPropertyDefSource source,
      BeanPropertyDefCustomizerSource customizerSource
    ) {
      return new WDTBeanPropertyDefImpl(this, parentPath, source, customizerSource);
    }

    @Override
    protected BeanChildDefImpl createBeanChildDefImpl(
      Path parentPath,
      BeanPropertyDefSource source,
      BeanChildDefCustomizerSource customizerSource
    ) {
      return new WDTBeanChildDefImpl(this, parentPath, source, customizerSource);
    }
  }

  private static class WDTBeanPropertyDefImpl extends BeanPropertyDefImpl {
    private WDTBeanPropertyDefImpl(
      BaseBeanTypeDefImpl typeDefImpl,
      Path parentPath,
      BeanPropertyDefSource source,
      BeanPropertyDefCustomizerSource customizerSource
    ) {
      super(typeDefImpl, parentPath, source, customizerSource);
    }

    private WDTBeanPropertyDefImpl(
      BeanPropertyDefImpl toClone,
      BeanPropertyDefCustomizerSource customizerSource
    ) {
      super(toClone, customizerSource);
    }
  
    @Override
    public BeanPropertyDefImpl clone(BeanPropertyDefCustomizerSource customizerSource) {
      return new WDTBeanPropertyDefImpl(this, customizerSource);
    }

    @Override
    public boolean isCreateWritable() {
      if (isDomainMBeanName()) {
        // Force the DomainMBean Name property to be create writable in WDT.
        return true;
      }
      return super.isCreateWritable();
    }

    @Override
    public boolean isUpdateWritable() {
      if (isDomainMBeanName()) {
        // Force the DomainMBean Name property to be update writable in WDT.
        return true;
      }
      if (
        isProperty("AppDeploymentMBean", "SourcePath")
          || isProperty("AppDeploymentMBean", "PlanPath")
          || isProperty("LibraryMBean", "SourcePath")
      ) {
        // Force the deployment paths to be update writable in WDT.
        return true;
      }
      return super.isUpdateWritable();
    }

    @Override
    public boolean isRestartNeeded() {
      return false;
    }
  
    @Override public boolean isSupportsUnresolvedReferences() {
      if (!isReference()) {
        return false;
      }
      return true;
    }

    @Override
    public boolean isSupportsModelTokens() {
      if (isKeyPropertyDef()) {
        // Since this property identifies a child in a collection, it can't be a model token.
        return false;
      }
      if (isSubTypeDiscriminatorPropertyDef()) {
        // Since this property identifies the sub type, it can't be a model token.
        return false;
      }
      if (getCustomizerSource().isSupportsModelTokensSpecifiedInYaml()) {
        // This property is explictly configured to either support or not support
        // model tokens.  Honor it.
        return getCustomizerSource().isSupportsModelTokens();
      }
      return true;
    }
  
    private boolean isKeyPropertyDef() {
      if (getTypeDef() == null) {
        return false;
      }
      BeanPropertyDef keyPropDef = getTypeDef().getKeyPropertyDef();
      if (keyPropDef == null) {
        return false;
      }
      return getPropertyPath().equals(keyPropDef.getPropertyPath());
    }

    private boolean isSubTypeDiscriminatorPropertyDef() {
      if (getTypeDef() == null) {
        return false;
      }
      BeanPropertyDef discPropDef = getTypeDef().getSubTypeDiscriminatorPropertyDef();
      if (discPropDef == null) {
        return false;
      }
      return getPropertyPath().equals(discPropDef.getPropertyPath());
    }

    private boolean isDomainMBeanName() {
      return isProperty("DomainMBean", "Name");
    }

    private boolean isProperty(String typeName, String propertyName) {
      return typeName.equals(getTypeDef().getTypeName()) && propertyName.equals(getPropertyName());
    }
  }

  private static class WDTBeanChildDefImpl extends BeanChildDefImpl {
    private WDTBeanChildDefImpl(
      BaseBeanTypeDefImpl typeDefImpl,
      Path parentPath,
      BeanPropertyDefSource source,
      BeanChildDefCustomizerSource customizerSource
    ) {
      super(typeDefImpl, parentPath, source, customizerSource);
    }

    @Override
    public boolean isCreatable() {
      boolean creatable = super.isCreatable();
      if (creatable) {
        return true;
      }
      if (isEditable() && isOptional()) {
        // force non-creatable optional singletons to be creatable
        return true;
      }
      return false;
    }
  }
}
