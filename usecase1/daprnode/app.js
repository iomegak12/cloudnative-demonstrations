const { response } = require('express');
const express = require('express');

require('isomorphic-fetch');

const app = express();

app.use(express.json());

const daprPort = process.env.DAPR_HTTP_PORT || 3500;
const stateStoreName = "statestore";
const stateUrl = `http://localhost:${daprPort}/v1.0/state/${stateStoreName}`;
const port = process.env.APP_PORT ?? '3000';

app.get("/order", async(request, response) => {
    try {
        const result = await fetch(`${stateUrl}/order`);

        if(!result.ok) {
            throw "Could not be able to get the state!";
        }

        const orders = await result.text();

        response.send(orders);
    } catch(error) {
        console.log(error);

        response.status(500).send({
            message: error
        });
    }
});

app.post("/neworder", async(request, response) => {
    const data = request.body.data;
    const orderId = data.orderId;
    
    console.log("Got a New Order ... Order Id : " + orderId);

    const state = [
        {
            key: "order",
            value: data
        }
    ];

    try {
        const result = await fetch(stateUrl, {
            method: 'POST',
            body: JSON.stringify(state),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(!result.ok) {
            throw "Failed to Persist State!";
        }

        console.log("Sucessfully Persisted the State!");

        response.status(200).send();
    } catch (error){
        console.log(error);

        response.status(500).send({
            message: error
        });
    }
});

app.listen(port, () => {
    console.log(`Node Application Listening on Port ${port}`);
});