/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['js-yaml'],
  function(parser){
    function encode(s) {
      const out = [];
      for ( let i = 0; i < s.length; i++ ) {
        out[i] = s.charCodeAt(i);
      }
      return new Uint8Array(out);
    }

    function fetchFile(filepath){
      return fetch(filepath, {mode: 'no-cors'})
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw Error(response.statusText);
      })
      .catch(console.error);
    }

    return {
      writeJson: function(obj, filepath){
        const data = encode( JSON.stringify(obj) );
      
        const blob = new Blob( [ data ], {
          type: 'application/octet-stream'
        });
        
        const url = URL.createObjectURL( blob );
        const link = document.createElement( 'a' );
        link.setAttribute( 'href', url );
        link.setAttribute( 'download', filepath );
        const event = document.createEvent( 'MouseEvents' );
        event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent( event );
      },
      readJson: function(filepath) {
        return new Promise((resolve, reject) => {
          fetchFile(filepath)
          .then(data => {
            resolve(JSON.parse(data));
          })
          .catch(err => {
            reject(err);
          });
        });
      },
      readYaml: function(filepath) {
        return new Promise((resolve, reject) => {
          fetchFile(filepath)
          .then(data => {
            resolve(parser.load(data));
          })
          .catch(err => {
            reject(err);
          });
        });
      }

    }

  }
);
