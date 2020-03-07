const express = require('express');
const path = require('path');
const generators = require('./generators');
const config = require('./config');
const demos = require("./demos.json");

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
app.get('/:demo/sw.js', function(req, res){
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
app.get('/manifests/of/:demo', function(req, res){
    const demo = req.params.demo;
    const data = demos.find(d => {
        return d.name === demo;
    });

    res.status(200).json(generators.openfin.generate(data,req));
});

//web app manifest
app.get('/manifests/web/:demo', function(req, res){
    const demo = req.params.demo;
    const data = demos.find(d => {
        return d.name === demo;
    });

    res.status(200).json(generators.web.generate(data,req));
});

app.listen(config.port, () => {
    console.log(`App running on port ${config.port}.`);
  });