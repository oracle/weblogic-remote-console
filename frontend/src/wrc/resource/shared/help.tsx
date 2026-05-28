/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import { FormContentModel } from "../../shared/model/formcontentmodel";
import { TableContentModel } from "../../shared/model/tablecontentmodel";
import { HelpTable } from "./help-table";

const HelpColumnLabels = {
  name: t["wrc-help-form"].tables.help.columns.header.name,
  description: t["wrc-help-form"].tables.help.columns.header.description,
};

export const Help = ({ model }: { model: FormContentModel | TableContentModel }) => {
  return (
    <HelpTable
      tableDefinition={{
        columns: [
          { header: HelpColumnLabels.name },
          { header: HelpColumnLabels.description },
        ],
        rows: model?.getDetailedHelp() || [],
        helpTopics: model?.getHelpTopics() || [],
      }}
    ></HelpTable>
  );
};
