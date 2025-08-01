const express = require('express');
const bodyParser = require('body-parser');
const randomBytes = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();


app.use(cors());
app.use(bodyParser.json());

const commentsByPostId = {};
app.get("/posts/:id/comments", (req, res)=>{
    res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
    const commentId = randomBytes.randomBytes(4).toString('hex');
    const {content} = req.body;


    const comments = commentsByPostId[req.params.id]|| [];
    comments.push({id: commentId, content, status: "pending"})

    axios.post("http://event-bus-serv:4005/events", {
        type: "CommentCreated",
        data:{
            id: commentId,
            content,
            postId: req.params.id,
            status: "pending"
        }
    })
    commentsByPostId[req.params.id] = comments;
    res.status(201).send(comments);

});

app.post("/events", async(req, res)=>{
    console.log("Event Received :,", req.body.type)
    const {type, data} = req.body;

    if(type == "CommentModerated"){
        const {status, id, postId, content} = data;
        
        const comment = commentsByPostId[postId].map(c => c.commentId == id)
        comment.status = status
        await axios.post("http://event-bus-serv:4005/events", {
            type: "CommentUpdated",
            data: {
                id,
                content,
                status,
                postId
            }
        }).catch(err=> console.log(err.message))
    }
    res.send({})
})

app.listen(4001, () =>{
    console.log("Listening on port 4001");
})