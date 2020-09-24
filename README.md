# fdc3-demos

A collection of simple, open source demos of FDC3 functionality.

## Configuration

Follow the `TODOs` inside of the tradingview-chart.html and tradingview-blotter.html files:

If you want to use the demo as a PWA:
- TODO (optional): Reference the manifest you want to use
- TODO (optional): Register the service worker you want to use

If the FDC3 implementation you want to use is *not* injected by the container or by a browser extension:
- TODO (optional): Reference your FDC3 implementation

If you do not run the demo inside of a container that has a channel selector widget built in or if you are not using an extension that provides a channel selector widget:
- TODO (optional): Reference any other scripts/styles you might need here (e.g. for a channel selector widget). -->
- TODO (optional): Add a HTML element that would hold the channel selector widget

## Steps to run

1. `npm i`
2. Inside of index.js comment out the manifests that reference the deployed versions of the applications and use the localhost ones instead
3. `node index.js`
4. Navigate to `http://localhost:3001/`. You should see the blotter and chart applications side by side
5. Navigate to `http://localhost:3001/fdc3_explained.html` and `http://localhost:3001/fdc3_receive.html`
