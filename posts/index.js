const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const axios = require('axios');


app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res)=>{
    res.status(200).send(posts);
});


app.post("/posts/create", async (req, res)=> {
    const id = randomBytes(4).toString('hex');
    const {title} = req.body;

    posts[id] = {
        id, title
    }

    await axios.post('http://event-bus-serv:4005/events', {
        type: "PostCreated",
        data:{
            id,
            title
        }
    })
    return res.status(201).send(posts[id]);

});

app.post("/events",(req, res)=>{
    console.log("Received event!!", req.body.type)

    res.send({});
})
app.listen(4000, () =>{
    console.log("v55")
    console.log("Server is running on port 4000!!");
})


 