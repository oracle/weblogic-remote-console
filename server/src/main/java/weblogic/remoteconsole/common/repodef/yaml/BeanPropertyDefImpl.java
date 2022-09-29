// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.Set;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.GetPropertyOptionsCustomizerDef;
import weblogic.remoteconsole.common.repodef.GetPropertyValueCustomizerDef;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefCustomizerSource.Writable;
import weblogic.remoteconsole.common.repodef.schema.BeanPropertyDefSource;
import weblogic.remoteconsole.common.repodef.schema.BeanTypeDefSource;
import weblogic.remoteconsole.common.repodef.schema.DefaultValueDefSource;
import weblogic.remoteconsole.common.repodef.schema.ValueDefSource;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.ArrayValue;
import weblogic.remoteconsole.server.repo.BooleanValue;
import weblogic.remoteconsole.server.repo.DoubleValue;
import weblogic.remoteconsole.server.repo.IntValue;
import weblogic.remoteconsole.server.repo.LongValue;
import weblogic.remoteconsole.server.repo.NullReference;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.UnknownValue;
import weblogic.remoteconsole.server.repo.Value;

/**
 * yaml-based implementation of the BeanPropertyDef interface.
 */
public class BeanPropertyDefImpl extends BeanValueDefImpl implements BeanPropertyDef {
  private BaseBeanTypeDefImpl typeDefImpl;
  private Path parentPath;
  private BeanPropertyDefSource source;
  private BeanPropertyDefCustomizerSource customizerSource;
  private GetPropertyOptionsCustomizerDefImpl getOptionsCustomizerDefImpl;
  private GetPropertyValueCustomizerDefImpl getValueCustomizerDefImpl;
  private boolean initializedRoles = false;
  private Set<String> getRoles;
  private Set<String> setRoles;

  public BeanPropertyDefImpl(
    BaseBeanTypeDefImpl typeDefImpl,
    Path parentPath,
    BeanPropertyDefSource source,
    BeanPropertyDefCustomizerSource customizerSource
  ) {
    super(typeDefImpl, source, customizerSource);
    this.typeDefImpl = typeDefImpl;
    this.parentPath = parentPath.clone();
    this.source = source;
    this.customizerSource = customizerSource;
  }

  protected BeanPropertyDefImpl(
    BeanPropertyDefImpl toClone,
    BeanPropertyDefCustomizerSource customizerSource
  ) {
    this(toClone.getTypeDefImpl(), toClone.getParentPath(), toClone.getSource(), customizerSource);
  }

  public BeanPropertyDefImpl clone(BeanPropertyDefCustomizerSource customizerSource) {
    return new BeanPropertyDefImpl(this, customizerSource);
  }

  // Initialize roles on first use instead of the constructor
  // to prevent infinite loops (caused by types that refer to themselves)
  private void initializeRoles() {
    if (!initializedRoles) {
      synchronized (this) {
        if (!initializedRoles) {
          BaseBeanTypeDefImpl immediateType =
            getParentPath().isEmpty()
            ? getTypeDefImpl()
            : getTypeDefImpl().getChildDefImpl(getParentPath()).getChildTypeDefImpl();
          BeanTypeDefSource typeSource = immediateType.asYamlBasedBeanTypeDefImpl().getTypeDefSource();
          BeanPropertyDefSource propertySource = getSource();
          getRoles = RoleUtils.computeGetRoles(typeSource, propertySource);
          setRoles = RoleUtils.computeSetRoles(typeSource, propertySource);
          initializedRoles = true;
        }
      }
    }
  }

  BaseBeanTypeDefImpl getTypeDefImpl() {
    return typeDefImpl;
  }

  @Override
  public BeanTypeDef getTypeDef() {
    return getTypeDefImpl();
  }

  @Override
  public String getPropertyName() {
    return getSource().getName();
  }

  @Override
  public String getFormPropertyName() {
    String formName = getCustomizerSource().getFormName();
    if (StringUtils.isEmpty(formName)) {
      return getPropertyPath().getUnderscoreSeparatedPath();
    } else {
      return (new Path(formName)).getUnderscoreSeparatedPath();
    }
  }

  @Override
  public String getOnlinePropertyName() {
    String onlineName = getCustomizerSource().getOnlineName();
    if (StringUtils.isEmpty(onlineName)) {
      return StringUtils.getRestName(getPropertyName());
    }
    return onlineName;
  }

  @Override
  public String getOfflinePropertyName() {
    String offlineName = getCustomizerSource().getOfflineName();
    if (StringUtils.isEmpty(offlineName)) {
      if (getSource().isEncrypted()) {
        offlineName = getPropertyName() + "Encrypted";
      } else if (isArray()) {
        offlineName = StringUtils.getSingular(getPropertyName());
      } else {
        offlineName = getPropertyName();
      }
    }
    return offlineName;
  }

  @Override
  public Path getParentPath() {
    return parentPath;
  }

  @Override
  public boolean isOrdered() {
    if (!isArray()) {
      return false;
    } else {
      return getCustomizerSource().isOrdered();
    }
  }
  
  // Allows the type to force the Name property to be the key property if
  // it wasn't annotated that way in the WLS mbeans and no other property
  // on the type is the key property
  void setKey(boolean val) {
    getSource().setKey(val);
  }

  @Override
  public boolean isKey() {
    return getSource().isKey();
  }

  public boolean isCreateWritable() {
    if (!getTypeDefImpl().isEditable()) {
      return false;
    }
    if (!getTypeDefImpl().getBeanRepoDefImpl().isAccessAllowed(getSetRoles())) {
      return false;
    }
    Writable writable = getCustomizerSource().getWritable();
    if (Writable.always == writable || Writable.createOnly == writable) {
      return true;
    } else if (Writable.never == writable) {
      return false;
    } else {
      return getSource().isWritable();
    }
  }

  public boolean isUpdateWritable() {
    if (!getTypeDefImpl().isEditable()) {
      return false;
    }
    if (!getTypeDefImpl().getBeanRepoDefImpl().isAccessAllowed(getSetRoles())) {
      return false;
    }
    Writable writable = getCustomizerSource().getWritable();
    if (Writable.always == writable) {
      return true;
    } else if (Writable.never == writable || Writable.createOnly == writable) {
      return false;
    } else {
      return getSource().isWritable();
    }
  }

  @Override
  public boolean isRequired() {
    if (getCustomizerSource().isRequired() || getCustomizerSource().isRequiredSpecifiedInYaml()) {
      return getCustomizerSource().isRequired();
    }
    BeanPropertyDef keyPropertyDef = getTypeDef().getKeyPropertyDef();
    if (keyPropertyDef != null) {
      if (getPropertyPath().equals(keyPropertyDef.getPropertyPath())) {
        return true;
      }
    }
    return false;
  }

  // customizers - static function names

  @Override
  public GetPropertyValueCustomizerDef getGetValueCustomizerDef() {
    if (StringUtils.isEmpty(getCustomizerSource().getGetMethod())) {
      return null;
    }
    if (getValueCustomizerDefImpl == null) {
      // Don't initialize this during the constructor
      // since the various property defs referenced by this
      // customizer's arguments might not exist yet and
      // initializing them in the constructor might
      // cause cyclic dependencies.
      synchronized (this) {
        if (getValueCustomizerDefImpl == null) {
          getValueCustomizerDefImpl = new GetPropertyValueCustomizerDefImpl(this);
        }
      }
    }
    return getValueCustomizerDefImpl;
  }

  @Override
  public GetPropertyOptionsCustomizerDef getGetOptionsCustomizerDef() {
    if (StringUtils.isEmpty(getCustomizerSource().getOptionsMethod())) {
      return null;
    }
    if (getOptionsCustomizerDefImpl == null) {
      // Don't initialize this during the constructor
      // since the various property defs referenced by this
      // customizer's arguments might not exist yet and
      // initializing them in the constructor might
      // cause cyclic dependencies.
      synchronized (this) {
        if (getOptionsCustomizerDefImpl == null) {
          getOptionsCustomizerDefImpl = new GetPropertyOptionsCustomizerDefImpl(this);
        }
      }
    }
    return getOptionsCustomizerDefImpl;
  }

  @Override
  public boolean isRestartNeeded() {
    return getSource().isRestartNeeded();
  }

  @Override public boolean isSupportsModelTokens() {
    return false;
  }

  @Override public boolean isSupportsUnresolvedReferences() {
    return false;
  }

  @Override
  public Value getSecureDefaultValue() {
    DefaultValueDefSource dfltSource = getSource().getDefaultValue();
    if (dfltSource != null && !dfltSource.isDerivedDefault()) {
      ValueDefSource valSource = dfltSource.getSecureModeValue();
      if (valSource != null) {
        return fixDefaultValue(ValueUtils.createValue(valSource.getValue()));
      }
    }
    return UnknownValue.INSTANCE;
  }

  @Override
  public Value getProductionDefaultValue() {
    DefaultValueDefSource dfltSource = getSource().getDefaultValue();
    if (dfltSource != null && !dfltSource.isDerivedDefault()) {
      ValueDefSource valSource = dfltSource.getProductionModeValue();
      if (valSource != null) {
        return fixDefaultValue(ValueUtils.createValue(valSource.getValue()));
      }
    }
    return UnknownValue.INSTANCE;
  }

  @Override
  public Value getStandardDefaultValue() {
    DefaultValueDefSource dfltSource = getSource().getDefaultValue();
    if (dfltSource == null || dfltSource.isDerivedDefault()) {
      return UnknownValue.INSTANCE;
    }
    ValueDefSource valSource = dfltSource.getValue();
    if (valSource != null) {
      return fixDefaultValue(ValueUtils.createValue(valSource.getValue()));
    }
    return getDefaultValueForType();
  }

  private Value fixDefaultValue(Value defaultValue) {
    if (isReferenceAsReferences()) {
      return NullReference.INSTANCE;
    }
    if (isDateAsLong()) {
      return UnknownValue.INSTANCE;
    }
    return defaultValue;
  }

  private Value getDefaultValueForType() {
    if (isReferenceAsReferences()) {
      return NullReference.INSTANCE;
    }
    if (isArray()) {
      return new ArrayValue(new ArrayList<Value>());
    }
    if (isDateAsLong()) {
      return UnknownValue.INSTANCE;
    }
    if (isString()) {
      return new StringValue(null);
    }
    if (isBoolean()) {
      return new BooleanValue(false);
    }
    if (isInt()) {
      return new IntValue(0);
    }
    if (isLong()) {
      return new LongValue(0);
    }
    if (isDouble()) {
      return new DoubleValue(0);
    }
    if (isReference()) {
      return NullReference.INSTANCE;
    }
    return UnknownValue.INSTANCE;
  }

  @Override
  public Set<String> getGetRoles() {
    initializeRoles();
    return getRoles;
  }

  @Override
  public Set<String> getSetRoles() {
    initializeRoles();
    return setRoles;
  }

  protected BeanPropertyDefSource getSource() {
    return source;
  }

  protected BeanPropertyDefCustomizerSource getCustomizerSource() {
    return customizerSource;
  }

  String getLocalizationKey(String key) {
    return
      getTypeDefImpl().getLocalizationKey(
        "properties." + getPropertyPath().getDotSeparatedPath() + "." + key
      );
  }

  @Override
  public String toString() {
    return getTypeDef() + ", property=" + getPropertyPath();
  }
}
