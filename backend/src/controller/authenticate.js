const crypto = require('crypto');
const connection = require('../database/connections');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const auth = require('../config/auth.json');
const mailer = require('../util/mail');

const generateToken = (params ={}) =>{
    return JWT.sign(
        params,
        auth.secret,
        {
            expiresIn:86400
        }
       );
}

module.exports = {
    register: async (req,res)=>{
        try {
            let user = req.body;
            user.password = await bcrypt.hash(user.password,10);
            const [id] = await connection('users').insert(user);
            res.header("X-TOKEN",generateToken({id}));
            return res.json({id});
        } catch (err) {
            res.status(401).send(err)
        }
        
    },
    login: async (req,res)=>{
        try {
            const {email,password} = req.body;
            let data = await connection('users')
            .where('email',email)
            .first();

            if(!data)
                return res.status(400).send({error:"User not found"});

            if(!await bcrypt.compare(password,data.password))
                return res.status(401).send({error:"incorrect passoword!"});

            data.password = undefined;
            data.password_reset_token = undefined;
            data.password_reset_expiries = undefined;
            
            res.header("X-TOKEN",generateToken({id:data.id}));
            return res.json(data)
        } catch (error) {
            return res.json(error);
        }
        

    },
    forgotPassword: async (req,res)=>{
        try {
            const {email} = req.body;
            const user = await connection('users')
            .where('email',email)
            .first();
           
            if(!user)
                return res.status(401).send({error:'Not exists user whit this email'});
            
            const token = crypto.randomBytes(20).toString('hex');
            const now = new Date();
            now.setHours(now.getHours() +1);

            await connection('users')
            .where('email',email)
            .update({
                'password_reset_token':token,
                'password_reset_expiries':now
            });
            
            const resEmail =  await mailer.sendMail({
                from: 'oicramkroll@gmail.com',
                to: email,
                subject: 'Recuperação de senha',
                template:'auth/forgotPassword',
                context:{token}
            }); 
            
            return res.json({resEmail});
            
        } catch (error) {
            return res.status(401).send({error});
        }

        
    },
    resetPassword:async(req,res)=>{
        const {email,token,password} = req.body;
        const user = await connection('users')
            .where('email',email)
            .first();
            
        if(!user)
            return res.status(401).send({error:'Not exists user whit this email'});
        if(token!== user.password_reset_token)
            return res.status(401).send({error:'Token is not valid.'});
        if(new Date() > user.password_reset_expiries)
            return res.status(401).send({error:'Token expiries'});

        const passwordCrypted = await bcrypt.hash(password,10);
        await connection('users')
            .where('email',email)
            .update({
                password : passwordCrypted
            });
        return res.send();
        
    }
}
