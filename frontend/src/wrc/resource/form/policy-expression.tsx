/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import { Dispatch, useRef, useState, useEffect } from "preact/hooks";
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import { FormContentModel } from "../../shared/model/formcontentmodel";
import { Property } from "../../shared/typedefs/pdj";
import { EntitleNetExpression, ParsedExpressionType, ParsedExpression } from "../../shared/typedefs/rdj";
import "oj-c/action-card";
import "oj-c/button";
import { ojDialog } from "ojs/ojdialog";
import "ojs/ojselectsingle";
import "ojs/ojformlayout";
import "ojs/ojlabel";
import "ojs/ojlabelvalue";
import "oj-c/input-text";
import "oj-c/select-single";
import MutableArrayDataProvider = require( "ojs/ojmutablearraydataprovider");

const BUILT_IN_PREDICATE_SYNONYMS: Record<string, string> = {
  "weblogic.console.wls.rest.extension.security.authorization.predicates.GroupPredicate": "Grp",
  "weblogic.console.wls.rest.extension.security.authorization.predicates.UserPredicate": "Usr",
  "weblogic.console.wls.rest.extension.security.authorization.predicates.RolePredicate": "Rol"
};

/**
 * PolicyExpression renders the role and policy expression values
 */
type Props = {
  fieldDescription: Property;
  formModel: FormContentModel;
  valueChangedHandler: (event: { detail: { value: unknown } }) => void;
  setModel?: Dispatch<FormContentModel>;
};



const PolicyExpression = ({ fieldDescription, formModel, valueChangedHandler, setModel }: Props) => {
  const name = fieldDescription.name;
  const isReadOnly = formModel.isReadOnly(fieldDescription);
  const rawValue = formModel.getProperty(name);



  // Treat value as an expression when present; fall back to string/token handling.
  const expression: EntitleNetExpression | undefined =
    rawValue && typeof rawValue === "object" && (
      'stringExpression' in (rawValue as Record<string, unknown>) ||
      'parsedExpression' in (rawValue as Record<string, unknown>)
    )
      ? (rawValue as EntitleNetExpression)
      : undefined;

  const predicateOptions = expression?.supportedPredicates ?? [];
  const [selectedPredicateClass, setSelectedPredicateClass] = useState<string | undefined>(undefined);
  const selectionOptions = (predicateOptions || []).map((p) => ({ label: p.displayName, value: p.className }));
  const selectionDataProvider = new MutableArrayDataProvider(selectionOptions, { keyAttributes: "value" });
  const itemText = (opt: { data: { label: string; value: string } }) => opt.data.label ?? opt.data.value;
  const selectedPredicate = predicateOptions.find((p) => p.className === selectedPredicateClass);
  const [currentParsedExpression, setCurrentParsedExpression] = useState<EntitleNetExpression["parsedExpression"] | undefined>(expression?.parsedExpression);
  const [renderKey, setRenderKey] = useState(0); // Force re-render key

  // Convert enum values to human-readable strings
  const getNodeTypeDisplayName = (type: ParsedExpressionType): string => {
    switch (type) {
      case ParsedExpressionType.And: return t["wrc-policy-expression"].labels.nodeType.and;
      case ParsedExpressionType.Or: return t["wrc-policy-expression"].labels.nodeType.or;
      case ParsedExpressionType.Group: return t["wrc-policy-expression"].labels.nodeType.group;
      case ParsedExpressionType.Predicate: return t["wrc-policy-expression"].labels.nodeType.predicate;
      case ParsedExpressionType.Negate: return t["wrc-policy-expression"].labels.nodeType.not;
      default: return String(type).toUpperCase();
    }
  };

  // Predicate className synonyms for display
  const getPredicateDisplayName = (className: string): string => BUILT_IN_PREDICATE_SYNONYMS[className] || className;

  const isBuiltInPredicate = (className: string): boolean => {
    return Object.prototype.hasOwnProperty.call(BUILT_IN_PREDICATE_SYNONYMS, className);
  };

  // Build string representation from current parsed expression
  const buildStringExpression = (node?: ParsedExpression): string => {
    if (!node) return "";

    let result: string;
    switch (node.type) {
      case ParsedExpressionType.Predicate: {
        const className = node.name || "";
        const displayName = getPredicateDisplayName(className);
        const hasArgs = (node.arguments?.length ?? 0) > 0;
        const argPayload = hasArgs ? node.arguments!.join(",") : "";
        if (isBuiltInPredicate(className)) {
          result = `${displayName}${hasArgs ? `(${argPayload})` : ""}`;
        } else {
          result = `?${displayName}(${argPayload})`;
        }
        break;
      }

      case ParsedExpressionType.Group: {
        if (node.children && node.children.length > 0) {
          result = `{${buildStringExpression(node.children[0])}}`;
        } else {
          result = "{}";
        }
        break;
      }

      case ParsedExpressionType.And: {
        if (node.children && node.children.length > 0) {
          const childStrings = node.children.map(child => buildStringExpression(child));
          result = childStrings.join("&");
        } else {
          result = "";
        }
        break;
      }

      case ParsedExpressionType.Or: {
        if (node.children && node.children.length > 0) {
          const childStrings = node.children.map(child => buildStringExpression(child));
          result = childStrings.join("|");
        } else {
          result = "";
        }
        break;
      }

      case ParsedExpressionType.Negate: {
        if (node.children && node.children.length > 0) {
          result = `~${buildStringExpression(node.children[0])}`;
        } else {
          result = "~";
        }
        break;
      }

      default:
        result = "";
    }
    return result;
  };

  const stringExpression: string = currentParsedExpression
    ? buildStringExpression(currentParsedExpression)
    : (expression?.stringExpression ?? (typeof rawValue === "string" ? rawValue : ""));

  useEffect(() => { setCurrentParsedExpression(expression?.parsedExpression); }, [expression?.parsedExpression]);

  // Force re-render when transitioning between expression states
  useEffect(() => {
    setRenderKey(prev => prev + 1);
  }, [!!currentParsedExpression]); // Trigger on boolean change

  const onPredicateChanged = (event: { detail: { value: string | null } }) => {
    const val = event.detail.value;
    setSelectedPredicateClass(val || undefined);
  };

  // Dialog for browsing supported predicates
  const predicateDialogRef = useRef<ojDialog>(null);
  const closePredicateDialog = () => {
    const dlg = predicateDialogRef.current;
    if (dlg && typeof dlg.close === "function") {
      dlg.close();
    }
  };





  // Visual Builder Components

  // Function to update the parsed expression and notify backend
  const updateParsedExpression = (newParsedExpression: ParsedExpression | undefined) => {
    if (isReadOnly) return;

    const current = expression;
    const nextValue = {
      resourceId: current?.resourceId ?? "",
      supportedPredicates: current?.supportedPredicates ?? [],
      parsedExpression: newParsedExpression
      // Don't send stringExpression - let backend generate it from parsedExpression
    };

    // Update the form model FIRST to ensure backend consistency
    if (setModel) {
      const updatedModel = formModel.clone();
      updatedModel.setProperty(name, nextValue);
      setModel(updatedModel);
    } else {
      // Fallback to valueChangedHandler
      const fakeEvent = {
        detail: { value: nextValue }
      };
      valueChangedHandler(fakeEvent);
    }

    // Update local state AFTER form model update for proper synchronization
    // Use setTimeout to ensure proper sequencing
    setTimeout(() => setCurrentParsedExpression(newParsedExpression), 0);
  };

  // Recursive component for rendering expression nodes
  type ExpressionNodeProps = {
    node: ParsedExpression;
    path: number[]; // path to this node in the tree
    parentType?: ParsedExpressionType;
    onUpdate: (path: number[], newNode: ParsedExpression) => void;
    onDelete: (path: number[]) => void;
  };

  const ExpressionNode = ({ node, path, parentType, onUpdate, onDelete }: ExpressionNodeProps) => {
    const [argsValues, setArgsValues] = useState<string[]>(node.arguments || []);

    const handleAddChild = (type: ParsedExpressionType) => {
      if (isReadOnly) return;

      const updatedNode = { ...node };
      const currentChildCount = updatedNode.children?.length ?? 0;

      if (node.type === ParsedExpressionType.Group && type === ParsedExpressionType.Group) {
        return; // Groups should not allow adding groups directly
      }

      // Special handling for Group nodes: allow composing more complex expressions
      // - If a Group already has 1 child and user adds AND/OR: wrap existing child inside that operator
      // - Do NOT implicitly create AND/OR when adding Predicate; require explicit operator add first
      if (node.type === ParsedExpressionType.Group && currentChildCount >= 1) {
        if (type === ParsedExpressionType.And || type === ParsedExpressionType.Or) {
          const existingChildren = updatedNode.children || [];
          const newOp: ParsedExpression = {
            type,
            children: existingChildren,
          };
          updatedNode.children = [newOp];
          onUpdate(path, updatedNode);
          return; // handled
        }
        if (type === ParsedExpressionType.Predicate) {
          const existing = updatedNode.children?.[0];
          if (existing && (existing.type === ParsedExpressionType.And || existing.type === ParsedExpressionType.Or)) {
            const nextExisting = { ...existing };
            if (!nextExisting.children) nextExisting.children = [];
            nextExisting.children.push({ type: ParsedExpressionType.Predicate, name: "", arguments: [] });
            updatedNode.children = [nextExisting];
            onUpdate(path, updatedNode);
          }
          // If group child is not an operator, ignore predicate add to avoid implicit AND creation.
          return;
        }
        if (type === ParsedExpressionType.Negate) {
          // Allow negating populated groups by wrapping the current group node.
          const negateNode: ParsedExpression = {
            type: ParsedExpressionType.Negate,
            children: [updatedNode]
          };
          onUpdate(path, negateNode);
          return; // handled
        }
        // For Negate/Group under Group when already has a child: ignore (not supported)
        return;
      }
      if (node.type === ParsedExpressionType.Negate && currentChildCount >= 1) {
        return; // Negate can have max 1 child
      }

      if (type === ParsedExpressionType.Predicate) {
        if (node.type === ParsedExpressionType.And || node.type === ParsedExpressionType.Or) {
          // For AND/OR nodes, if we already have 2 children, we need to nest
          if (currentChildCount >= 2) {
            // Create a new nested AND/OR with the last child and the new predicate
            const lastChild = updatedNode.children![updatedNode.children!.length - 1];
            const newNestedOp: ParsedExpression = {
              type: node.type, // Same type as parent (AND or OR)
              children: [
                lastChild,
                { type: ParsedExpressionType.Predicate, name: "", arguments: [] }
              ]
            };
            // Replace the last child with the nested operation
            updatedNode.children![updatedNode.children!.length - 1] = newNestedOp;
          } else {
            // Just add the predicate normally
            if (!updatedNode.children) updatedNode.children = [];
            updatedNode.children.push({ type: ParsedExpressionType.Predicate, name: "", arguments: [] });
          }
        } else {
          // For other node types (non-Group), just add the predicate normally
          if (!updatedNode.children) updatedNode.children = [];
          updatedNode.children.push({ type: ParsedExpressionType.Predicate, name: "", arguments: [] });
        }
      } else if (type === ParsedExpressionType.And || type === ParsedExpressionType.Or) {
        // Create an empty AND/OR node that adopts existing children (do not prepopulate any predicate)
        const existingChildren = updatedNode.children || [];
        const newChild: ParsedExpression = {
          type,
          children: existingChildren
        };
        updatedNode.children = [newChild];
      } else if (type === ParsedExpressionType.Negate) {
        // For any node type, wrap the current node with a Negate parent
        const negateNode: ParsedExpression = {
          type: ParsedExpressionType.Negate,
          children: [updatedNode]
        };
        onUpdate(path, negateNode);
        return; // Early return since we replaced the node entirely
      } else {
        // For Group and other types, create them directly
        const newChild = { type, children: [] };
        if (!updatedNode.children) updatedNode.children = [];
        updatedNode.children.push(newChild);
      }

      onUpdate(path, updatedNode);
    };

    const handleUpdateChild = (childIndex: number, newChild: ParsedExpression) => {
      if (isReadOnly) return;

      const updatedNode = { ...node };
      if (updatedNode.children) {
        updatedNode.children[childIndex] = newChild;
        onUpdate(path, updatedNode);
      }
    };

    const handleDeleteChild = (childIndex: number) => {
      if (isReadOnly) return;

      const updatedNode = { ...node };
      if (updatedNode.children) {
        if (node.type === ParsedExpressionType.Negate) {
          removeNodeAtPath(path);
          return;
        }
        const target = updatedNode.children[childIndex];
        if (target?.type === ParsedExpressionType.Negate) {
          const promoted = target.children?.[0];
          if (promoted) {
            updatedNode.children[childIndex] = promoted;
          } else {
            updatedNode.children.splice(childIndex, 1);
          }
        } else {
          updatedNode.children.splice(childIndex, 1);
        }
        onUpdate(path, updatedNode);
      }
    };

    const handleArgsChange = (newArgs: string[]) => {
      if (isReadOnly) return;

      const updatedNode = { ...node, arguments: newArgs };
      onUpdate(path, updatedNode);
    };

    const handleNameChange = (newName: string) => {
      if (isReadOnly) return;

      // Clear arguments when switching predicates since different predicates have different argument schemas
      const updatedNode = { ...node, name: newName, arguments: [] };
      setArgsValues([]); // Reset local state too
      onUpdate(path, updatedNode);
    };



    const isNegate = node.type === ParsedExpressionType.Negate;
    const isOperator = node.type === ParsedExpressionType.And || node.type === ParsedExpressionType.Or;
    const isGroup = node.type === ParsedExpressionType.Group;
    const isPredicate = node.type === ParsedExpressionType.Predicate;
    return (
      <div class={`expression-node ${isNegate ? 'oj-bg-danger-30' : isOperator ? 'oj-bg-warning-20' : isGroup ? 'oj-bg-neutral-20' : isPredicate ? 'oj-bg-info-20' : 'oj-bg-neutral-30'}`} style={{
        marginLeft: `${path.length * 20}px`,
        marginBottom: '8px',
        padding: '12px',
        border: '2px solid #d6d6d6',
        borderRadius: '8px',
        backgroundColor: isNegate || isOperator || isGroup || isPredicate ? undefined : '#f8f9fa',
        cursor: 'default'
      }}>
        <div class="node-header">
          {node.type === ParsedExpressionType.Predicate ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {!isReadOnly && (
                <oj-c-button
                  data-testid="delete-node"
                  chroming="borderless"
                  size="sm"
                  display="icons"
                  onojAction={() => onDelete(path)}
                >
                  <span slot="startIcon" class="oj-ux-ico-trash"></span>
                </oj-c-button>
              )}
              {!isReadOnly && parentType !== ParsedExpressionType.Negate && (
                <oj-c-button
                  data-testid="add-negate-node"
                  chroming="outlined"
                  size="sm"
                  label={t["wrc-policy-expression"].buttons.negate.label}
                  onojAction={() => handleAddChild(ParsedExpressionType.Negate)}
                />
              )}

              <div class="oj-flex oj-flex-col oj-sm-12 oj-sm-margin-top-1">
              <oj-label class="oj-sm-margin-bottom-1">{t["wrc-policy-expression"].labels.predicate.value}</oj-label>
              <oj-c-select-single
                data-testid={`predicate-select-${path.join('-')}`}
                value={node.name || ""}
                data={selectionDataProvider}
                itemText={itemText}
                onvalueChanged={(e: { detail: { value: string } }) => handleNameChange(e.detail.value)}
                placeholder={t["wrc-policy-expression"].placeholders.selectPredicate.value}
                  class="oj-sm-12"
                  labelEdge="none"
                  readonly={isReadOnly}
                />
              </div>
              {node.name && (() => {
                const nodePredicate = predicateOptions.find(p => p.className === node.name);
                return (nodePredicate?.arguments || []).map((arg, idx) => (
                  <div key={idx} class="oj-flex oj-flex-col oj-sm-12 oj-sm-margin-top-1">
                    <oj-label class="oj-sm-margin-bottom-1">{arg.displayName}</oj-label>
                    <oj-input-text
                      data-testid={`predicate-arg-${path.join('-')}-${idx}`}
                      value={argsValues[idx] || ""}
                      helpHints={{ definition: arg.descriptionHTML || arg.displayName }}
                      required={!arg.optional}
                      onvalueChanged={(e: { detail: { value: string } }) => {
                        const newArgs = [...argsValues];
                        newArgs[idx] = e.detail.value;
                        setArgsValues(newArgs);
                        handleArgsChange(newArgs);
                      }}
                      readonly={isReadOnly}
                      class="oj-sm-12"
                    />
                  </div>
                ));
              })()}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span class="node-type">{getNodeTypeDisplayName(node.type)}</span>
              {!isReadOnly && (
                <oj-c-button
                  data-testid="delete-node"
                  chroming="borderless"
                  size="sm"
                  display="icons"
                  onojAction={() => onDelete(path)}
                >
                  <span slot="startIcon" class="oj-ux-ico-trash"></span>
                </oj-c-button>
              )}

              {!isReadOnly && node.type !== ParsedExpressionType.Negate && (
                <>
                  <oj-c-button
                    data-testid="add-predicate-node"
                    chroming="outlined"
                    size="sm"
                    label={t["wrc-policy-expression"].buttons.addPredicate.label}
                    onojAction={() => handleAddChild(ParsedExpressionType.Predicate)}
                  />
                  {node.type !== ParsedExpressionType.Group && (
                    <oj-c-button
                      data-testid="add-group-node"
                      chroming="outlined"
                      size="sm"
                      label={t["wrc-policy-expression"].buttons.addGroup.label}
                      onojAction={() => handleAddChild(ParsedExpressionType.Group)}
                    />
                  )}
                  <oj-c-button
                    data-testid="add-and-node"
                    chroming="outlined"
                    size="sm"
                    label={t["wrc-policy-expression"].buttons.addAnd.label}
                    onojAction={() => handleAddChild(ParsedExpressionType.And)}
                  />
                  <oj-c-button
                    data-testid="add-or-node"
                    chroming="outlined"
                    size="sm"
                    label={t["wrc-policy-expression"].buttons.addOr.label}
                    onojAction={() => handleAddChild(ParsedExpressionType.Or)}
                  />
                  {parentType !== ParsedExpressionType.Negate && (
                    <oj-c-button
                      data-testid="add-negate-node"
                      chroming="outlined"
                      size="sm"
                      label={t["wrc-policy-expression"].buttons.negate.label}
                      onojAction={() => handleAddChild(ParsedExpressionType.Negate)}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>
        
        {node.children && node.children.length > 0 && (
          <div class="node-children policy-expression-node-children">
            {node.children.map((child, idx) => (
              <ExpressionNode
                node={child}
                path={[...path, idx]}
                parentType={node.type}
                onUpdate={(childPath, newChild) => handleUpdateChild(childPath[childPath.length - 1], newChild)}
                onDelete={(childPath) => handleDeleteChild(childPath[childPath.length - 1])}
              />
            ))}
          </div>
        )}
        
        {null}
      </div>
    );
  };

  // Handler for updating the root expression
  const handleExpressionUpdate = (path: number[], newNode: ParsedExpression) => {
    if (isReadOnly) return;

    if (path.length === 0) {
      // Root update
      updateParsedExpression(newNode);
    } else {
      // Deep update - need to traverse and update
      const updateNode = (node: ParsedExpression, path: number[]): ParsedExpression => {
        if (path.length === 0) return newNode;
        const [idx, ...rest] = path;
        const updatedNode = { ...node };
        if (updatedNode.children && updatedNode.children[idx]) {
          updatedNode.children[idx] = updateNode(updatedNode.children[idx], rest);
        }
        return updatedNode;
      };
      const newRoot = updateNode(currentParsedExpression!, path);
      updateParsedExpression(newRoot);
    }
  };

  const removeNodeAtPath = (path: number[]) => {
    if (isReadOnly) return;

    if (path.length === 0) {
      updateParsedExpression(undefined);
      return;
    }
    const removeFromNode = (node: ParsedExpression, path: number[]): ParsedExpression | undefined => {
      if (path.length === 1) {
        const updatedNode = { ...node };
        if (updatedNode.children) {
          updatedNode.children.splice(path[0], 1);
          return updatedNode.children.length > 0 ? updatedNode : undefined;
        }
        return node;
      }
      const [idx, ...rest] = path;
      const updatedNode = { ...node };
      if (updatedNode.children && updatedNode.children[idx]) {
        updatedNode.children[idx] = removeFromNode(updatedNode.children[idx], rest) || updatedNode.children[idx];
      }
      return updatedNode;
    };
    const newRoot = removeFromNode(currentParsedExpression!, path);
    updateParsedExpression(newRoot);
  };

  const handleExpressionDelete = (path: number[]) => {
    if (isReadOnly) return;

    if (path.length === 0) {
      // Removing the root node
      if (currentParsedExpression?.type === ParsedExpressionType.Negate) {
        const promoted = currentParsedExpression.children?.[0];
        updateParsedExpression(promoted ?? undefined);
      } else if (currentParsedExpression && currentParsedExpression.children && currentParsedExpression.children.length > 0) {
        // For other nodes, promote the first child to be the new root
        updateParsedExpression(currentParsedExpression.children[0]);
      } else {
        updateParsedExpression(undefined);
      }
    } else if (path.length === 1) {
      // Deleting a root child - remove it from children array
      const newRoot = { ...currentParsedExpression! };
      if (newRoot.children) {
        const target = newRoot.children[path[0]];
        if (target?.type === ParsedExpressionType.Negate) {
          const promoted = target.children?.[0];
          if (promoted) {
            newRoot.children[path[0]] = promoted;
          } else {
            newRoot.children.splice(path[0], 1);
          }
        } else {
          newRoot.children.splice(path[0], 1);
        }
        updateParsedExpression(newRoot.children.length > 0 ? newRoot : undefined);
      }
    } else {
      // Deep delete - traverse and remove
      const deleteFromNode = (node: ParsedExpression, path: number[]): ParsedExpression | undefined => {
        if (path.length === 1) {
          const updatedNode = { ...node };
          if (updatedNode.children) {
            if (node.type === ParsedExpressionType.Negate) {
              return undefined;
            }
            const target = updatedNode.children[path[0]];
            if (target?.type === ParsedExpressionType.Negate) {
              const promoted = target.children?.[0];
              if (promoted) {
                updatedNode.children[path[0]] = promoted;
              } else {
                updatedNode.children.splice(path[0], 1);
              }
            } else {
              updatedNode.children.splice(path[0], 1);
            }
            return updatedNode.children.length > 0 ? updatedNode : undefined;
          }
          return node;
        }
        const [idx, ...rest] = path;
        const updatedNode = { ...node };
        if (updatedNode.children && updatedNode.children[idx]) {
          updatedNode.children[idx] = deleteFromNode(updatedNode.children[idx], rest) || updatedNode.children[idx];
        }
        return updatedNode;
      };
      const newRoot = deleteFromNode(currentParsedExpression!, path);
      updateParsedExpression(newRoot);
    }
  };

  const visualBuilder = expression ? (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div class="builder-header" style={{ marginBottom: '16px' }}>
        {/* <h4>Policy Expression Builder</h4> */}
        {!isReadOnly && !currentParsedExpression && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            <oj-c-button
              data-testid="add-predicate-root"
              chroming="outlined"
              label={t["wrc-policy-expression"].buttons.addPredicate.label}
              onojAction={() =>
                updateParsedExpression({
                  type: ParsedExpressionType.Predicate,
                  name: "",
                  arguments: [],
                })
              }
            />
            <oj-c-button
              data-testid="add-and-root"
              chroming="outlined"
              label={t["wrc-policy-expression"].buttons.addAnd.label}
              onojAction={() =>
                updateParsedExpression({
                  type: ParsedExpressionType.And,
                  children: [],
                })
              }
            />
            <oj-c-button
              data-testid="add-or-root"
              chroming="outlined"
              label={t["wrc-policy-expression"].buttons.addOr.label}
              onojAction={() =>
                updateParsedExpression({
                  type: ParsedExpressionType.Or,
                  children: [],
                })
              }
            />
            <oj-c-button
              data-testid="add-group-root"
              chroming="outlined"
              label={t["wrc-policy-expression"].buttons.addGroup.label}
              onojAction={() =>
                updateParsedExpression({
                  type: ParsedExpressionType.Group,
                  children: [],
                })
              }
            />
          </div>
        )}
      </div>

      <div
        key={renderKey}
        class="expression-tree-container"
        style={{ flex: '0 0 auto', maxWidth: "1200px", overflowX: "auto", overflowY: "visible" }}
      >
        <div style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {currentParsedExpression && (
            <ExpressionNode
              key={`node-root-${renderKey}`}
              node={currentParsedExpression}
              path={[]}
              onUpdate={handleExpressionUpdate}
              onDelete={handleExpressionDelete}
            />
          )}
        </div>
      </div>

      {/* {policyParsedTable} */}

      <div style={{ borderTop: '1px solid #e0e0e0', marginTop: '24px', paddingTop: '16px', flex: '0 0 auto' }}>
        <div class="expression-string" style={{ display: 'flex', flexDirection: 'column' }}>
          {stringExpression ? (
            <>
              <div style={{ marginBottom: '12px', display: 'block', width: '100%' }}>
                <oj-label>
                  {t["wrc-policy-expression"].labels.expression.value}
                </oj-label>
              </div>
              <div class="expression-text-display" style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '3px',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                padding: '8px'
              }}>
                {stringExpression}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div>{t["wrc-policy-expression"].messages.noExpressionData.value}</div>
  );

  return (
    <div class="oj-flex oj-flex-item">
      <span class={`wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) ? 'wrc-field-highlight' : ''}`}>
        {visualBuilder}
        {/* {policyResourceId} */}
        <oj-dialog
          ref={predicateDialogRef}
          id={`${name}-predicates-dialog`}
          dialog-title={t["wrc-policy-expression"].titles.supportedPredicates.value}
          initial-visibility="hide"
          cancel-behavior="icon"
        >
          <div slot="body">
            <oj-form-layout label-edge="start" label-width="35%">
              <oj-label slot="label" for={`${name}-predicate-select`}>
                <span>{t["wrc-policy-expression"].labels.predicateWithColon.value}</span>
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
                <div><strong>{t["wrc-policy-expression"].labels.arguments.value}</strong></div>
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
