require('dotenv').config();
const db =  require('../models/dbConnection')
const bcrypt = require('bcrypt');
const User = db.users

const addUser = async (request, res) => {
    try{

        const { username, first_name, last_name, password,...extraFields} = request.body;

        if (Object.keys(extraFields).length > 0) {
            return res.status(400).json({ error: 'Only Username, First Name, Last Name, and Password can be given' });
        }


        if(!username || !password || !first_name || !last_name){
            return res.status(400).end();
        }

        res.set('Cache-Control', 'no-cache');
        const existingUser = await User.findOne({ where: { username:username} });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            password: hashedPassword,
            first_name,
            last_name
        });

        const userResponse = {
            id:user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            account_created: user.account_created,
            account_updated: user.account_updated
        };

    
       res.status(201).send(userResponse)
    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Server Error' });
    }
}

const getUser = async(request, res) => {

    res.set('Cache-Control', 'no-cache');

    const auth = request.headers.authorization;

    if(!auth){
        return res.status(403).json({ error: 'You are not authorized' });
    }

    const encoded = auth.substring(6);
    const decoded = Buffer.from(encoded, 'base64').toString('ascii')
    const [username, password] = decoded.split(':')

    if((!username || username =="") &&  (!password || password=="")){
        return res.status(403).json({ error: 'You are not authorized' });
    }
    
    const {...extraFields} = request.body;

    if (Object.keys(extraFields).length > 0) {
        return res.status(400).json({ error: 'No values should be given' });
    }


    let user = await User.findOne({where:{username:username}})

    if(!user){
        return res.status(404).json({ error: 'User with this username does not exists' });
    }

    const pwdCheck =  await bcrypt.compare(password, user.password)
    if(!pwdCheck){
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const userResponse = {
        id:user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        account_created: user.account_created,
        account_updated: user.account_updated
    };

    res.status(200).send(userResponse)
}


const updateUser = async(request, res) => {

    res.set('Cache-Control', 'no-cache');

    const auth = request.headers.authorization;

    if(!auth){
        return res.status(403).json({ error: 'You are not authorized' });
    }
    
    const encoded = auth.substring(6);
    const decoded = Buffer.from(encoded, 'base64').toString('ascii')
    const [ausername, apassword] = decoded.split(':')
    
    if((!ausername || ausername =="") &&  (!password || password=="")){
        return res.status(403).json({ error: 'You are not authorized' });
    }

    let auser = await User.findOne({where:{username:ausername}})

    if(!auser){
        return res.status(404).json({ error: 'User with this username does not exists' });
    }

    const pwdCheck =  await bcrypt.compare(apassword, auser.password)
    if(!pwdCheck){
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { first_name, last_name, password,...extraFields} = request.body;

    if (Object.keys(extraFields).length > 0) {
        return res.status(400).json({ error: 'Only First Name, Last Name, and Password can be updated' });
    }

    if(!first_name && !last_name && !password){
        return res.status(204).end();
    }


    const allowedFields = {};
    if (first_name) allowedFields.first_name = first_name;
    if (last_name) allowedFields.last_name = last_name;
    if (password) allowedFields.password = await bcrypt.hash(password, 10);

    allowedFields.account_updated = new Date();

    let user = await User.update(allowedFields, {where:{username:ausername}})
    res.status(200).json({ message: 'User information updated successfully' });
}


module.exports = {
    addUser,
    getUser,
    updateUser
}