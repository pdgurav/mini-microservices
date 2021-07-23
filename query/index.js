const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === 'CommentCreated') {
    const { id: commentId, postId, content, status } = data;
    posts[postId].comments.push({ id: commentId, content, status });
  }
  if (type === 'CommentUpdated') {
    const { id, postId, status, content } = data;
    const comment = posts[postId].comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
}
app.post('/events', (req, res) => {
    const { type, data} = req.body;
    handleEvent(type, data);
    res.send({});
});

app.listen(4002, async () => {
    console.log(4002);
    
    try {
      const res = await axios.get("http://localhost:4005/events");
 
      for (let event of res.data) {
      console.log("Processing event:", event.type);
 
      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
  
})