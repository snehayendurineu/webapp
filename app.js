const express = require('express')
const routes = require('./routes/userRouter');

const app = express()


const port = 8080;

app.listen(port, function(){
    console.log(`Server is running on port ${port}`);
});

app.use(express.json())

app.use(express.urlencoded({extended:true}))

app.use('/', routes);


module.exports = app;