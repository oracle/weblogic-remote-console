// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.TreeMap;
import java.util.logging.Logger;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.Localizer;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.ArrayValue;
import weblogic.remoteconsole.server.repo.BooleanValue;
import weblogic.remoteconsole.server.repo.DateAsLongValue;
import weblogic.remoteconsole.server.repo.DoubleValue;
import weblogic.remoteconsole.server.repo.IntValue;
import weblogic.remoteconsole.server.repo.LongValue;
import weblogic.remoteconsole.server.repo.ModelToken;
import weblogic.remoteconsole.server.repo.NullReference;
import weblogic.remoteconsole.server.repo.PropertiesValue;
import weblogic.remoteconsole.server.repo.ReferenceAsReferencesValue;
import weblogic.remoteconsole.server.repo.SecretValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.UnresolvedReference;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.webapp.FailedRequestException;

/**
 * WDTValueConverter provides functions to convert to/from Java types and Value types.
 */
public class WDTValueConverter {
  private static final Logger LOGGER = Logger.getLogger(WDTValueConverter.class.getName());

  // Get the Value type from the Java type of the specified bean tree property...
  @SuppressWarnings("unchecked")
  public static Value getValueType(BeanTreeEntry value, BeanPropertyDef propertyDef) {
    if (propertyDef.isArray()) {
      // Check for a WDT model token
      Object propVal = value.getPropertyValue();
      if (isArrayModelToken(propVal)) {
        return new ModelToken(String.class.cast(propVal));
      }

      // Array property without a value is returned as an empty Array
      List<Value> values = new ArrayList<>();

      // Check for a reference type which are resolved during bean tree build
      if (propertyDef.isReference()) {
        // Convert into a value type and return...
        List<Object> refs = value.getPropertyReference();
        if (value.containsReference()) {
          for (Object ref : refs) {
            if (ref instanceof BeanTreeEntry) {
              values.add(((BeanTreeEntry)ref).getBeanTreePath());
            } else {
              // Create unresolved reference but check if it's a model token...
              Value refValue;
              String raw = ref.toString();
              if (isModelToken(raw)) {
                refValue = new ModelToken(raw);
              } else {
                refValue = new UnresolvedReference(raw);
              }
              values.add(refValue);
            }
          }
        }
        // Check for array of references handled as a reference...
        if (propertyDef.isReferenceAsReferences()) {
          return new ReferenceAsReferencesValue(values);
        }
        // Return the array...
        return new ArrayValue(values);
      }

      // Handle other types of arrays based on the type of the property
      if (propVal != null) {
        if (propVal instanceof List) {
          List<Object> items = (List<Object>) propVal;
          for (Object item : items) {
            values.add(getPropertyValue(item, propertyDef, value));
          }
        } else if ((propVal instanceof String) && propVal.toString().contains(",")) {
          // Handle the array as comma separated String value
          String[] split = String.class.cast(propVal).split(",");
          for (String item : split) {
            values.add(getPropertyValue(item.trim(), propertyDef, value));
          }
        } else {
          values.add(getPropertyValue(propVal, propertyDef, value));
        }
      }
      return new ArrayValue(values);
    }
    return getPropertyValue(value.getPropertyValue(), propertyDef, value);
  }

  private static Value getPropertyValue(Object item, BeanPropertyDef propertyDef, BeanTreeEntry entry) {
    if (item == null) {
      // Return String as a StringValue containing null...
      if (propertyDef.isString()) {
        return new StringValue(null);
      }
      // Return reference as a NullReference...
      if (propertyDef.isReference()) {
        return NullReference.INSTANCE;
      }
      // Otherwise return a null so that the returned Value will become an UnknownValue...
      // Fixup - Log a warning message or do validation during bean tree build?
      LOGGER.warning("WARNING: " + getMessageNullPropertyValue(entry.getPath(), propertyDef));
      return null;
    }
    // Check for a WDT model token
    if (isModelToken(item)) {
      return new ModelToken(String.class.cast(item));
    }
    if (propertyDef.isReference()) {
      if (entry.containsReference()) {
        Object ref = entry.getPropertyReference().get(0);
        // Convert into the proper value type...
        if (ref instanceof BeanTreeEntry) {
          return ((BeanTreeEntry)ref).getBeanTreePath();
        } else if (ref != null) {
          return new UnresolvedReference(ref.toString());
        } else {
          return NullReference.INSTANCE;
        }
      }
      return getTypeNotMatched(item, propertyDef);
    }
    if (propertyDef.isString()) {
      if (String.class.isAssignableFrom(item.getClass())) {
        String value = String.class.cast(item);
        return new StringValue(value);
      }
      // Convert to a String when model type is not a List or Map
      if (!(item instanceof List) && !(item instanceof Map)) {
        return new StringValue(item.toString());
      }
      return getTypeNotMatched(item, propertyDef);
    }
    if (propertyDef.isSecret()) {
      if (String.class.isAssignableFrom(item.getClass())) {
        return new SecretValue(String.class.cast(item));
      }
      // Convert to a String when model type is not a List or Map
      if (!(item instanceof List) && !(item instanceof Map)) {
        return new SecretValue(item.toString());
      }
      return getTypeNotMatched("********", propertyDef);
    }
    if (propertyDef.isBoolean()) {
      if (Boolean.class.isAssignableFrom(item.getClass())) {
        boolean value = Boolean.class.cast(item).booleanValue();
        return new BooleanValue(value);
      }
      if (String.class.isAssignableFrom(item.getClass())) {
        return new BooleanValue(Boolean.parseBoolean(String.class.cast(item)));
      }
      return getTypeNotMatched(item, propertyDef);
    }
    if (propertyDef.isInt()) {
      if (Integer.class.isAssignableFrom(item.getClass())) {
        int value = Integer.class.cast(item).intValue();
        return new IntValue(value);
      }
      if (String.class.isAssignableFrom(item.getClass())) {
        int value = Integer.parseInt(String.class.cast(item));
        return new IntValue(value);
      }
      return getTypeNotMatched(item, propertyDef);
    }
    if (propertyDef.isLong()) {
      // Fixup - BigInteger
      if (Integer.class.isAssignableFrom(item.getClass())) {
        long value = Integer.class.cast(item).longValue();
        return new LongValue(value);
      }
      if (Long.class.isAssignableFrom(item.getClass())) {
        long value = Long.class.cast(item).longValue();
        return new LongValue(value);
      }
      return getTypeNotMatched(item, propertyDef);
    }
    if (propertyDef.isDouble()) {
      if (Double.class.isAssignableFrom(item.getClass())) {
        Double value = Double.class.cast(item);
        return new DoubleValue(value);
      }
      return getTypeNotMatched(item, propertyDef);
    }
    if (propertyDef.isDateAsLong()) {
      if (Integer.class.isAssignableFrom(item.getClass())) {
        long value = Integer.class.cast(item).longValue();
        return new DateAsLongValue(value);
      }
      if (Long.class.isAssignableFrom(item.getClass())) {
        long value = Long.class.cast(item).longValue();
        return new DateAsLongValue(value);
      }
      return getTypeNotMatched(item, propertyDef);
    }
    if (propertyDef.isProperties()) {
      // Fixup - Java Properties with a model token
      if (Map.class.isAssignableFrom(item.getClass())) {
        return new PropertiesValue(getPropertiesFromMap(item));
      }
      if (String.class.isAssignableFrom(item.getClass())) {
        return new PropertiesValue(getPropertiesFromString(String.class.cast(item)));
      }
      return getTypeNotMatched(item, propertyDef);
    }
    return getTypeNotMatched(item, propertyDef);
  }

  // Convert to a boolean from a Java type and return true when
  // and IFF the item is a Boolean true or String of value "true"
  public static boolean getBooleanFromObject(Object item) {
    if (item != null) {
      if (Boolean.class.isAssignableFrom(item.getClass())) {
        return Boolean.class.cast(item).booleanValue();
      }
      if (String.class.isAssignableFrom(item.getClass())) {
        return Boolean.parseBoolean(String.class.cast(item));
      }
    }
    return false;
  }

  // Get the Java type from the Value type for the specified property...
  public static Object getJavaType(Value value, BeanPropertyDef propertyDef, Localizer localizer) {
    if (value.isString()) {
      return value.asString().getValue();
    }
    if (value.isSecret()) {
      return value.asSecret().getValue();
    }
    if (value.isBoolean()) {
      return Boolean.valueOf(value.asBoolean().getValue());
    }
    if (value.isInt()) {
      return Integer.valueOf(value.asInt().getValue());
    }
    if (value.isLong()) {
      return Long.valueOf(value.asLong().getValue());
    }
    if (value.isDouble()) {
      return Double.valueOf(value.asDouble().getValue());
    }
    if (value.isModelToken()) {
      String token = value.asModelToken().getToken();
      if (!isModelToken(token)) {
        // Fixup - update the log and warning handling
        LOGGER.warning("WARNING: WDTValueConverter found invalid model token: " + token);
        String invalidModelToken = localizer.localizeString(LocalizedConstants.INVALID_MODEL_TOKEN);
        throw new FailedRequestException("WDT Value Converter - " + invalidModelToken + token);
      }
      return token;
    }
    if (value.isUnresolvedReference()) {
      String key = value.asUnresolvedReference().getKey();
      if ((key == null) || key.isBlank()) {
        // Fixup - update the log and warning handling
        LOGGER.warning("WARNING: WDTValueConverter found no Unresolved Reference value!");
        String noUnresolvedRef = localizer.localizeString(LocalizedConstants.NO_UNRESOLVED_REF);
        throw new FailedRequestException("WDT Value Converter - " + noUnresolvedRef);
      }
      return key;
    }
    if (value.isNullReference()) {
      return null;
    }
    if (value.isBeanTreePath()) {
      return value.asBeanTreePath().getLastSegment().getKey();
    }
    if (value.isReferenceAsReferences()) {
      // Use reference as single value that will be converted when read
      Value ref = value.asReferenceAsReferences().asReference();
      if (ref == null) {
        LOGGER.warning("WARNING: WDTValueConverter found no References value!");
        String noRefsValue = localizer.localizeString(LocalizedConstants.NO_REFS_VALUE);
        throw new FailedRequestException("WDT Value Converter - " + noRefsValue);
      }
      return getJavaType(ref, propertyDef, localizer);
    }
    if (value.isDate()) {
      // Fixup - Date format or millis
      return value.asDate().getValue().toString();
    }
    if (value.isProperties()) {
      return getMapFromProperties(value.asProperties().getValue());
    }
    if (value.isArray()) {
      // Fixup - All arrays are an ArrayList for the updated property value
      List<Object> items = new ArrayList<>();
      List<Value> values = value.asArray().getValues();
      if ((values != null) && !values.isEmpty()) {
        values.forEach(val -> items.add(getJavaType(val, propertyDef, localizer)));
      }
      return items;
    }
    throw new AssertionError("WDT Value Converter error using " + propertyDef + " for: " + value);
  }

  private static Map<String, Object> getMapFromProperties(Properties items) {
    Map<String, Object> result = null;
    if ((items != null) && !items.isEmpty()) {
      // Sort the Properties keys for predictable updated results...
      Map<String, Object> sorter = new TreeMap<>();
      Map<String, Object> newItems = new LinkedHashMap<>();
      items.forEach((key, val) -> sorter.put(key.toString(), val));
      sorter.forEach((key, val) -> newItems.put(key, val));
      result = newItems;
    }
    return result;
  }

  @SuppressWarnings("unchecked")
  private static Properties getPropertiesFromMap(Object item) {
    Properties result = new Properties();
    if (item instanceof Map) {
      // Use the Map key and the String of each of key value...
      Map<String, Object> properties = (Map<String, Object>)item;
      properties.forEach((key, val) -> result.setProperty(key, ((val != null) ? val.toString() : "")));
    }
    return result;
  }

  private static Properties getPropertiesFromString(String item) {
    Properties result = new Properties();
    if ((item != null) && !item.isBlank()) {
      // Handle the array as semicolon separated key=value
      String[] properties = item.split(";");
      for (String property : properties) {
        String[] keyval = (!property.isBlank()) ? property.split("=") : null;
        if ((keyval != null) && (keyval.length > 1)) {
          result.setProperty(keyval[0].trim(), keyval[1].trim());
        }
      }
    }
    return result;
  }

  // Output the item to determine if updated handling is needed...
  private static Value getTypeNotMatched(Object item, BeanPropertyDef propertyDef) {
    String notMatched = "Prop " + propertyDef.getPropertyName() + " - ";
    notMatched += "Type " + propertyDef.getValueKind() + ": ";
    notMatched += item.toString() + " (" + item.getClass().getName() + ")";
    return new StringValue("WDT Value Converter: " + notMatched);
  }

  private static String getMessageNullPropertyValue(Path propertyPath, BeanPropertyDef propertyDef) {
    String message = "NULL value for Property " + propertyDef.getPropertyName();
    message += " (Type " + propertyDef.getValueKind() + "): " + propertyPath;
    return message;
  }

  // Check if array property value is a model token
  private static boolean isArrayModelToken(Object item) {
    if ((item instanceof String) && !item.toString().contains(",")) {
      return isModelToken(item);
    }
    return false;
  }

  // Check if property value is a model token
  private static boolean isModelToken(Object item) {
    boolean isString = (item instanceof String);
    String value = (isString ? item.toString() : "");
    return (isString && value.startsWith("@@") && value.endsWith("@@"));
  }
}
