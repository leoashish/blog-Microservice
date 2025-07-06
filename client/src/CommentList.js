import React from "react";
const CommentList = ({comments}) =>{
    console.log(comments)
    const renderedComments = comments.map(comment =>{
        var content = comment.content;
        if(comment.status === "pending"){
            content = "Comment is waiting moderation!!"
        } else if(comment.status === "approved"){
            content = comment.content
        } else{
            content = "This comment has been rejected."
        }
        return (
            <li key={comment.id}>
                {content}
            </li>
        )
    });
    return (
        <ul>
            {renderedComments}
        </ul>
    )
}

export default CommentList;