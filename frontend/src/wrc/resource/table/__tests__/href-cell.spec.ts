/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { buildHrefCellData } from "../href-cell";
import { Column } from "../../../shared/typedefs/pdj";
import { PropertyValueHolder } from "../../../shared/typedefs/rdj";

describe("href cell helper", () => {
  it("should extract proxy download metadata from href cells", () => {
    const column = { name: "DownloadLogLink", type: "href", label: "Download" } as Column;
    const holder = {
      value: {
        label: "Download",
        href: "<a href=\"/api/as-conn-1/domainRuntime/downloads/NodeManagerLogs/Machine1\" download=\"Machine1NodeManager.log\" type=\"text/plain\" target=\"_blank\"></a>",
      },
    } as PropertyValueHolder;

    const hrefCell = buildHrefCellData(column, holder);

    expect(hrefCell?.label).toBe("Download");
    expect(hrefCell?.url).toBe("/api/as-conn-1/domainRuntime/downloads/NodeManagerLogs/Machine1");
    expect(hrefCell?.downloadFilename).toBe("Machine1NodeManager.log");
    expect(hrefCell?.mimeType).toBe("text/plain");
  });

  it("should ignore non-href columns", () => {
    const column = { name: "DownloadLogLink", type: "string", label: "Download" } as Column;
    const holder = {
      value: {
        label: "Download",
        href: "<a href=\"/api/download\"></a>",
      },
    } as PropertyValueHolder;

    expect(buildHrefCellData(column, holder)).toBeUndefined();
  });
});
