// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.server.repo.BeanTreePath;

/**
 * BeanTreeReferenceResolver handles reference resolution of the
 * bean tree created from a WDT model.
 * <p>
 * The resolver has two functions, one to resolve the unresolved
 * references and the second is to remove references when beans
 * are deleted from the bean tree.
 * <p>
 * 1) The resolver has the list of currrent bean collections and
 * tries to resolve the specified reference by finding a match
 * based on the reference type and key.
 * <p> 
 * 2) The resolver has a list of beans that have been deleted and
 * tries to determine if any of the deleted beans are referenced
 * then removes that reference value from the property value.
 * <p>
 */
public class BeanTreeReferenceResolver {
  private static final Logger LOGGER = Logger.getLogger(BeanTreeReferenceResolver.class.getName());

  private List<BeanTreePath> deletedBeans;
  private List<BeanTreeEntry> beanCollections;

  BeanTreeReferenceResolver(List<BeanTreeEntry> beanCollections) {
    this(beanCollections, null);
  }

  BeanTreeReferenceResolver(List<BeanTreeEntry> beanCollections, List<BeanTreePath> deletedBeans) {
    this.beanCollections = (beanCollections != null) ? beanCollections : List.of();
    this.deletedBeans = (deletedBeans != null) ? deletedBeans : List.of();
  }

  /**
   * Resolve the reference using the bean collections
   */
  public void handleUnresolvedReference(BeanTreeEntry unresolved) {
    LOGGER.finest("ReferenceResolver Unresolved: " + unresolved);

    // Determine the key(s) to find based on the type of the reference
    // NOTE: The model can represent an array in multiple ways!
    List<String> keys = determineReferenceKeys(unresolved);
    LOGGER.finest("ReferenceResolver finding key(s): " + keys);

    // Walk the bean collections to find a match for the keys and their reference types
    List<Object> references = findReferences(unresolved, keys);

    // Set the resolved references onto the bean tree entry...
    unresolved.setPropertyReference(references);

    // Log the results...
    debugLogReferences(references);
  }

  /**
   * Update the reference using the list of deleted beans.
   * IFF the reference value becomes NULL as a result of
   * being modified by the delete, then return true so
   * that any additional processing can take place...
   */
  public boolean handleDeleteBean(BeanTreeEntry reference) {
    LOGGER.finest("ReferenceResolver handle bean delete for: " + reference);

    // Walk the list of deleted beans to remove the reference to the bean when present and
    // record if the reference was updated so we can determine if the value became NULL...
    boolean isReferenceUpdated = false;
    for (BeanTreePath bean : deletedBeans) {
      if (removeReferenceValue(reference, isReferenced(bean, reference))) {
        isReferenceUpdated = true;
      }
    }

    // Check if the reference value as become NULL and return proper indication...
    boolean isNullReference = (isReferenceUpdated && (reference.getPropertyValue() == null));
    if (isNullReference) {
      LOGGER.finest("ReferenceResolver updated reference is now NULL!");
    }

    // Log the results...
    debugLogReferences(reference.getPropertyReference());

    // Return NULL reference status...
    return isNullReference;
  }

  /**
   * Get a List of referenced keys from a BeanTreeEntry reference property
   * where an empty list will be returned if there is no property value
   */
  public static List<String> getReferenceKeys(BeanTreeEntry entry) {
    return determineReferenceKeys(entry);
  }

  /**
   * Log the resulting reference resolution based on log level...
   */
  private static void debugLogReferences(List<Object> references) {
    if ((references != null) && LOGGER.isLoggable(Level.FINEST)) {
      if (references.isEmpty()) {
        LOGGER.finest("ReferenceResolver resolved to: []");
      } else {
        references.forEach(reference -> {
          Object logValue = reference;
          if (reference instanceof BeanTreeEntry) {
            logValue = ((BeanTreeEntry)reference).getPath();
          }
          LOGGER.finest("ReferenceResolver resolved to: " + logValue);
        });
      }
    }
  }

  /**
   * Determine if the deleted bean is being referenced and return the index
   */
  private static int isReferenced(BeanTreePath deleted, BeanTreeEntry reference) {
    int result = -1;
    if (reference.containsReference()) {
      List<Object> refs = reference.getPropertyReference();
      for (int i = 0; i < refs.size(); i++) {
        Object ref = refs.get(i);
        if ((ref instanceof BeanTreeEntry) && isSameIdentity(deleted, (BeanTreeEntry) ref)) {
          result = i;
          break;
        }
      }
    }
    return result;
  }

  /**
   * Remove the deleted bean from the reference value, update the
   * property value and return true when the reference is updated.
   */
  private static boolean removeReferenceValue(BeanTreeEntry reference, int index) {
    // Update the reference based on the index value and the property def...
    if (index >= 0) {
      if (!reference.getBeanPropertyDef().isArray()) {
        // Refernece is not an array thus the value becomes NULL...
        reference.setPropertyValue(null);
        reference.setPropertyReference(getListOfNull());
      } else {
        // Reference is an array, remove from the list...
        List<Object> propertyRefs = reference.getPropertyReference();
        propertyRefs.remove(index);

        // Check for an empty list and update the property value accordingly...
        if (propertyRefs.isEmpty()) {
          reference.setPropertyValue(null);
        } else {
          // Set the property value based on the remaining list elements...
          List<Object> propertyValue = new ArrayList<>();
          for (Object ref : propertyRefs) {
            if (ref instanceof BeanTreeEntry) {
              propertyValue.add(((BeanTreeEntry)ref).getKey());
            } else {
              propertyValue.add(ref.toString());
            }
          }
          reference.setPropertyValue(propertyValue);
        }
      }
    }
    return (index >= 0);
  }

  /**
   * Determine if the reference path (i.e. identity) and deleted bean are the same...
   */
  private static boolean isSameIdentity(BeanTreePath deleted, BeanTreeEntry reference) {
    // Get the list of path components...
    List<String> deletedPath = deleted.getPath().getComponents();
    List<String> referencePath = reference.getPath().getComponents();

    // Length must match...
    if (referencePath.size() != deletedPath.size()) {
      return false;
    }

    // IFF any component of the path is not the same as the other then no match!
    for (int i = 0; i < referencePath.size(); i++) {
      if (!referencePath.get(i).equals(deletedPath.get(i))) {
        return false;
      }
    }

    // The identities match!
    return true;
  }

  /**
   * Determine the set of reference keys based on the type and model value
   */
  @SuppressWarnings("unchecked")
  private static List<String> determineReferenceKeys(BeanTreeEntry unresolved) {
    List<String> keys = new LinkedList<>();
    Object propVal = unresolved.getPropertyValue();
    if (propVal != null) {
      if (!unresolved.getBeanPropertyDef().isArray()) {
        // Single reference key to find when not an array...
        keys.add(propVal.toString());
      } else {
        // Determine the list of reference keys to be looked for...
        if (propVal instanceof List) {
          List<Object> items = (List<Object>) propVal;
          items.forEach(item -> keys.add((item != null) ? item.toString() : ""));
        } else if ((propVal instanceof String) && propVal.toString().contains(",")) {
          // Handle the array as comma separated String value
          List<String> items = Arrays.asList(String.class.cast(propVal).split(","));
          items.forEach(item -> keys.add(item.trim()));
        } else {
          // Only an single entry in the array...
          keys.add(propVal.toString());
        }
      }
    }
    return keys;
  }

  /**
   * Find and return the references based on the supplied key values. <p>
   *
   * IFF the property is not an array, the reference list has single value
   * IFF the property _is_ an array, the list is indexed by each value
   *
   * NOTE: An array property without a value is returned as an empty array
   *
   * The values in each list entry can be one of:
   *   A) NULL: Indicates the NullReference
   *   B) BeanTreeEntry: Holds the actual BeanTreePath reference
   *   C) String: The key value used for UnresolvedReference
   */
  private List<Object> findReferences(BeanTreeEntry unresolved, List<String> keys) {
    // Handle a single reference that is null i.e. NullReference
    if ((unresolved.getPropertyValue() == null) && !unresolved.getBeanPropertyDef().isArray()) {
      return getListOfNull();
    }

    // Otherwise walk the list of keys to resolve the reference(s)...
    List<Object> references = new ArrayList<>(keys.size());
    for (int i = 0; i < keys.size(); i++) {
      String key = keys.get(i);
      List<BeanTreeEntry> candidates = findReference(key, unresolved);
      references.add(i, determineReferenceValue(key, candidates, unresolved));
    }
    return references;
  }

  /**
   * Look for the key in the list on bean collections based on the type of the reference
   */
  private List<BeanTreeEntry> findReference(String key, BeanTreeEntry unresolved) {
    List<BeanTreeEntry> candidates = new LinkedList<>();
    BeanTypeDef refTypeDef = unresolved.getBeanPropertyDef().getReferenceTypeDef();
    for (BeanTreeEntry collection : beanCollections) {
      // First determine if the collection type is compatible with the reference type...
      if (collection.getBeanChildDef().getChildTypeDef().isTypeDef(refTypeDef)) {
        // Then check if the key value matches an entry in the collection...
        if (collection.getKeySet().contains(key)) {
          BeanTreeEntry candidate = collection.getBeanTreeEntry(key);
          LOGGER.finest("ReferenceResolver found candidate: " + candidate.getPath());
          candidates.add(candidate);
        }
      // Otherwise if heterogeneous and the reference type is compatible with the collection...
      } else if (collection.getBeanChildDef().getChildTypeDef().isHeterogeneous()
                 && refTypeDef.isTypeDef(collection.getBeanChildDef().getChildTypeDef())) {
        // Check if the reference key matches an entry in the collection...
        if (collection.getKeySet().contains(key)) {
          BeanTreeEntry candidate = collection.getBeanTreeEntry(key);

          // Get the type property for the collection...
          BeanPropertyDef prop = collection.getBeanChildDef().getChildTypeDef().getSubTypeDiscriminatorPropertyDef();
          String typeKey = (prop != null) ? prop.getPropertyName() : "Type";

          // Get the type def for the candidate...
          if (!candidate.getKeySet().contains(typeKey)) {
            LOGGER.warning("WARNING: ReferenceResolver NO SubTypeDiscriminator for: " + candidate.getPath());
            continue;
          }
          Object propertyValue = candidate.getBeanTreeEntry(typeKey).getPropertyValue();
          String type = (propertyValue != null) ? propertyValue.toString() : "";
          BeanTypeDef candidateTypeDef = collection.getBeanChildDef().getChildTypeDef().getSubTypeDef(type);
          if (candidateTypeDef == null) {
            LOGGER.warning("WARNING: ReferenceResolver NO BeanTypeDef found for: " + candidate.getPath());
            continue;
          }

          // Now check if candidate type is compatible with the reference type...
          if (candidateTypeDef.isTypeDef(refTypeDef)) {
            LOGGER.finest("ReferenceResolver found heterogeneous candidate: " + candidate.getPath());
            candidates.add(candidate);
          }
        }
      }
    }
    return candidates;
  }

  /**
   * Determine the value to use for the reference by normalizing the handling
   * when multiple candidates are found...
   */
  private static Object determineReferenceValue(String key, List<BeanTreeEntry> candidates, BeanTreeEntry unresolved) {
    if (candidates.size() == 1) {
      // Resolved to a single entry...
      return candidates.get(0);
    } else if (candidates.size() > 1) {
      // IFF multiple candidates are found look for the closest match
      BeanTreeEntry candidate = determineCandidate(candidates, unresolved);
      if (candidate != null) {
        return candidate;
      }
      // When not able to determine the candidate leave as unresolved
      // Fixup - logger warning to indicate multiple references or Assert
      LOGGER.warning("WARNING: ReferenceResolver too many candidates found for: " + key);
      return key;
    }
    // Still unresolved thus supply the key for the unresolved reference...
    LOGGER.fine("ReferenceResolver unable to resolve: " + key);
    return key;
  }

  /**
   * Determine the closet match to the unresolved entry by walking
   * the path of the candidates to find the best match...
   */
  private static BeanTreeEntry determineCandidate(List<BeanTreeEntry> candidates, BeanTreeEntry unresolved) {
    int bestMatchLen = 0;
    BeanTreeEntry bestCandidate = null;
    List<BeanTreeEntry> bestCandidates = new LinkedList<>();
    List<String> unresolvedPath = unresolved.getPath().getComponents();

    // Walk through each candidate path and record the best matches...
    for (BeanTreeEntry candidate : candidates) {
      List<String> candidatePath = candidate.getPath().getComponents();
      int maxLen = (candidatePath.size() <= unresolvedPath.size()) ? candidatePath.size() : unresolvedPath.size();
      for (int i = 0; i < maxLen; i++) {
        if (!candidatePath.get(i).equals(unresolvedPath.get(i))) {
          if (i > bestMatchLen) {
            bestMatchLen = i;
            bestCandidates = new LinkedList<>();
            bestCandidates.add(candidate);
          } else if (i == bestMatchLen) {
            bestCandidates.add(candidate);
          }
          break;
        }
      }
    }

    // IFF one candidate now, we are good to go!
    // Otherwise no candidate is returned...
    if (bestCandidates.size() == 1) {
      bestCandidate = bestCandidates.get(0);
      LOGGER.finest("ReferenceResolver found best candidate: " + bestCandidate.getPath());
    }
    return bestCandidate;
  }

  /**
   * Create an ArrayList with a single NULL item in the list...
   */
  private static List<Object> getListOfNull() {
    List<Object> newList = new ArrayList<>();
    newList.add((Object) null);
    return newList;
  }
}
