/**
 * @license
 * Copyright (c) 2021, 2023, 2025 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld(
  'electron_api',
  {
    ipc: {
      receive: (channel, func) => {
        const validChannels = [
        ];
        if (validChannels.includes(channel)) {
          // Strip off the event since it includes the sender
          ipcRenderer.on(channel, (event, arg) => event.returnValue = func(arg));
        } 
        else {
          throw new Error(`Renderer attempted to listen on an invalid channel: ${channel}`);
        }
      },
      cancelReceive: (channel) => {
        const validChannels = [
        ];
        if (validChannels.includes(channel)) {
          ipcRenderer.removeAllListeners(channel);
        }
        else {
          throw new Error(`Renderer attempted to cancel listen on an invalid channel: ${channel}`);
        }
      },
      invoke: async (channel, arg) => {
        const validChannels = [
          'external-url-opening',
          'file-creating',
          'file-choosing',
          'unsaved-changes',
          'preference-reading',
          'get-file-path',
          'get-property',
          'set-property',
        ];
        return new Promise((resolve, reject) => {
          if (validChannels.includes(channel)) {
            ipcRenderer.invoke(channel, arg)
              .then(results => {
                resolve(results);
              })
              .catch(err => {
                reject(err);
              });
          } 
          else {
            reject({
              transport: {statusText: channel},
              failureType: 'INVALID_CHANNEL',
              failureReason: new Error(`Renderer attempted to send to an invalid channel: ${channel}`)
            });
          }
        });
      }
    },
    getFilePath: (file) => webUtils.getPathForFile(file),
    getSaveAs: (file) => ipcRenderer.invoke('file-creating', file),
  }
);
