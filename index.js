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


//create routes for manifests

//OpenFin manifest
app.get('/manifests/of/:demo', function(req, res){
    const demo = req.params.demo;
    const data = demos.find(d => {
        return d.name === demo;
    });

    res.status(200).json(generators.openfin.generate(data,req));
});


app.listen(config.port, () => {
    console.log(`App running on port ${config.port}.`);
  });