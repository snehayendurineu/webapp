require('dotenv').config();
const db =  require('../models/dbConnection')
const bcrypt = require('bcrypt');
const User = db.users
const logger = require('../loggerModel.js');
const { PubSub } = require('@google-cloud/pubsub');
const projectId = 'cloud6225-dev';
const pubSubClient = new PubSub({ projectId });

const addUser = async (request, res) => {
    try{
        logger.debug('AddUser api started');    
        const { username, first_name, last_name, password,...extraFields} = request.body;

        if (Object.keys(extraFields).length > 0) {
            logger.warn('Only Username, First Name, Last Name, and Password can be given');
            return res.status(400).json({ error: 'Only Username, First Name, Last Name, and Password can be given' });
        }


        if(!username || !password || !first_name || !last_name){
            logger.warn("Bad request, need username, password, first_name, last_name");
            return res.status(400).end();
        }

        res.set('Cache-Control', 'no-cache');
        const existingUser = await User.findOne({ where: { username:username} });
        if (existingUser) {
            logger.warn("User with this username already exists");
            return res.status(400).json({ error: 'User with this username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            password: hashedPassword,
            first_name,
            last_name
        });

        if(process.env.ISTEST !== undefined && process.env.ISTEST){
            logger.info("skipped pub/sub for integration testing");
            console.log("skipped pub/sub for integration testing");
        }else{
            logger.info("calling pub/sub");
            console.log("calling pub/sub");
            const topicName = 'verify_email';
            const data = {
                id: user.id,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name
            };
            const dataBuffer = Buffer.from(JSON.stringify(data));

            await pubSubClient.topic(topicName).publish(dataBuffer);
        }

        const userResponse = {
            id:user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            account_created: user.account_created,
            account_updated: user.account_updated
        };
       logger.info('Added user successfully')
       res.status(201).send(userResponse)
       logger.debug('AddUser api completed');   
    }catch(error){
        console.log(error)
        logger.error('addUser api error');   
        logger.error(error);
        res.status(500).json({ error: 'Server Error' });
        logger.debug('AddUser api completed with error');
    }
}

const getUser = async(request, res) => {
    logger.debug('GetUser api started');    
    res.set('Cache-Control', 'no-cache');

    const auth = request.headers.authorization;

    if(!auth){
        logger.warn('You are not authorized');
        return res.status(403).json({ error: 'You are not authorized' });
    }

    const encoded = auth.substring(6);
    const decoded = Buffer.from(encoded, 'base64').toString('ascii')
    const [username, password] = decoded.split(':')

    if((!username || username =="") &&  (!password || password=="")){
        logger.warn('You are not authorized');
        return res.status(403).json({ error: 'You are not authorized' });
    }
    if (request.headers['content-length'] !== undefined && request.headers['content-length'] !== '0') {
        logger.warn('Invalid request header');
        res.set('Cache-Control', 'no-cache');
        return res.status(400).end();
    }
    let user = await User.findOne({where:{username:username}})

    if(!user){
        logger.warn('User with the username does not exists');
        return res.status(404).json({ error: 'User with this username does not exists' });
    }

    const pwdCheck =  await bcrypt.compare(password, user.password)
    if(!pwdCheck){
        logger.warn('Invalid credentials');
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    if(!user.is_verified){
        return res.status(403).json({ error: 'User is not verified.' });
    }

    const userResponse = {
        id:user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        account_created: user.account_created,
        account_updated: user.account_updated
    };
    logger.info('User fetched successfully')
    res.status(200).send(userResponse)
    logger.debug('GetUser api completed');
}


const updateUser = async(request, res) => {
    logger.debug('UpdateUser api started');
    res.set('Cache-Control', 'no-cache');

    const auth = request.headers.authorization;

    if(!auth){
        logger.warn('You are not authorized');
        return res.status(403).json({ error: 'You are not authorized' });
    }
    
    const encoded = auth.substring(6);
    const decoded = Buffer.from(encoded, 'base64').toString('ascii')
    const [ausername, apassword] = decoded.split(':')
    
    if((!ausername || ausername =="") &&  (!password || password=="")){
        logger.warn('You are not authorized');
        return res.status(403).json({ error: 'You are not authorized' });
    }

    let auser = await User.findOne({where:{username:ausername}})

    if(!auser){
        logger.warn('User with this username does not exists');
        return res.status(404).json({ error: 'User with this username does not exists' });
    }

    const pwdCheck =  await bcrypt.compare(apassword, auser.password)
    if(!pwdCheck){
        logger.warn('Invalid credentials');
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    if(!auser.is_verified){
        return res.status(403).json({ error: 'User is not verified.' });
    }

    const { first_name, last_name, password,...extraFields} = request.body;

    if (Object.keys(extraFields).length > 0) {
        logger.warn('Only First Name, Last Name, and Password can be updated')
        return res.status(400).json({ error: 'Only First Name, Last Name, and Password can be updated' });
    }

    const allowedFields = {};
    if (first_name) allowedFields.first_name = first_name;
    if (last_name) allowedFields.last_name = last_name;
    if (password) allowedFields.password = await bcrypt.hash(password, 10);

    allowedFields.account_updated = new Date();

    let user = await User.update(allowedFields, {where:{username:ausername}})
    logger.info('User updated successfully');
    res.status(204).json({ message: 'User information updated successfully' });
    logger.debug('UpdateUser api completed');
}

const deleteUser = async(request, res) => {
    res.set('Cache-Control', 'no-cache');
    const auth = request.headers.authorization;

    if (!auth) {
        return res.status(403).json({ error: 'You are not authorized' });
    }

    const encoded = auth.substring(6);
    const decoded = Buffer.from(encoded, 'base64').toString('ascii');
    const [username, password] = decoded.split(':');

    if ((!username || username == "") && (!password || password == "")) {
        return res.status(403).json({ error: 'You are not authorized' });
    }

    const user = await User.findOne({ where: { username: username } });

    if (!user) {
        return res.status(404).json({ error: 'User with this username does not exist' });
    }

    const pwdCheck = await bcrypt.compare(password, user.password);
    if (!pwdCheck) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    await User.destroy({ where: { id: user.id } });

    res.status(200).json({ message: 'User deleted successfully' });
}

const verifyUser = async(request, res) => {
    verificationTokenParam = request.params.id;
    let user = await User.findOne({where:{verificationToken:verificationTokenParam}})

    if(!user){
        return res.status(404).json({ message : 'User verification failed.'});
    }
    
    if(user.is_verified==true){
        return res.status(409).json({ message: 'User is already verified.' });
    }

    const expiration_time = user.expiration_time;
    const current_time = new Date();

    if(current_time>expiration_time){
        await User.destroy({ where: { id: user.id } });
        return res.status(410).json({ message : 'Verification link expired.'})
    }

    await User.update({ is_verified: true }, { where: { id: user.id } });

    return res.status(200).json({ message : 'You are verified successfully'});
}

module.exports = {
    addUser,
    getUser,
    updateUser,
    deleteUser,
    verifyUser
}

