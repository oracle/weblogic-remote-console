/**
 * @license UPL-1.0
 * Copyright (c) 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import { render } from '@testing-library/preact';
import * as readline from 'readline';
import { Resource } from '../resource';
import * as fs from 'fs'
import * as yargs from 'yargs'


describe('Test-based HTML Emitter', () => {
  function do_one(rdj: string, pdj: string, outputfile: string) {
    const { pathToFileURL } = require("url");

    const rdjUrl = pathToFileURL(rdj);
    const pdjUrl = pathToFileURL(pdj);
      let content = render(
        <Resource rdj={rdjUrl.href} pdj={pdjUrl.href} />
    );

    let output = document.getElementsByTagName('wrc-wrc-form')[0].innerHTML;

    fs.writeFileSync(outputfile, output);
  }

  async function processLineByLine(file: string) {
    // const fd = fs.openSync(file, {});
    const stream = fs.createReadStream(file);
    const rl = readline.createInterface(stream);

    for await (const line of rl) {

      const splitme = line.split(':');
      try {
        do_one(splitme[0], splitme[1], splitme[2]);
      } catch(err) {
        const fd = fs.openSync(splitme[2] + ".err", "w");

        if (typeof err === "string") {
          fs.writeSync(fd, "Error: " + err);
        }

        if (err instanceof Error) {
          fs.writeSync(fd, "Error: " + err.message);

          fs.writeSync(fd, err.stack || '');
        }
        fs.closeSync(fd);
      }
    }
  }

  test('HTML Emitter', async () => {
    console.log(process.argv);

    const argv = require('yargs/yargs')(process.argv.slice(2)).strict(false).
      options({
      list: {
        alias: 'l',
        description: 'list of rdj/pdj/output file triples, separated by :',
        demandOption: true,
        type: 'string'
      }
    }).parseSync();

    await processLineByLine(argv.list);

  }, 600000);
});
