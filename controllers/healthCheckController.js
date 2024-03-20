const { error } = require('console');
const dbConnection = require('../models/dbConnection');
const logger = require('../loggerModel.js');

async function checkHealth(request, response){
    logger.debug('Healthcheck api started');
 
    if (request.headers['content-length'] !== undefined && request.headers['content-length'] !== '0') {
        logger.warn('Invalid request header');
        response.set('Cache-Control', 'no-cache');
        return response.status(400).end();
    }
    
    try {
        await dbConnection.sequelize.authenticate();
        console.log('Connected successfully.');
        response.set('Cache-Control', 'no-cache');
        logger.info('Connected successfully to DB');
        logger.debug('Healthcheck api completed');    
        return response.status(200).end();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        logger.error('Unable to connect to the database');
        logger.error(error)
        response.set('Cache-Control', 'no-cache');
        logger.debug('Healthcheck api completed with error');    
        return response.status(503).end();
    }
    
}

module.exports.checkHealth = checkHealth;
