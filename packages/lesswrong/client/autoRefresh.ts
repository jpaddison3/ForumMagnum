import { onStartup, getWebsocketPort } from '../lib/executionEnvironment';
import type { MessageEvent, OpenEvent, CloseEvent } from 'ws';

// In development, make a websocket connection (on a different port) to get
// notified when the server has restarted with a new version.

const websocketPort = getWebsocketPort();
let connectedWebsocket: any = null;
let buildTimestamp: string|null = null;

function connectWebsocket() {
  if (connectedWebsocket) return;
  connectedWebsocket = new WebSocket(`ws://localhost:${websocketPort}`);

  connectedWebsocket.addEventListener("message", (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data+"");
      if (data.latestBuildTimestamp) {
        if (!buildTimestamp) {
          buildTimestamp = data.latestBuildTimestamp;
        } else if (data.latestBuildTimestamp !== buildTimestamp) {
          // eslint-disable-next-line no-console
          console.log(`There is a newer build (my build: ${buildTimestamp}; new build: ${data.latestBuildTimestamp}. Refreshing.`);
          window.location.reload();
        }
      } else {
        // eslint-disable-next-line no-console
        console.error("Websocket message is unrecognized");
      }
    } catch(e) {
      // eslint-disable-next-line no-console
      console.error("Got invalid message on websocket", e);
      // eslint-disable-next-line no-console
      console.log(e);
    }
  });
  connectedWebsocket.addEventListener("open", (event: OpenEvent) => {
  });
  connectedWebsocket.addEventListener("error", (event: CloseEvent) => {
  });
}

function disconnectWebsocket() {
  if (connectedWebsocket) {
    connectedWebsocket.close();
    connectedWebsocket = null;
  }
}

if (!bundleIsProduction) {
  onStartup(() => {
    setTimeout(() => {
      connectWebsocket();
    }, 3000);
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        disconnectWebsocket();
      } else {
        connectWebsocket();
      }
    });
  });
}
