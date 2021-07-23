const express = require('express');
const { randomBytes } = require('crypto');
const axios  = require('axios');
const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.post('/events', async(req, res) => {
    const { type, data} = req.body;

    if (type == 'CommentCreated') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved' ;
        
        await axios.post('http://localhost:4005/events', {
            type: 'CommentModerated',
            data: { 
                ...data,
                status,
            },
        })
    }

    res.status(201).send({});
})

app.listen(4003, () => {
    console.log('4003');
})