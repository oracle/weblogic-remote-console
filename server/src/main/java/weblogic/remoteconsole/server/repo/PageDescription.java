// Copyright (c) 2021, 2023, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;

import weblogic.remoteconsole.common.repodef.ActionInputFormDef;
import weblogic.remoteconsole.common.repodef.BeanValueDef;
import weblogic.remoteconsole.common.repodef.CreateFormDef;
import weblogic.remoteconsole.common.repodef.CreateFormPresentationDef;
import weblogic.remoteconsole.common.repodef.FormSectionDef;
import weblogic.remoteconsole.common.repodef.HelpTopicDef;
import weblogic.remoteconsole.common.repodef.LegalValueDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.repodef.PageActionExternalHelpDef;
import weblogic.remoteconsole.common.repodef.PageActionParamDef;
import weblogic.remoteconsole.common.repodef.PageActionPollingDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PageFieldPresentationDef;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.PagePropertyExternalHelpDef;
import weblogic.remoteconsole.common.repodef.PagesPath;
import weblogic.remoteconsole.common.repodef.SliceDef;
import weblogic.remoteconsole.common.repodef.SliceFormDef;
import weblogic.remoteconsole.common.repodef.SliceFormPresentationDef;
import weblogic.remoteconsole.common.repodef.SliceTableDef;
import weblogic.remoteconsole.common.repodef.SlicesDef;
import weblogic.remoteconsole.common.repodef.TableDef;
import weblogic.remoteconsole.common.repodef.UsedIfDef;
import weblogic.remoteconsole.common.utils.StringUtils;

/**
 * Converts a PageDef to a PDJ
 */
public class PageDescription {
  private InvocationContext ic;
  private static final String READ_ONLY = "readOnly";

  // Converts a PageDef to a localized PDJ.
  public static JsonObject getPageDescription(PageDef pageDef, InvocationContext ic) {
    return (new PageDescription(ic)).pageDefToJson(pageDef);
  }

  private PageDescription(InvocationContext ic) {
    this.ic = ic;
  }

  private JsonObject pageDefToJson(PageDef pageDef) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    addIfNotEmpty(builder, "introductionHTML", pageDef.getIntroductionHTML());
    addIfNotEmpty(builder, "helpPageTitle", pageDef.getHelpPageTitle());
    addIfNotEmpty(builder, "helpTopics", helpTopicDefsToJson(pageDef.getHelpTopicDefs()));
    if (pageDef.isTableDef()) {
      addIfNotEmpty(builder, "table", tableDefToJson(pageDef.asTableDef()));
    }
    if (pageDef.isSliceFormDef()) {
      addIfNotEmpty(builder, "sliceForm", sliceFormDefToJson(pageDef.asSliceFormDef()));
    }
    if (pageDef.isSliceTableDef()) {
      addIfNotEmpty(builder, "sliceTable", sliceTableDefToJson(pageDef.asSliceTableDef()));
    }
    if (pageDef.isCreateFormDef()) {
      addIfNotEmpty(builder, "createForm", createFormDefToJson(pageDef.asCreateFormDef()));
    }
    if (pageDef.isActionInputFormDef()) {
      addIfNotEmpty(builder, "actionInputForm", actionInputFormDefToJson(pageDef.asActionInputFormDef()));
    }
    return builder.build();
  }

  private JsonArray helpTopicDefsToJson(List<HelpTopicDef> helpTopicDefs) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (HelpTopicDef helpTopicDef : helpTopicDefs) {
      builder.add(helpTopicDefToJson(helpTopicDef));
    }
    return builder.build();
  }

  private JsonObject helpTopicDefToJson(HelpTopicDef helpTopicDef) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    addIfNotEmpty(builder, "label", helpTopicDef.getLabel());
    addIfNotEmpty(builder, "href", helpTopicDef.getHref());
    return builder.build();
  }

  private JsonObject tableDefToJson(TableDef tableDef) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    addIfTrue(builder, "ordered", tableDef.getPagePath().getPagesPath().getTypeDef().isOrdered());
    addIfNotEmpty(builder, "displayedColumns", columnPropertyDefsToJson(tableDef.getDisplayedColumnDefs()));
    List<PagePropertyDef> sortedHiddenColumns = sortHiddenColumnDefs(tableDef.getHiddenColumnDefs());
    addIfNotEmpty(builder, "hiddenColumns", columnPropertyDefsToJson(sortedHiddenColumns));
    addIfNotEmpty(builder, "actions", actionDefsToJson(tableDef.getActionDefs()));
    builder.add("requiresRowSelection", requiresRowSelection(tableDef.getActionDefs()));
    return builder.build();
  }

  private JsonObject sliceFormDefToJson(SliceFormDef sliceFormDef) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    addIfNotEmpty(builder, "slices", slicesDefToJson(getSlicesDef(sliceFormDef.getPagePath())));
    addIfNotEmpty(builder, "properties", sliceFormPropertyDefsToJson(sliceFormDef.getPropertyDefs()));
    addIfNotEmpty(builder, "advancedProperties", sliceFormPropertyDefsToJson(sliceFormDef.getAdvancedPropertyDefs()));
    addIfNotEmpty(builder, "sections", sliceFormSectionDefsToJson(sliceFormDef.getSectionDefs()));
    addIfNotEmpty(builder, "presentation", sliceFormPresentationDefToJson(sliceFormDef.getPresentationDef()));
    addIfNotEmpty(builder, "actions", actionDefsToJson(sliceFormDef.getActionDefs()));
    builder.add(READ_ONLY, sliceFormDef.isReadOnly());
    return builder.build();
  }

  private JsonObject sliceTableDefToJson(SliceTableDef sliceTableDef) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    addIfNotEmpty(builder, "slices", slicesDefToJson(getSlicesDef(sliceTableDef.getPagePath())));
    addIfNotEmpty(builder, "displayedColumns", columnPropertyDefsToJson(sliceTableDef.getDisplayedColumnDefs()));
    List<PagePropertyDef> sortedHiddenColumns = sortHiddenColumnDefs(sliceTableDef.getHiddenColumnDefs());
    addIfNotEmpty(builder, "hiddenColumns", columnPropertyDefsToJson(sortedHiddenColumns));
    addIfNotEmpty(builder, "actions", actionDefsToJson(sliceTableDef.getActionDefs()));
    builder.add("requiresRowSelection", requiresRowSelection(sliceTableDef.getActionDefs()));
    builder.add(READ_ONLY, sliceTableDef.isReadOnly());
    return builder.build();
  }

  private JsonObject createFormDefToJson(CreateFormDef createFormDef) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    addIfNotEmpty(builder, "properties", createFormPropertyDefsToJson(createFormDef.getPropertyDefs()));
    addIfNotEmpty(builder, "sections", createFormSectionDefsToJson(createFormDef.getSectionDefs()));
    addIfNotEmpty(builder, "actions", actionDefsToJson(createFormDef.getActionDefs()));
    addIfNotEmpty(builder, "presentation", createFormPresentationDefToJson(createFormDef.getPresentationDef()));
    // Don't have to worry about read only create forms since they're only used to write
    // (v.s. a slice form can be used to only view)
    return builder.build();
  }

  private JsonObject actionInputFormDefToJson(ActionInputFormDef inputFormDef) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    builder.add("properties", actionParamDefsToJson(inputFormDef.getParamDefs()));
    return builder.build();
  }

  private SlicesDef getSlicesDef(PagePath pagePath) {
    PagesPath pagesPath = pagePath.getPagesPath();
    return pagesPath.getPageRepoDef().getSlicesDef(pagesPath.getTypeDef());
  }

  private JsonArray slicesDefToJson(SlicesDef slicesDef) {
    List<SliceDef> sliceDefs = slicesDef.getContentDefs();
    if (sliceDefs.size() == 1 && sliceDefs.get(0).getContentDefs().isEmpty()) {
      // There is only one slice for this form.
      // Don't return it since the CFE doesn't display any tabs for this case.
      return null;
    }
    return sliceDefsToJson(sliceDefs);
  }

  private JsonArray sliceDefsToJson(List<SliceDef> sliceDefs) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (SliceDef sliceDef : sliceDefs) {
      builder.add(sliceDefToJson(sliceDef));
    }
    return builder.build();
  }

  private JsonObject sliceDefToJson(SliceDef sliceDef) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    addIfNotEmpty(builder, "name", sliceDef.getName());
    addIfNotEmpty(builder, "label", sliceDef.getLabel());
    addIfNotEmpty(builder, "slices", sliceDefsToJson(sliceDef.getContentDefs()));
    return builder.build();
  }

  private JsonArray sliceFormSectionDefsToJson(List<FormSectionDef> sectionDefs) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (FormSectionDef sectionDef : sectionDefs) {
      builder.add(sliceFormSectionDefToJson(sectionDef));
    }
    return builder.build();
  }

  private JsonArray createFormSectionDefsToJson(List<FormSectionDef> sectionDefs) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (FormSectionDef sectionDef : sectionDefs) {
      builder.add(createFormSectionDefToJson(sectionDef));
    }
    return builder.build();
  }

  private JsonObject sliceFormSectionDefToJson(FormSectionDef sectionDef) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    formSectionDefToJson(builder, sectionDef);
    addIfNotEmpty(builder, "properties", sliceFormPropertyDefsToJson(sectionDef.getPropertyDefs()));
    addIfNotEmpty(builder, "sections", sliceFormSectionDefsToJson(sectionDef.getSectionDefs()));
    return builder.build();
  }

  private JsonObject createFormSectionDefToJson(FormSectionDef sectionDef) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    formSectionDefToJson(builder, sectionDef);
    addIfNotEmpty(builder, "properties", createFormPropertyDefsToJson(sectionDef.getPropertyDefs()));
    addIfNotEmpty(builder, "sections", createFormSectionDefsToJson(sectionDef.getSectionDefs()));
    return builder.build();
  }

  // section info returned for all sections
  private void formSectionDefToJson(JsonObjectBuilder builder, FormSectionDef sectionDef) {
    addIfNotEmpty(builder, "title", sectionDef.getTitle());
    addIfNotEmpty(builder, "introductionHTML", sectionDef.getIntroductionHTML());
    addIfNotEmpty(builder, "usedIf", usedIfDefToJson(sectionDef.getUsedIfDef()));
  }

  // Sort the hidden columns by their localized labels.
  // This means that:
  // - the displayed columns are returned in their yaml order
  //   (since there tend to not be many displayed columns but
  //   they contain important info)
  // - the hidden columns are returned in alphahetial order
  //   (since some tables have many hidden columns and they
  //   tend to contain less important info than the displayed ones)
  private List<PagePropertyDef> sortHiddenColumnDefs(List<PagePropertyDef> hiddenColumnDefs) {
    Map<String,PagePropertyDef> sorter = new TreeMap<>();
    for (PagePropertyDef hiddenColumnDef : hiddenColumnDefs) {
      String sortingKey = ic.getLocalizer().localizeString(hiddenColumnDef.getLabel());
      sorter.put(sortingKey, hiddenColumnDef);
    }
    return List.copyOf(sorter.values());
  }

  private JsonArray columnPropertyDefsToJson(List<PagePropertyDef> propertyDefs) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (PagePropertyDef propertyDef : propertyDefs) {
      builder.add(columnPropertyDefToJson(propertyDef));
    }
    return builder.build();
  }

  private JsonObject columnPropertyDefToJson(PagePropertyDef propertyDef) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    propertyDefToJson(builder, propertyDef);
    addIfTrue(builder, "valueNotReturnedIfHidden", propertyDef.isDontReturnIfHiddenColumn());
    addIfTrue(builder, "key", propertyDef.isKey());
    return builder.build();
  }

  private JsonArray sliceFormPropertyDefsToJson(List<PagePropertyDef> propertyDefs) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (PagePropertyDef propertyDef : propertyDefs) {
      builder.add(sliceFormPropertyDefToJson(propertyDef));
    }
    return builder.build();
  }

  private JsonObject sliceFormPropertyDefToJson(PagePropertyDef propertyDef) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    formPropertyDefToJson(builder, propertyDef, propertyDef.isUpdateWritable());
    return builder.build();
  }

  private JsonArray createFormPropertyDefsToJson(List<PagePropertyDef> propertyDefs) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (PagePropertyDef propertyDef : propertyDefs) {
      builder.add(createFormPropertyDefToJson(propertyDef));
    }
    return builder.build();
  }

  private JsonObject createFormPropertyDefToJson(PagePropertyDef propertyDef) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    formPropertyDefToJson(builder, propertyDef, propertyDef.isCreateWritable());
    return builder.build();
  }

  private JsonArray actionParamDefsToJson(List<PageActionParamDef> paramDefs) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (PageActionParamDef paramDef : paramDefs) {
      builder.add(actionParamDefToJson(paramDef));
    }
    return builder.build();
  }

  private JsonObject actionParamDefToJson(PageActionParamDef paramDef) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    addIfTrue(builder, "ordered", paramDef.isOrdered());
    addIfNotEmpty(builder, "name", paramDef.getFormFieldName());
    // action params always use the same label on the page and help page:
    addIfNotEmpty(builder, "label", paramDef.getLabel());
    addIfNotEmpty(builder, "helpLabel", paramDef.getLabel());
    addIfNotEmpty(builder, "type", getType(paramDef, true));
    addIfTrue(builder, "array", isArray(paramDef));
    addIfNotEmpty(builder, "helpSummaryHTML", paramDef.getHelpSummaryHTML());
    addIfNotEmpty(builder, "detailedHelpHTML", paramDef.getDetailedHelpHTML());
    addIfTrue(builder, "required", paramDef.isRequired());
    addIfNotEmpty(builder, "presentation", pageFieldPresentationDefToJson(paramDef.getPresentationDef()));
    return builder.build();
  }

  private JsonArray actionDefsToJson(List<PageActionDef> actionDefs) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (PageActionDef actionDef : actionDefs) {
      builder.add(actionDefToJson(actionDef));
    }
    return builder.build();
  }

  private boolean requiresRowSelection(List<PageActionDef> actionDefs) {
    for (PageActionDef actionDef : actionDefs) {
      if (requiresRowSelection(actionDef)) {
        return true;
      }
    }
    return false;
  }

  private boolean requiresRowSelection(PageActionDef actionDef) {
    if (requiresRowSelection(actionDef.getActionDefs())) {
      return true;
    }
    if (actionDef.isInvokable() && !"none".equals(actionDef.getRows())) {
      return true;
    }
    return false;
  }

  private JsonObject actionDefToJson(PageActionDef actionDef) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    addIfNotEmpty(builder, "name", actionDef.getActionPath().getDotSeparatedPath());
    addIfNotEmpty(builder, "label", actionDef.getLabel());
    if (actionDef.isInvokable()) {
      addIfNotEmpty(builder, "rows", actionDef.getRows());
      addIfNotEmpty(builder, "helpLabel", actionDef.getHelpLabel());
      addIfNotEmpty(builder, "helpSummaryHTML", actionDef.getHelpSummaryHTML());
      addIfNotEmpty(builder, "detailedHelpHTML", actionDef.getDetailedHelpHTML());
      addIfNotEmpty(builder, "externalHelp", pageActionExternalHelpDefToJson(actionDef.getExternalHelpDef()));
    }
    addIfNotEmpty(builder, "actions", actionDefsToJson(actionDef.getActionDefs()));
    addIfNotEmpty(builder, "polling", pageActionPollingDefToJson(actionDef.getPollingDef()));
    return builder.build();
  }

  // property info returned for all forms
  private void formPropertyDefToJson(
    JsonObjectBuilder builder,
    PagePropertyDef propertyDef,
    boolean writable
  ) {
    propertyDefToJson(builder, propertyDef);
    addIfTrue(builder, READ_ONLY, !writable);
    if (writable) {
      // Only add the default values if the property is writable on this form.
      addIfNotUnknown(builder, "secureDefaultValue", propertyDef.getSecureDefaultValue());
      addIfNotUnknown(builder, "productionDefaultValue", propertyDef.getProductionDefaultValue());
      addIfNotUnknown(builder, "defaultValue", propertyDef.getDefaultValue());
    }
    addIfTrue(builder, "required", propertyDef.isRequired());
    addIfTrue(builder, "restartNeeded", writable && propertyDef.isRestartNeeded());
    addIfTrue(builder, "supportsModelTokens", propertyDef.isSupportsModelTokens());
    addIfTrue(builder, "supportsUnresolvedReferences", propertyDef.isSupportsUnresolvedReferences());
    addIfNotEmpty(builder, "presentation", pageFieldPresentationDefToJson(propertyDef.getPresentationDef()));
  }

  // property info returned for both columns and forms
  private void propertyDefToJson(JsonObjectBuilder builder, PagePropertyDef propertyDef) {
    addIfTrue(builder, "ordered", propertyDef.isOrdered());
    addIfNotEmpty(builder, "name", propertyDef.getFormFieldName());
    // properties always use the same label on the page and help page:
    addIfNotEmpty(builder, "label", propertyDef.getLabel());
    addIfNotEmpty(builder, "helpLabel", propertyDef.getLabel());
    addIfNotEmpty(builder, "type", getPropertyType(propertyDef));
    addIfTrue(builder, "array", isArray(propertyDef));
    addIfNotEmpty(builder, "helpSummaryHTML", propertyDef.getHelpSummaryHTML());
    addIfNotEmpty(builder, "detailedHelpHTML", propertyDef.getDetailedHelpHTML());
    addIfNotEmpty(builder, "legalValues", legalValueDefsToJson(propertyDef.getLegalValueDefs()));
    addIfNotEmpty(builder, "usedIf", usedIfDefToJson(propertyDef.getUsedIfDef()));
    addIfNotEmpty(builder, "externalHelp", pagePropertyExternalHelpDefToJson(propertyDef.getExternalHelpDef()));
  }

  private JsonObject pagePropertyExternalHelpDefToJson(PagePropertyExternalHelpDef externalHelpDef) {
    if (externalHelpDef == null) {
      return null;
    }
    JsonObjectBuilder builder = Json.createObjectBuilder();
    addIfNotEmpty(builder, "title", externalHelpDef.getTitle());
    addIfNotEmpty(builder, "label", externalHelpDef.getLabel());
    addIfNotEmpty(builder, "introLabel", externalHelpDef.getIntroLabel());
    addIfNotEmpty(builder, "href", externalHelpDef.getHref());
    return builder.build();
  }

  private JsonObject pageActionExternalHelpDefToJson(PageActionExternalHelpDef externalHelpDef) {
    if (externalHelpDef == null) {
      return null;
    }
    JsonObjectBuilder builder = Json.createObjectBuilder();
    addIfNotEmpty(builder, "title", externalHelpDef.getTitle());
    addIfNotEmpty(builder, "label", externalHelpDef.getLabel());
    addIfNotEmpty(builder, "introLabel", externalHelpDef.getIntroLabel());
    addIfNotEmpty(builder, "href", externalHelpDef.getHref());
    return builder.build();
  }

  private JsonObject pageActionPollingDefToJson(PageActionPollingDef pollingDef) {
    if (pollingDef == null) {
      return null;
    }
    JsonObjectBuilder builder = Json.createObjectBuilder();
    builder.add("reloadSeconds", pollingDef.getReloadSeconds());
    builder.add("maxAttempts", pollingDef.getMaxAttempts());
    return builder.build();
  }

  private JsonObject pageFieldPresentationDefToJson(PageFieldPresentationDef presentationDef) {
    if (presentationDef == null) {
      return null;
    }
    JsonObjectBuilder builder = Json.createObjectBuilder();
    addIfNotEmpty(builder, "inlineFieldHelp", presentationDef.getInlineFieldHelp());
    addIfTrue(builder, "displayAsHex", presentationDef.isDisplayAsHex());
    addIfNotEmpty(builder, "width", presentationDef.getWidth());
    return builder.build();
  }

  private JsonObject sliceFormPresentationDefToJson(SliceFormPresentationDef presentationDef) {
    if (presentationDef == null) {
      return null;
    }
    boolean singleColumn =
      computeIsSingleColumn(
        presentationDef.isSingleColumn(),
        presentationDef.getSliceFormDef().getAllPropertyDefs().size()
      );
    JsonObjectBuilder builder = Json.createObjectBuilder();
    addIfTrue(builder, "singleColumn", singleColumn);
    addIfTrue(builder, "useCheckBoxesForBooleans", presentationDef.isUseCheckBoxesForBooleans());
    return builder.build();
  }

  private JsonObject createFormPresentationDefToJson(CreateFormPresentationDef presentationDef) {
    if (presentationDef == null) {
      return null;
    }
    boolean singleColumn =
      computeIsSingleColumn(
        presentationDef.isSingleColumn(),
        presentationDef.getCreateFormDef().getAllPropertyDefs().size()
      );
    JsonObjectBuilder builder = Json.createObjectBuilder();
    addIfTrue(builder, "singleColumn", singleColumn);
    return builder.build();
  }

  private boolean computeIsSingleColumn(boolean configuredIsSingleColumn, int numberOfFormProperties) {
    if (!configuredIsSingleColumn) {
      if (numberOfFormProperties <= 5) {
        // The form doesn't have many properties.
        // Force it to use one column, regardless of how the form is configured.
        return true;
      } else {
        // The form has a bunch of properties and isn't explictly configured to use one column.
        // Allow it to use multiple columns.
        return false;
      }
    } else {
      // The form is explicitly configured to be single column.
      return true;
    }
  }

  private JsonObject usedIfDefToJson(UsedIfDef usedIfDef) {
    if (usedIfDef == null) {
      return null;
    }
    JsonObjectBuilder builder = Json.createObjectBuilder();
    addIfNotEmpty(builder, "property", usedIfDef.getPropertyDef().getFormFieldName());
    builder.add("values", valuesToJson(usedIfDef.getValues()));
    return builder.build();
  }

  private JsonArray legalValueDefsToJson(List<LegalValueDef> legalValueDefs) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (LegalValueDef legalValueDef : legalValueDefs) {
      builder.add(legalValueDefToJson(legalValueDef));
    }
    return builder.build();
  }

  private JsonObject legalValueDefToJson(LegalValueDef legalValueDef) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    builder.add("value", valueToJson(legalValueDef.getValue()));
    addIfNotEmpty(builder, "label", legalValueDef.getLabel());
    return builder.build();
  }

  private boolean isArray(BeanValueDef valueDef) {
    if (valueDef.isReferenceAsReferences()) {
      return false;
    }
    return valueDef.isArray();
  }

  private String getPropertyType(PagePropertyDef propertyDef) {
    return getType(propertyDef, isWritable(propertyDef));
  }

  private String getType(BeanValueDef valueDef, boolean writable) {
    if (valueDef.isString()) {
      if (valueDef.isMultiLineString()) {
        return "multiLineString";
      }
      return null; // don't write out out since it's the default type
    }
    if (valueDef.isInt()) {
      return "int";
    }
    if (valueDef.isLong()) {
      return "long";
    }
    if (valueDef.isDouble()) {
      return "double";
    }
    if (valueDef.isBoolean()) {
      return "boolean";
    }
    if (valueDef.isSecret()) {
      return "secret";
    }
    if (valueDef.isDate()) {
      return "date";
    }
    if (valueDef.isProperties()) {
      return "properties";
    }
    if (valueDef.isReference()) {
      return (writable) ? "reference-dynamic-enum" : "reference";
    }
    if (valueDef.isThrowable()) {
      return "throwable";
    }
    if (valueDef.isFileContents()) {
      return "fileContents";
    }
    if (valueDef.isHealthState()) {
      // For now, just treat it as a string:
      return null;
    }
    if (valueDef.isEntitleNetExpression()) {
      return "entitleNetExpression";
    }
    throw new AssertionError("Unknown value type: " + valueDef.getValueKind());
  }

  private boolean isWritable(PagePropertyDef propertyDef) {
    PageDef pageDef = propertyDef.getPageDef();
    if (pageDef.isCreateFormDef()) {
      return propertyDef.isCreateWritable();
    } else if (pageDef.isSliceFormDef()) {
      return propertyDef.isUpdateWritable();
    } else if (pageDef.isSliceTableDef()) {
      return false; // table cells are always read-only
    } else if (pageDef.isTableDef()) {
      return false; // table cells are always read-only
    } else {
      throw new AssertionError("Unsupported page type: " + pageDef);
    }
  }

  private JsonArray valuesToJson(List<Value> values) {
    JsonArrayBuilder builder = Json.createArrayBuilder();
    for (Value value : values) {
      builder.add(valueToJson(value));
    }
    return builder.build();
  }

  private JsonValue valueToJson(Value value) {
    if (value.isString()) {
      String val = value.asString().getValue();
      if (val == null) {
        return JsonValue.NULL;
      } else {
        return Json.createValue(val);
      }
    }
    if (value.isBoolean()) {
      if (value.asBoolean().getValue()) {
        return JsonValue.TRUE;
      } else {
        return JsonValue.FALSE;
      }
    }
    if (value.isInt()) {
      return Json.createValue(value.asInt().getValue());
    }
    if (value.isLong()) {
      return Json.createValue(value.asLong().getValue());
    }
    if (value.isDouble()) {
      return Json.createValue(value.asDouble().getValue());
    }
    if (value.isArray()) {
      JsonArrayBuilder builder = Json.createArrayBuilder();
      for (Value val : value.asArray().getValues()) {
        builder.add(valueToJson(val));
      }
      return builder.build();
    }
    if (value.isNullReference()) {
      return JsonValue.NULL;
    }
    throw new AssertionError("Unsupported value: " + value);
  }

  private void addIfNotEmpty(JsonObjectBuilder builder, String name, LocalizableString localizableString) {
    addIfNotEmpty(builder, name, ic.getLocalizer().localizeString(localizableString));
  }

  private void addIfNotEmpty(JsonObjectBuilder builder, String name, String value) {
    if (StringUtils.notEmpty(value)) {
      builder.add(name, value);
    }
  }

  private void addIfNotEmpty(JsonObjectBuilder builder, String name, JsonObject value) {
    if (value != null && !value.isEmpty()) {
      builder.add(name, value);
    }
  }

  private void addIfNotEmpty(JsonObjectBuilder builder, String name, JsonArray value) {
    if (value != null && !value.isEmpty()) {
      builder.add(name, value);
    }
  }

  private void addIfNotUnknown(JsonObjectBuilder builder, String name, Value value) {
    if (!value.isUnknown()) {
      builder.add(name, valueToJson(value));
    }
  }

  private void addIfTrue(JsonObjectBuilder builder, String name, boolean value) {
    if (value) {
      builder.add(name, value);
    }
  }
}
