// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import weblogic.console.schema.beaninfo.BeanActionDefSource;
import weblogic.console.schema.beaninfo.BeanActionParamDefSource;
import weblogic.console.schema.beaninfo.BeanTypeDefSource;
import weblogic.console.utils.Path;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.BeanActionParamDef;
import weblogic.remoteconsole.common.repodef.BeanRepoDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.schema.BeanActionDefCustomizerSource;
import weblogic.remoteconsole.common.repodef.schema.BeanActionParamDefCustomizerSource;

/**
 * yaml-based implemetation of the BeanActionDef interface
 */
public class BeanActionDefImpl extends BeanValueDefImpl implements BeanActionDef {

  private BaseBeanTypeDefImpl typeDefImpl;
  private Path parentPath;
  private BeanActionDefSource source;
  private BeanActionDefCustomizerSource customizerSource;
  private List<BeanActionParamDefImpl> paramDefImpls = new ArrayList<>();
  private List<BeanActionParamDef> paramDefs;
  private boolean initializedRoles = false;
  private Set<String> invokeRoles;

  BeanActionDefImpl(
    BaseBeanTypeDefImpl typeDefImpl,
    Path parentPath,
    BeanActionDefSource source,
    BeanActionDefCustomizerSource customizerSource
  ) {
    super(typeDefImpl, source, customizerSource);
    this.typeDefImpl = typeDefImpl;
    this.parentPath = parentPath.clone();
    this.source = source;
    this.customizerSource = customizerSource;
    initializeParams();
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
          BeanActionDefSource actionSource = getSource();
          invokeRoles = RoleUtils.computeInvokeRoles(typeSource, actionSource);
          initializedRoles = true;
        }
      }
    }
  }

  private void initializeParams() {
    for (BeanActionParamDefSource paramSource : source.getParameters()) {
      paramDefImpls.add(new BeanActionParamDefImpl(this, paramSource, getParamCustomizer(paramSource)));
    }
    paramDefs = Collections.unmodifiableList(paramDefImpls);
  }

  private BeanActionParamDefCustomizerSource getParamCustomizer(BeanActionParamDefSource paramSource) {
    for (BeanActionParamDefCustomizerSource customizer : customizerSource.getParameters()) {
      if (paramSource.getName().equals(customizer.getName())) {
        return customizer;
      }
    }
    return new BeanActionParamDefCustomizerSource();
  }

  BaseBeanTypeDefImpl getTypeDefImpl() {
    return typeDefImpl;
  }

  @Override
  public BeanTypeDef getTypeDef() {
    return getTypeDefImpl();
  }

  @Override
  public String getActionName() {
    return getSource().getName();
  }

  @Override
  public String getRemoteActionName() {
    String remoteName = source.getRemoteName();
    if (StringUtils.isEmpty(remoteName)) {
      return getActionName();
    } else {
      return remoteName;
    }
  }

  @Override
  public Path getParentPath() {
    return parentPath;
  }

  List<BeanActionParamDefImpl> getParamDefImpls() {
    return paramDefImpls;
  }

  public BeanActionParamDefImpl getParamDefImpl(String paramName) {
    return (BeanActionParamDefImpl)getParamDef(paramName);
  }

  @Override
  public List<BeanActionParamDef> getParamDefs() {
    return paramDefs;
  }

  @Override
  public boolean isAsynchronous() {
    if (!isReference()) {
      return false;
    }
    if (isArray()) {
      return false;
    }
    BeanRepoDef repoDef = getTypeDef().getBeanRepoDef();
    BeanTypeDef refTypeDef = getReferenceTypeDef();
    if (refTypeDef.isTypeDef(repoDef.getTypeDef("TaskRuntimeMBean"))) {
      return true;
    }
    if (refTypeDef.isTypeDef(repoDef.getTypeDef("DeploymentProgressObjectMBean"))) {
      return true;
    }
    return false;
  }

  @Override
  public Set<String> getInvokeRoles() {
    initializeRoles();
    return invokeRoles;
  }

  @Override
  public String getImpact() {
    return source.getImpact().toString();
  }

  BeanActionDefSource getSource() {
    return source;
  }

  BeanActionDefCustomizerSource getCustomizerSource() {
    return customizerSource;
  }

  String getLocalizationKey(String key) {
    return
      getTypeDefImpl().getLocalizationKey(
        "actions." + getActionPath().getDotSeparatedPath() + "." + key
      );
  }

  BeanActionParamDefImpl getActionParamDefImpl(String paramName) {
    for (BeanActionParamDefImpl paramDefImpl : paramDefImpls) {
      if (paramDefImpl.getParamName().equals(paramName)) {
        return paramDefImpl;
      }
    }
    throw new AssertionError("Can't find param " + this + " " + paramName);
  }

  @Override
  public String toString() {
    return getTypeDef() + ", action=" + getActionPath();
  }
}
