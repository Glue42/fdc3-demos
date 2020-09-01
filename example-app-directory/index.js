const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');

const PORT = 3002;

const tradingViewBlotter = {
    name: "TradingView Blotter",
    appId: "tradingview-blotter",
    manifestType: "Glue42",
    manifest: "{\"details\":{\"url\":\"http://localhost:3001/tradingview-blotter.html\"}}"
};

const tradingViewChart = {
    name: "TradingView Chart",
    appId: "tradingview-chart",
    manifestType: "fdc3.glue42-core.demo",
    manifest: "{\"url\":\"http://localhost:3001/tradingview-chart.html\"}",
    intents: [
        {
            name: "fdc3.ViewChart",
            contexts: [
                "fdc3.instrument"
            ]
        }
    ]
};

const applications = [
    tradingViewBlotter,
    tradingViewChart
];

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.listen(PORT, () => console.log(`Example app directory running on port ${PORT}.`));

app.get("/v1/apps/search", (_, res) => {
    res.json({
        applications,
        message: 'OK'
    });
});
