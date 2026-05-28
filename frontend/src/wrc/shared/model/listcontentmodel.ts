/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { PDJ } from "../typedefs/pdj";
import { ListDatum, RDJ } from "../typedefs/rdj";
import { Model } from "./common";

/**
 * Read-only list content model (no actions).
 * Triggered when PDJ.presentationHint === 'cards' and data is provided by RDJ (inlinePageDescription).
 */
export class ListContentModel extends Model {
  constructor(rdj: RDJ, pdj: PDJ) {
    super(rdj, pdj);
  }

  // Capabilities for lists
  canSaveToCart = false;
  canSaveNow = false;
  canDownload = false;
  canSupportTokens = false;

  /**
   * Returns the list items for card rendering.
   * RDJ.data is expected to be an array of ListDatum when presentationHint === 'cards'.
   */
  getItems(): ListDatum[] {
    const data = this.rdj?.data;
    if (Array.isArray(data)) {
      // Assume backend supplies ListDatum[] for 'cards' lists.
      return data as ListDatum[];
    }
    return [];
  }

  getHelpTopics() {
    return this.pdj.helpTopics;
  }
  
  getPageTitle(): string | undefined {
    return this.rdj?.self?.label;
  }
  
  clone() {
    const clonedModel = Object.create(Object.getPrototypeOf(this));
    Object.assign(clonedModel, this);
    return clonedModel as ListContentModel;
  }
}
