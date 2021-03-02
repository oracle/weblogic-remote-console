/**
 * @license
 * Copyright (c) 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['js-yaml'],
  function(parser){
    function encode(s) {
      var out = [];
      for ( var i = 0; i < s.length; i++ ) {
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
        var str = JSON.stringify(obj);
        var data = encode( str );
      
        var blob = new Blob( [ data ], {
          type: 'application/octet-stream'
        });
        
        var url = URL.createObjectURL( blob );
        var link = document.createElement( 'a' );
        link.setAttribute( 'href', url );
        link.setAttribute( 'download', filepath );
        var event = document.createEvent( 'MouseEvents' );
        event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent( event );
      },
      readJson: function(filepath) {
        return new Promise((resolve, reject) => {
          fetchFile(filepath)
          .then((data) => {
            resolve(JSON.parse(data));
          })
          .catch((err) => {
            reject(err);
          });
        });
      },
      readYaml: function(filepath) {
        return new Promise((resolve, reject) => {
          fetchFile(filepath)
          .then((data) => {
            resolve(parser.safeLoad(data));
          })
          .catch((err) => {
            reject(err);
          });
        });
      }

    }

  }
);