/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import { HelpData } from "wrc/shared/typedefs/common";
import { ExternalHelp, HelpTopic } from "wrc/shared/typedefs/pdj";

type TableRow = HelpData;
type TableColumn = { header: string };

export type TableDef = {
  columns: TableColumn[];
  rows: TableRow[];
  helpTopics: HelpTopic[];
};

const HelpHeader = ({
  nameText,
  descriptionText,
}: {
  nameText: string;
  descriptionText: string;
}) => {
  return (
    <thead class="oj-table-header">
      <tr class="oj-table-header-row">
        <th
          class="oj-table-column-header-cell oj-table-header-cell-wrap-text"
          title={nameText}
          id="help-table:_hdrCol0"
        >
          <div class="oj-table-column-header">
            <div class="oj-table-column-header-text">{nameText}</div>
          </div>
        </th>
        <th
          class="oj-table-column-header-cell oj-table-header-cell-wrap-text"
          title={descriptionText}
          id="help-table:_hdrCol1"
        >
          <div class="oj-table-column-header">
            <div class="oj-table-column-header-text">{descriptionText}</div>
          </div>
        </th>
      </tr>
    </thead>
  );
};

const HelpFooter = ({ tableDef }: { tableDef: TableDef }) => {
  const { helpTopics } = tableDef;

  const expandHelpTopics = () => {
    if (helpTopics && helpTopics.length > 0) {
      return (
        <>
          <p
            dangerouslySetInnerHTML={{
              __html: t["wrc-help-form"].labels.relatedTopics.value,
            }}
          ></p>
          <ul>
            {helpTopics.map((helpTopic) => (
              <li>
                <a href="#" data-external-help-link={helpTopic.href}>
                  {helpTopic.label}
                </a>
              </li>
            ))}
          </ul>
        </>
      );
    } else {
      return <></>;
    }
  };
  return (
    <tfoot class="oj-table-footer">
      <tr class="oj-table-footer-row">
        <td colspan={2}>
          <div class="cfe-help-table-footer">{expandHelpTopics()}</div>
        </td>
      </tr>
    </tfoot>
  );
};

const ExternalHelpDetail = ({
  externalHelp,
}: {
  externalHelp?: ExternalHelp;
}) => {
  return externalHelp ? (
    <p>
      {externalHelp.introLabel}
      <br />
      <code>
        {externalHelp.href ? (
          <a href="#" data-external-help-link={externalHelp.href}>
            {externalHelp.label}
          </a>
        ) : (
          <></>
        )}
      </code>
    </p>
  ) : (
    <></>
  );
};

const HelpRow = ({ rowData }: { rowData: TableRow }) => {
  return (
    <tr class="oj-table-body-row">
      <td
        id="help-table:2420395_0"
        class="oj-table-data-cell oj-form-control-inherit"
      >
        {rowData.helpLabel}
      </td>
      <td
        id="help-table:2420395_1"
        class="oj-table-data-cell oj-form-control-inherit"
      >
        <span
          dangerouslySetInnerHTML={{ __html: rowData.detailedHelpHTML || '' }}
        ></span>
        <ExternalHelpDetail
          externalHelp={rowData.externalHelp}
        ></ExternalHelpDetail>
      </td>
    </tr>
  );
};

type Props = { tableDefinition: TableDef };

export const HelpTable = ({ tableDefinition }: Props) => {
  return (
    <table
      id="help-table"
      class="oj-table-element oj-component-initnode"
      aria-labelledby="help-table"
      x-ms-format-detection="none"
    >
      <colgroup class="oj-table-colgroup">
        <col class="oj-table-col"></col>
        <col class="oj-table-col"></col>
      </colgroup>

      <HelpHeader
        nameText={tableDefinition.columns[0].header}
        descriptionText={tableDefinition.columns[1]?.header}
      ></HelpHeader>
      <tbody class="oj-table-body">
        {tableDefinition.rows.map((row) => (
          <HelpRow rowData={row} />
        ))}
      </tbody>

      <HelpFooter tableDef={tableDefinition} />
    </table>
  );
};
