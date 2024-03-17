const { error } = require('console');
const dbConnection = require('../models/dbConnection');
const logger = require('../loggerModel.js');

async function checkHealth(request, response){
    logger.info('healtcheck Info');
    logger.warn('healtcheck Warn');
    logger.debug('healtcheck Debug');
    if (request.headers['content-length'] !== undefined && request.headers['content-length'] !== '0') {
        response.set('Cache-Control', 'no-cache');
        return response.status(400).end();
    }
    
    try {
        await dbConnection.sequelize.authenticate();
        console.log('Connected successfully.');
        response.set('Cache-Control', 'no-cache');
        logger.info('Connected successfully to DB');
        return response.status(200).end();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        response.set('Cache-Control', 'no-cache');
        return response.status(503).end();
    }
        
}

module.exports.checkHealth = checkHealth;
