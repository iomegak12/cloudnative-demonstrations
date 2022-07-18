const express = require('express');
const bodyParser = require('body-parser');

require('isomorphic-fetch');
require('base-64');


const app = express();

app.use(bodyParser.json());

const daprPort = process.env.DAPR_HTTP_PORT || 3500;
const secretStoreName = process.env.SECRET_STORE;
const secretName = "mysecret";

const secretsUrl = `http://localhost:${daprPort}/v1.0/secrets`;
const port = 3000;

app.get("/getsecret", (request, response) => {
    const url = `${secretsUrl}/${secretStoreName}/${secretName}`;

    console.log("Fetching URL " + url);

    fetch(url)
        .then(result => result.json())
        .then(json => {
            let secretBuffer = Buffer.from(json["mysecret"]);
            let encodedSecret = secretBuffer.toString("base64");

            console.log("Base 64 Encoded Secret : " + encodedSecret);

            return response.send(encodedSecret);
        });
});

app.listen(port, () => console.log("Node Application for Secrets Started ..."));