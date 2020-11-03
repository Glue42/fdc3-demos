const express = require('express');
const path = require('path');
const generators = require('./generators');
const config = require('./config');
const demos = require("./demos.json");

const tradingViewBlotter = {
  name: "TradingView Blotter",
  appId: "tradingview-blotter",
  manifestType: "Glue42",
  manifest: "{\"details\":{\"url\":\"https://fdc3-demo.glue42.com/tradingview-blotter.html\"}}",
  // manifest: "{\"details\":{\"url\":\"http://localhost:3001/tradingview-blotter.html\"}}",
};
const tradingViewChart = {
  name: "TradingView Chart",
  appId: "tradingview-chart",
  manifestType: "fdc3.glue42-core.demo",
  manifest: "{\"url\":\"https://fdc3-demo.glue42.com/tradingview-chart.html\"}",
  // manifest: "{\"url\":\"http://localhost:3001/tradingview-chart.html\"}",
  intents: [
    {
      name: "fdc3.ViewChart",
      contexts: [
        "fdc3.instrument"
      ]
    }
  ]
};
const fdc3Explained = {
  name: "FDC3 Explained",
  appId: "fdc3-explained",
  manifestType: "fdc3.glue42-core.demo",
  manifest: "{\"url\":\"https://fdc3-demo.glue42.com/fdc3_explained\"}",
  // manifest: "{\"url\":\"http://localhost:3001/fdc3_explained\"}"
};
const fdc3Receive = {
  name: "FDC3 Receive",
  appId: "fdc3-receive",
  manifestType: "fdc3.glue42-core.demo",
  manifest: "{\"url\":\"https://fdc3-demo.glue42.com/fdc3_receive.html\"}",
  // manifest: "{\"url\":\"http://localhost:3001/fdc3_receive.html\"}"
};
const glue42CoreDemo = {
  name: "Glue42 Core Demo",
  details: {
    url: "https://fdc3-demo.glue42.com/glue42-core-demo.html",
    // url: "http://localhost:3001/glue42-core-demo.html",
  }
};
const applications = [
  tradingViewBlotter,
  tradingViewChart,
  fdc3Explained,
  fdc3Receive,
  glue42CoreDemo
];

const app = express();

//public route
app.use(express.static('public'));

//create demo routes
demos.forEach(demo => {
  app.get(`/${demo.name}`, function (req, res) {
    res.sendFile(path.resolve(`public/${demo.name}.html`));
  });
});

//service worker generator
app.get('/:demo/sw.js', function (req, res) {
  const demo = req.params.demo;
  const data = demos.find(d => {
    return d.name === demo;
  });
  const template = `
    self.addEventListener('install', (event) => {
        event.waitUntil(
          caches.open('v1').then((cache) => {
            return cache.addAll([
              ${data.cacheList}
            ]);
          })
        );
      });

      self.addEventListener('fetch', function(event) {
        // Calling event.respondWith means we're in charge
        // of providing the response. We pass in a promise
        // that resolves with a response object
        event.respondWith(
          // First we look for something in the caches that
          // matches the request
          caches.match(event.request).then(function(response) {
            // If we get something, we return it, otherwise
            // it's null, and we'll pass the request to
            // fetch, which will use the network.
            return response || fetch(event.request);
          })
        );
      });
    `;

  res.status(200).type("text/javascript").send(template);
});

//create routes for manifests

//OpenFin manifest
app.get('/manifests/of/:demo', function (req, res) {
  const demo = req.params.demo;
  const data = demos.find(d => {
    return d.name === demo;
  });

  res.status(200).json(generators.openfin.generate(data, req));
});

//web app manifest
app.get('/manifests/web/:demo', function (req, res) {
  const demo = req.params.demo;
  const data = demos.find(d => {
    return d.name === demo;
  });

  res.status(200).json(generators.web.generate(data, req));
});

app.get("/v1/apps/search", (_, res) => {
  res.json({
    applications,
    message: 'OK'
  });
});

app.listen(config.port, () => {
  console.log(`App running on port ${config.port}.`);
});
