// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.yaml;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import weblogic.console.schema.beaninfo.BeanValueDefSource;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.BeanValueDef;
import weblogic.remoteconsole.common.repodef.schema.BeanValueDefCustomizerSource;
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
 * yaml-based implementation of the BeanValueDef interface.
 */
class BeanValueDefImpl implements BeanValueDef {

  private static final Logger LOGGER = Logger.getLogger(BeanValueDefImpl.class.getName());

  BaseBeanTypeDefImpl typeDefImpl;
  private BeanValueDefSource source;
  private BeanValueDefCustomizerSource customizerSource;
  private static Map<String, ValueKind> javaTypeToValueKind = new HashMap<>();

  static {
    javaTypeToValueKind.put("java.lang.String", ValueKind.STRING);
    javaTypeToValueKind.put("int", ValueKind.INT);
    javaTypeToValueKind.put("java.lang.Integer", ValueKind.INT);
    javaTypeToValueKind.put("long", ValueKind.LONG);
    javaTypeToValueKind.put("java.lang.Long", ValueKind.LONG);
    javaTypeToValueKind.put("double", ValueKind.DOUBLE);
    javaTypeToValueKind.put("java.lang.Double", ValueKind.DOUBLE);
    javaTypeToValueKind.put("boolean", ValueKind.BOOLEAN);
    javaTypeToValueKind.put("java.lang.Boolean", ValueKind.BOOLEAN);
    javaTypeToValueKind.put("java.util.Date", ValueKind.DATE);
    javaTypeToValueKind.put("java.util.Properties", ValueKind.PROPERTIES);
    javaTypeToValueKind.put("java.lang.Throwable", ValueKind.THROWABLE);
    javaTypeToValueKind.put("java.lang.Exception", ValueKind.THROWABLE);
    javaTypeToValueKind.put("java.lang.RuntimeException", ValueKind.THROWABLE);
    javaTypeToValueKind.put("java.io.InputStream", ValueKind.FILE_CONTENTS);
    javaTypeToValueKind.put("weblogic.health.HealthState", ValueKind.HEALTH_STATE);
    javaTypeToValueKind.put("EntitleNetExpression", ValueKind.ENTITLE_NET_EXPRESSION);
    javaTypeToValueKind.put("void", ValueKind.VOID);
  }

  BeanValueDefImpl(
    BaseBeanTypeDefImpl typeDefImpl,
    BeanValueDefSource source,
    BeanValueDefCustomizerSource customizerSource
  ) {
    this.typeDefImpl = typeDefImpl;
    this.source = source;
    this.customizerSource = customizerSource;
  }

  boolean isSupportedType() {
    return getValueKindOrNull() != null;
  }

  @Override
  public ValueKind getValueKind() {
    ValueKind kind = getValueKindOrNull();
    if (kind != null) {
      return kind;
    }
    throw configurationError("unsupported value type: " + getJavaType());
  }

  ValueKind getValueKindOrNull() {
    if (source.isReference()) {
      return ValueKind.REFERENCE;
    }
    if (isDateAsLong()) {
      return ValueKind.DATE;
    }
    String javaType = getJavaType();
    ValueKind kind = javaTypeToValueKind.get(javaType);
    if (ValueKind.STRING == kind && source.isSecret()) {
      return ValueKind.SECRET;
    }
    return kind;
  }

  @Override
  public boolean isArray() {
    return source.isArray();
  }

  @Override
  public boolean isOrdered() {
    if (!isArray()) {
      return false;
    } else {
      return customizerSource.isOrdered();
    }
  }

  @Override
  public boolean isMultiLineString() {
    if (customizerSource.isMultiLineString()) {
      ValueKind kind = javaTypeToValueKind.get(getJavaType());
      if ((ValueKind.STRING == kind) && !isArray()) {
        return true;
      } else {
        throw configurationError("specified multiLineString on a property that is not a string");
      }
    }
    return false;
  }

  @Override
  public boolean isDynamicEnum() {
    if (customizerSource.isDynamicEnum()) {
      ValueKind kind = javaTypeToValueKind.get(getJavaType());
      if ((ValueKind.STRING == kind) && !isArray()) {
        return true;
      } else {
        throw configurationError("specified dynamicEnum on a property that is not a string");
      }
    }
    return false;
  }

  @Override
  public BeanTypeDef getReferenceTypeDef() {
    if (isReference()) {
      return typeDefImpl.getBeanRepoDef().getTypeDef(StringUtils.getLeafClassName(getJavaType()));
    } else {
      return null;
    }
  }

  @Override
  public boolean isReferenceAsReferences() {
    if (customizerSource.isReferenceAsReferences()) {
      if (isReference() && isArray()) {
        return true;
      } else {
        throw configurationError("specified referenceAsReferences on a property that is an array of references");
      }
    }
    return false;
  }

  @Override
  public boolean isDateAsLong() {
    if (customizerSource.isDateAsLong()) {
      ValueKind kind = javaTypeToValueKind.get(getJavaType());
      if ((ValueKind.LONG == kind) && !isArray()) {
        return true;
      } else {
        throw configurationError("specified dateAsLong on a property that is not a long");
      }
    }
    return false;
  }

  protected Value getDefaultValueForType() {
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

  private String getJavaType() {
    return source.getType();
  }

  protected Error configurationError(String problem) {
    String msg = "Configuration Error: " + this + " : " + problem;
    LOGGER.severe(msg);
    return new AssertionError(msg);
  }
}
