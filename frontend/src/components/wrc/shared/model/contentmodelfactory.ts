/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import { PDJ } from "../typedefs/pdj";
import { RDJ } from "../typedefs/rdj";
import { FormContentModel } from './formcontentmodel';
import { TableContentModel } from "./tablecontentmodel";
import { ListContentModel } from "./listcontentmodel";
import { getData, getDataComponent, fixOrigin } from './transport';

export class ContentModelFactory {
  rdjData: RDJ | undefined;
  baseUrl: string | undefined;
  rdj: string | undefined;
  pdj: string | undefined;

  constructor(rdj?: string, pdj?: string) {
    this.rdj = rdj;
    this.pdj = pdj;
  }

  /**
   * Builds a content model based on the provided RDJ and PDJ URLs.
   *
   * If a slice parameter is provided, it appends the slice query parameter to the RDJ URL.
   *
   * It then retrieves the RDJ and PDJ data using the `getData` function and creates a Form
   * or Table content model instance
   *
   * @async
   * @param {string} [slice] - Optional slice parameter to append to the RDJ URL.
   * @returns {Promise<TableContentModel|FormContentModel|undefined>} A promise resolving to the built content model instance.
   */
  async build(
    slice: string | undefined, 
    context?: string
  ): Promise<TableContentModel | FormContentModel | ListContentModel | undefined> {
    if (this.rdj) {

      if (slice) {
        const u = new URL(this.rdj, window.location.href);
        u.searchParams.set("slice", slice);
        this.rdj = u.pathname + u.search + u.hash;  
      }

      const [rdjData, pdjData] = await getData(this.rdj, this.pdj, context);

      let content;

      if (pdjData) {
        if (pdjData.presentationHint === 'cards') {
          content = new ListContentModel(rdjData, pdjData);
        } else if (pdjData.table || pdjData.sliceTable) {
          content = new TableContentModel(rdjData, pdjData);
        } else {
          content = new FormContentModel(rdjData, pdjData);
        }

        content.rdjUrl = this.rdj;
        content.pdjUrl = this.pdj;
      }

      return content;
    } else {
      if (this.rdjData) {
        let pdjData = this.rdjData.inlinePageDescription;

        if (!pdjData) {
          let pdjUrl = this.rdjData.pageDescription;

          if (this.baseUrl) {
            const u = new URL(this.baseUrl);
            pdjUrl = `${u.protocol}//${u.host}${pdjUrl}`;
          }

          pdjData = await getDataComponent(pdjUrl);
        }

        let content;

        if (pdjData) {
          if (pdjData.presentationHint === 'cards') {
            content = new ListContentModel(this.rdjData, pdjData);
          } else if (pdjData.table || pdjData.sliceTable) {
            content = new TableContentModel(this.rdjData, pdjData);
          } else {
            content = new FormContentModel(this.rdjData, pdjData);
          }
        }

        if (content) {
          content.baseUrl = this.baseUrl;
        }

        return content;
      }
    }
  }
}
