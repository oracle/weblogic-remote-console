/**
 * @license
 * Copyright (c) 2021, 2022 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */
const { contextBridge, ipcRenderer } = require('electron');

/* global process */
contextBridge.exposeInMainWorld(
  'electron_api',
  {
    ipc: {
      receive: (channel, func) => {
        const validChannels = [
          'on-project-switched',
          'start-app-quit'
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
          'on-project-switched'
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
          'translated-strings-sending',
          'current-login',
          'project-changing',
          'current-project-requesting',
          'credentials-requesting',
          'file-creating',
          'file-choosing',
          'file-reading',
          'file-writing',
          'submenu-state-setting',
          'preference-reading',
          'window-app-quiting'
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
              failureType: "INVALID_CHANNEL",
              failureReason: new Error(`Renderer attempted to send to an invalid channel: ${channel}`)
            });
          }
        });
      }
    }
  }
);
