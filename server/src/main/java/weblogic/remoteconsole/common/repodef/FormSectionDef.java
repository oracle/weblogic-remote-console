// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.ArrayList;
import java.util.List;

/**
 * This interface describes a section of a form page.
 * 
 * It contains all of the information about the tree that the different
 * parts of the backend needs (e.g. english resource bundle, PDJ, RDJ).
 */
public interface FormSectionDef {

  // Returns the corresponding form
  public FormDef getFormDef();

  // Returns the section's title (or null if the section doesn't have a title)
  public LocalizableString getTitle();

  // Returns the section's introduction (or null if the section doesn't have an introduction)
  public LocalizableString getIntroductionHTML();

  // Returns under what conditions this section should be displayed.
  // Returns null if this section is always displayed.
  public FormSectionUsedIfDef getUsedIfDef();

  // Returns this section's properties.
  // Returns an empty list if this section has any child sections
  // (i.e. a section can't parent both properties and sections).
  public List<PagePropertyDef> getPropertyDefs();

  // Returns all of the properties in this section and its child sections.
  public default List<PagePropertyDef> getAllPropertyDefs() {
    if (getSectionDefs().isEmpty()) {
      return getPropertyDefs();
    }
    List<PagePropertyDef> ret = new ArrayList<>();
    for (FormSectionDef section : getSectionDefs()) {
      ret.addAll(section.getAllPropertyDefs());
    }
    return ret;
  }

  // Returns this section's child sections.
  // Returns an empty list if this section has any properties
  // (i.e. a section can't parent both properties and sections).
  public List<FormSectionDef> getSectionDefs();

  // Returns all the child sections of this section and its child sections.
  public default List<FormSectionDef> getAllSectionDefs() {
    if (getSectionDefs().isEmpty()) {
      return List.of();
    }
    List<FormSectionDef> allDefs = new ArrayList<>();
    addSectionDefs(allDefs, getSectionDefs());
    return allDefs;
  }

  private static void addSectionDefs(List<FormSectionDef> allDefs, List<FormSectionDef> sectionDefs) {
    allDefs.addAll(sectionDefs);
    for (FormSectionDef sectionDef : sectionDefs) {
      addSectionDefs(allDefs, sectionDef.getSectionDefs());
    }
  }
}
