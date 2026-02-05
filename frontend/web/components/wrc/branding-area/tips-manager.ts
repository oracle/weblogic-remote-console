/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 *
 * TipsManager (VDOM/TS)
 * - Loads wrc/config/tips.yaml via RequireJS text! and parses with js-yaml.
 * - Provides a small, typed, synchronous API with one-time lazy initialization.
 */

import { parseIni } from "wrc/shared/ini-file";
// Inline the INI text at runtime using RequireJS text! plugin
import tipsIniText = require("text!./tips.ini");
import * as Logger from "ojs/ojlogger";

export type TipCategoryId =
  | "productivity"
  | "personalization"
  | "whereis"
  | "accessibility"
  | "connectivity"
  | "security"
  | "other"
  | string;

export interface TipSchemaCategory {
  id: TipCategoryId;
}

export interface TipSchema {
  categories: TipSchemaCategory[];
}

export interface TipConfigEntry {
  id?: string;
  category: TipCategoryId;
  visible: boolean;
}

export interface TipsYaml {
  schema?: TipSchema;
  tips?: TipConfigEntry[];
}

export interface Tip {
  id: string;
  category: TipCategoryId;
  visible: boolean;
}

/**
 * Internal store with one-time lazy init and simple, fast getters.
 */
class TipsStore {
  private initialized = false;
  private schema: TipSchema = { categories: [] };
  private tips: Tip[] = [];

  private init() {
    if (this.initialized) return;
    try {
      const data = parseIni(String(tipsIniText));

      // Build schema categories from [categories] section keys
      try {
        const categoriesSection = (data && typeof data === "object" ? (data as any)["categories"] : undefined) || {};
        const categoryIds = Object.keys(categoriesSection);
        if (categoryIds.length > 0) {
          this.schema = { categories: categoryIds.map((id) => ({ id: id as TipCategoryId })) };
        }
      } catch (_e) {
        this.schema = { categories: [] };
      }

      const isKnownCategory = (cat: TipCategoryId) =>
        this.schema.categories.some((c) => c.id === cat);

      // Collect tips from sections named "tip*"
      const tips: Tip[] = [];
      for (const [sectionName, sectionValue] of Object.entries(data || {})) {
        if (sectionName === "categories") continue;
        if (!/^tip/i.test(sectionName)) continue;
        const sectionObj = sectionValue as any;
        const category = String(sectionObj?.category || "").trim() as TipCategoryId;
        const visibleRaw = String(sectionObj?.visible || "").trim().toLowerCase();
        const visible = visibleRaw === "true" || visibleRaw === "1" || visibleRaw === "yes";
        if (!category || !isKnownCategory(category)) continue;
        tips.push({ id: sectionName, category, visible });
      }
      this.tips = tips;
    } catch (e) {
      // Do not fail app on INI issues; leave store empty and log
      try { Logger.error(`Failed to load tips.ini: ${JSON.stringify(e)}`); } catch { Logger.error("Failed to load tips.ini:" + String(e)); }
      this.schema = { categories: [] };
      this.tips = [];
    } finally {
      this.initialized = true;
    }
  }

  getById(id: string): Tip | undefined {
    this.init();
    return this.tips.find((t) => t.id === id);
  }

  getAll(): Tip[] {
    this.init();
    return this.tips;
  }

  getAllVisible(): Tip[] {
    this.init();
    return this.tips.filter((t) => t.visible);
  }

  getCategories(): TipCategoryId[] {
    this.init();
    const set = new Set<TipCategoryId>(
      this.tips.filter((t) => t.visible).map((t) => t.category)
    );
    return Array.from(set);
  }

  getAllCategories(): TipSchemaCategory[] {
    this.init();
    return this.schema.categories;
  }
}

const TipsManager = new TipsStore();
export default TipsManager;
export { TipsManager };
