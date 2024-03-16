const express = require('express')
const routes = require('./routes/userRouter');
const logger = require('./loggerModel.js');
const app = express()

logger.info("Executing app.js")
if (require.main === module) {
    const port = 8080;

    app.listen(port, function(){
        console.log(`Server is running on port ${port}`);
        logger.warn('Server is running on port 8080');
    });
}

app.use(express.json())

app.use(express.urlencoded({extended:true}))

app.use('/', routes);


module.exports = app;
