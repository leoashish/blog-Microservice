const express = require("express");
const bodyParser = require("body-parser")
const axios = require("axios")

const app = express();
app.use(bodyParser.json())

app.post("/events", async(req, res)=>{
    const { type, data } = req.body;

    if(type == "CommentCreated"){
        const status = data.content.includes("orange") ? 'rejected': 'approved'
        await axios.post("http://event-bus-serv:4005/events",{
            type: "CommentModerated",
            data:{
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }
        }).catch((error) =>{
            console.log("Failed with erorr: ", error.message);
        })
    }
})

app.listen(4003, () =>{
    console.log("listening on port 4003!!")
})