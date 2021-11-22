// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import weblogic.remoteconsole.common.repodef.BeanTypeCustomizerDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.utils.CustomizerSourceUtils;
import weblogic.remoteconsole.common.utils.CustomizerSourceUtils.Parameter;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.customizers.Source;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.Value;

/**
 * yaml-based implemetation of the BeanTypeCustomizerDef interface
 */
abstract class SourceAnnotatedCustomizerDefImpl extends CustomizerDefImpl implements BeanTypeCustomizerDef {

  private BaseBeanTypeDefImpl typeDefImpl;

  // Source annotations are relative to the bean that configured the customizer,
  // v.s. the bean in the invocation context, which might be a parent of that bean.
  // containedBeanPath is the relative path from the bean in the invocation context to
  // the bean that configured the customizer.
  private Path containedBeanPath;

  private static final Type INVOCATION_CONTEXT_TYPE = InvocationContext.class;

  private static final Type SETTABLE_PROPERTY_ARGUMENT_TYPE = SettableValue.class;
  private static final Type NONSETTABLE_PROPERTY_ARGUMENT_TYPE = Value.class;
  
  private static final Type SETTABLE_COLLECTION_ARGUMENT_TYPE =
    (new TypeReference<List<Map<String,SettableValue>>>() {}).getType();
  private static final Type NONSETTABLE_COLLECTION_ARGUMENT_TYPE =
    (new TypeReference<List<Map<String,Value>>>() {}).getType();

  SourceAnnotatedCustomizerDefImpl(
    BaseBeanTypeDefImpl typeDefImpl,
    Path containedBeanPath,
    String methodName
  ) {
    super(methodName);
    this.typeDefImpl = typeDefImpl;
    this.containedBeanPath = containedBeanPath;
  }

  BaseBeanTypeDefImpl getTypeDefImpl() {
    return typeDefImpl;
  }

  @Override
  public BeanTypeDef getTypeDef() {
    return getTypeDefImpl();
  }

  // Whether this customizer's @Source params should be SettableValues or Values
  protected abstract boolean isSettableParams();

  @Override
  protected List<ParamDefImpl> createParamDefImpls() {
    List<ParamDefImpl> argumentDefImpls = new ArrayList<>();
    for (Parameter parameter : CustomizerSourceUtils.getParameters(getMethod())) {
      ParamDefImpl argumentDefImpl = createParamDefImpl(parameter);
      if (argumentDefImpl == null) {
        throw new AssertionError(getMethodName() + " " + parameter + ": unsupported argument");
      }
      argumentDefImpls.add(argumentDefImpl);
    }
    return argumentDefImpls;
  }

  protected ParamDefImpl createParamDefImpl(Parameter parameter) {
    Source source = parameter.getSource();
    if (source == null) {
      return createBuiltinParamDefImpl(parameter);
    } else {
      return createSourceParamDefImpl(parameter);
    }
  }

  protected ParamDefImpl createBuiltinParamDefImpl(Parameter parameter) {
    if (INVOCATION_CONTEXT_TYPE.equals(parameter.getType())) {
      return new InvocationContextParamDefImpl(this);
    }
    return null;
  }

  protected ParamDefImpl createSourceParamDefImpl(Parameter parameter) {
    if (StringUtils.notEmpty(parameter.getSource().collection())) {
      return createCollectionParamDefImpl(parameter);
    } else {
      return createPropertyParamDefImpl(parameter);
    }
  }

  private CollectionParamDefImpl createCollectionParamDefImpl(Parameter parameter) {
    Type expectedType =
      (isSettableParams()) ? SETTABLE_COLLECTION_ARGUMENT_TYPE : NONSETTABLE_COLLECTION_ARGUMENT_TYPE;
    verifyParamType(expectedType, parameter);
    BaseBeanChildDefImpl collectionDefImpl = getCollectionDefImpl(parameter);
    return
      new CollectionParamDefImpl(
        this,
        findCollectionPath(parameter),
        collectionDefImpl,
        findCollectionPropertyDefImpls(parameter, collectionDefImpl.getChildTypeDefImpl())
     );
  }

  private List<BeanPropertyDefImpl> findCollectionPropertyDefImpls(
    Parameter parameter,
    BaseBeanTypeDefImpl typeDefImpl
  ) {
    List<BeanPropertyDefImpl> propertyDefImpls = new ArrayList<>();
    for (String property : parameter.getSource().properties()) {
      propertyDefImpls.add(findPropertyDefImpl(parameter, typeDefImpl, new Path(), property));
    }
    return propertyDefImpls;
  }

  private boolean isRelativeCollectionPath(Parameter parameter) {
    return !parameter.getSource().collection().startsWith("/");
  }

  private Path findCollectionPath(Parameter parameter) {
    if (isRelativeCollectionPath(parameter)) {
      return new Path();
    } else {
      return getCollectionPath(parameter);
    }
  }

  private Path getCollectionPath(Parameter parameter) {
    return new Path(parameter.getSource().collection().replaceAll("/", "."));
  }

  private BaseBeanChildDefImpl getCollectionDefImpl(Parameter parameter) {
    boolean searchSubTypes = true;
    BaseBeanChildDefImpl childDefImpl = null;
    if (isRelativeCollectionPath(parameter)) {
      Path collectionPath = containedBeanPath.childPath(getCollectionPath(parameter));
      childDefImpl = findChildDefImpl(parameter, getTypeDefImpl(), collectionPath);
    } else {
      BaseBeanTypeDefImpl typeDefImpl =
        getTypeDefImpl().getBeanRepoDefImpl().getRootTypeDefImpl();
      for (String childName : getCollectionPath(parameter).getComponents()) {
        childDefImpl = findChildDefImpl(parameter, typeDefImpl, new Path(childName));
        typeDefImpl = childDefImpl.getChildTypeDefImpl();
      }
    }
    if (!childDefImpl.isCollection()) {
      throw
        new AssertionError(
          getMethodName() + " " + parameter + " " + childDefImpl + " is not a collection"
        );
    }
    return childDefImpl;
  }

  private BaseBeanChildDefImpl findChildDefImpl(Parameter parameter, BaseBeanTypeDefImpl typeDefImpl, Path childPath) {
    boolean searchSubTypes = true;
    if (!typeDefImpl.hasChildDef(childPath, searchSubTypes)) {
      throw new AssertionError(getMethodName() + " " + parameter + " " + typeDefImpl + " cannot find " + childPath);
    }
    return typeDefImpl.getChildDefImpl(childPath, searchSubTypes);
  }

  private PropertyParamDefImpl createPropertyParamDefImpl(Parameter parameter) {
    Type expectedType =
      (isSettableParams()) ? SETTABLE_PROPERTY_ARGUMENT_TYPE : NONSETTABLE_PROPERTY_ARGUMENT_TYPE;
    verifyParamType(expectedType, parameter);
    Source source = parameter.getSource();
    if (source.properties() != null && source.properties().length > 0) {
      throw new AssertionError(
        getMethodName() + " " + parameter
        + " must not specify properties since it does not specify collection"
      );
    }
    if (StringUtils.isEmpty(source.property())) {
      throw new AssertionError(getMethodName() + " " + parameter + " must specify property");
    }
    BeanPropertyDefImpl argumentPropertyDefImpl =
      findPropertyDefImpl(
        parameter,
        getTypeDefImpl(),
        containedBeanPath,
        source.property()
      );
    return new PropertyParamDefImpl(this, argumentPropertyDefImpl);
  }

  private BeanPropertyDefImpl findPropertyDefImpl(
    Parameter parameter,
    BaseBeanTypeDefImpl typeDefImpl,
    Path pathPrefix,
    String property
  ) {
    Path propertyPath = pathPrefix.childPath(new Path(property));
    boolean searchSubTypes = true;
    if (!typeDefImpl.hasPropertyDef(propertyPath, searchSubTypes)) {
      // This is either because the @Source annotation is broken or
      // because the annotation is referring to a property that exists
      // in the current WLS version, but not this WLS version.
      // For now, assume it's because the annotation is broken.
      throw new AssertionError(getMethodName() + " " + parameter + " can't find " + property);
    }
    return typeDefImpl.getPropertyDefImpl(propertyPath, searchSubTypes);
  }

  private void verifyParamType(Type typeWant, Parameter parameter) {
    if (!typeWant.equals(parameter.getType())) {
      throw new AssertionError(getMethodName() + " " + parameter + " must return a " + typeWant);
    }
  }
}
