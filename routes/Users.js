const express = require('express');
const User = require('../models').Users
const authenticate = require('../middleware/authenticate');


const Router = express.Router();

Router.get('/users', authenticate, async (req, res, next)=>{
    try {
        const users = await User.findOne({
            attributes: { exclude: ['password', 'createdAt', 'updatedAt']},
            where: {
                id: req.currentUser.id
            }
        });
        res.status(200).send(users);
    } catch (error) {
        next(error)
    }
})

Router.post('/users', async (req, res, next)=>{
    try {
        
        if(JSON.stringify(req.body) === '{}') throw Error('Please provide: first and last name, an valid email and password')

        await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailAddress: req.body.emailAddress,
            password: req.body.password
        });

        res.location('/').status(201).send('');
    } catch (error) {
        next(error)
    }
})

module.exports = Router;