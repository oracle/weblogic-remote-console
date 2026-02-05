/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import { Dispatch, useRef, useState, useEffect } from "preact/hooks";
import { ojTextArea, ojInputText } from "ojs/ojinputtext";
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import { FormContentModel } from "../../shared/model/formcontentmodel";
import { Property } from "../../shared/typedefs/pdj";
import { EntitleNetExpression, ParsedExpressionType } from "../../shared/typedefs/rdj";
import "oj-c/button";
import { ojDialog } from "ojs/ojdialog";
import "ojs/ojselectsingle";
import "ojs/ojformlayout";
import "ojs/ojlabel";
import "ojs/ojtable";
import MutableArrayDataProvider = require("ojs/ojmutablearraydataprovider");

/**
 * PolicyExpression renders the role and policy expression values
 */
type Props = {
  fieldDescription: Property;
  formModel: FormContentModel;
  valueChangedHandler: (event: ojInputText.valueChanged) => void;
  setModel?: Dispatch<FormContentModel>;
};

const PolicyExpression = ({ fieldDescription, formModel, valueChangedHandler }: Props) => {
  const name = fieldDescription.name;
  const rawValue = formModel.getProperty(name);

  const disabled = formModel.isDisabled(fieldDescription);
  const readonly = formModel.isReadOnly(fieldDescription);
  const required = formModel.isRequired(fieldDescription);
  const title = formModel.getTitle(fieldDescription);

  // Treat value as an expression when present; fall back to string/token handling.
  const expression: EntitleNetExpression | undefined =
    rawValue && typeof rawValue === "object" && (rawValue as any).stringExpression !== undefined
      ? (rawValue as EntitleNetExpression)
      : undefined;

  // The textarea edits the EntitleNetExpression.stringExpression
  const stringExpression: string =
    expression?.stringExpression ??
    (typeof rawValue === "string" ? rawValue : "");

  const predicateOptions = expression?.supportedPredicates ?? [];
  const [selectedPredicateClass, setSelectedPredicateClass] = useState<string | undefined>(undefined);
  const selectionOptions = (predicateOptions || []).map((p) => ({ label: p.displayName, value: p.className }));
  const selectionDataProvider = new MutableArrayDataProvider<string, {label: string; value: string}>(selectionOptions as any, { keyAttributes: "value" });
  const itemText = (opt: any) => opt.data.label ?? opt.data.value;
  const selectedPredicate = predicateOptions.find((p) => p.className === selectedPredicateClass);
  const [currentParsedExpression, setCurrentParsedExpression] = useState<EntitleNetExpression["parsedExpression"] | undefined>(expression?.parsedExpression);

  useEffect(() => { setCurrentParsedExpression(expression?.parsedExpression); }, [expression?.parsedExpression]);

  const onPredicateChanged = (event: any) => {
    const val = event.detail.value as string | null;
    setSelectedPredicateClass(val || undefined);
  };

  // Dialog for browsing supported predicates
  const predicateDialogRef = useRef<ojDialog>(null);
  const openPredicateDialog = (event?: any) => {
    if (event?.preventDefault) event.preventDefault();
    const dlg = predicateDialogRef.current;
    if (dlg && typeof dlg.open === "function") {
      dlg.open();
    }
  };
  const closePredicateDialog = () => {
    const dlg = predicateDialogRef.current;
    if (dlg && typeof dlg.close === "function") {
      dlg.close();
    }
  };

  // Adapted helpers from parsed-expression-tree.js
  const createParsedExpressionNode = (
    name: string,
    values: string[] = [],
    predicateType: ParsedExpressionType = ParsedExpressionType.Predicate
  ) => {
    const node: any = { name, type: predicateType };
    // Only include arguments when non-empty to mirror legacy logic
    if (values.length > 0) node.arguments = values;
    return node;
  };

  const supportedPredsButton = !readonly ? (
    <oj-c-button
      class="oj-sm-margin-top"
      chroming="outlined"
      onojAction={openPredicateDialog}
      disabled={ !expression || (expression.supportedPredicates?.length ?? 0) === 0 }
      label="Preds"
    ></oj-c-button>
  ) : (<></>);

  const policyResourceId = expression?.resourceId ? (
    <oj-text-area
      class="cfe-form-input-textarea"
      resize-behavior="vertical"
      label-edge="none"
      value={expression?.resourceId}
      readonly={true}
      disabled={true}
      title="Resource Id"
    />
  ) : (<></>);

  // Build rows for oj-table representation of parsedExpression
  type ParsedRow = { id: string; depth: number; type: string; name?: string; args?: string };

  const simpleClassName = (fqcn?: string): string => {
    if (!fqcn) return "";
    const noPkg = (fqcn.split(".").pop() || fqcn);
    return (noPkg.split("$").pop() || noPkg);
  };

  const buildTreeRows = (root?: EntitleNetExpression["parsedExpression"]): ParsedRow[] => {
    const rows: ParsedRow[] = [];
    let idCounter = 0;
    const walk = (node: any, depth: number) => {
      if (!node) return;
      rows.push({
        id: String(idCounter++),
        depth,
        type: String(node.type ?? "node"),
        name: simpleClassName(node.name ?? ""),
        args: Array.isArray(node.arguments) && node.arguments.length ? (node.arguments as string[]).join(", ") : ""
      });
      const children = (node.children as any[]) || [];
      children.forEach((child) => walk(child, depth + 1));
    };
    if (root) walk(root, 0);
    return rows;
  };

  const treeRows = buildTreeRows(currentParsedExpression);
  const treeDataProvider = new MutableArrayDataProvider<string, ParsedRow>(treeRows as any, { keyAttributes: "id" });
  const treeColumns: any[] = [
    { headerText: "#", field: "depth", width: "3rem", resizable: "enabled" },
    { headerText: "Type", field: "type", width: "6rem", resizable: "enabled" },
    { headerText: "Name", field: "name", width: "10rem", resizable: "enabled" },
    { headerText: "Args", field: "args", resizable: "enabled" }
  ];
  const policyParsedTable = expression ? (
    <oj-table
      class="oj-sm-margin-top"
      style="min-width:23rem"
      aria-label="Parsed Expression Tree"
      data={treeDataProvider}
      columns={treeColumns}
    ></oj-table>
  ) : (
    <></>
  );

  const handleRawValueChanged = (e: ojTextArea.valueChanged) => {
    const nextString = e.detail.value as string;
    const current = expression;

    // Skip change when stringExpression equal to the changed value
    if (current?.stringExpression === nextString) return;

    const nextValue = {
      resourceId: current?.resourceId ?? "",
      stringExpression: nextString
    };

    // Replace the event's value so the shared handler updates the model with the structured object
    (e as any).detail.value = nextValue;
    valueChangedHandler((e as unknown) as ojInputText.valueChanged);
  };

  const policyStringEditor = (
    <oj-text-area
      class={`cfe-form-input-textarea ${formModel.hasPropertyChanged(name) && !readonly && !disabled ? 'wrc-field-highlight' : ''}`}
      resize-behavior="vertical"
      rows={10}
      label-edge="none"
      value={stringExpression}
      title={title}
      disabled={disabled}
      readonly={readonly}
      required={required}
      onrawValueChanged={handleRawValueChanged}
      data-property={name}
    />
  );

  return (
    <div class="oj-flex oj-flex-item">
      <span class={`wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) ? 'wrc-field-highlight' : ''}`}>
        {supportedPredsButton}
        {policyStringEditor}
        {policyResourceId}
        {policyParsedTable}
        <oj-dialog
          ref={predicateDialogRef}
          id={`${name}-predicates-dialog`}
          dialog-title="Supported Predicates"
          initial-visibility="hide"
          cancel-behavior="icon"
        >
          <div slot="body">
            <oj-form-layout label-edge="start" label-width="35%">
              <oj-label slot="label" for={`${name}-predicate-select`}>
                <span>Predicate:</span>
              </oj-label>
              <oj-select-single
                id={`${name}-predicate-select`}
                value={selectedPredicateClass}
                data={selectionDataProvider}
                itemText={itemText}
                onvalueChanged={onPredicateChanged}
              ></oj-select-single>
            </oj-form-layout>
            <div class="oj-sm-margin-top">
              <span
                dangerouslySetInnerHTML={{
                  __html: selectedPredicate?.descriptionHTML || ""
                }}
              ></span>
            </div>
            {(selectedPredicate?.arguments?.length ?? 0) > 0 ? (
              <div class="oj-sm-margin-top">
                <div><strong>Arguments</strong></div>
                <ul class="oj-typography-body-sm oj-sm-padding-start">
                  {selectedPredicate!.arguments!.map((arg) => (
                    <li>
                      <div><strong>{arg.displayName}</strong></div>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: arg.descriptionHTML || ""
                        }}
                      ></span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <div slot="footer">
            <oj-c-button label={t["wrc-common"].buttons.ok.label} onojAction={closePredicateDialog}>
              <span class="button-label">{t["wrc-common"].buttons.ok.label}</span>
            </oj-c-button>
          </div>
        </oj-dialog>
      </span>
    </div>
  );
};

export default PolicyExpression;
