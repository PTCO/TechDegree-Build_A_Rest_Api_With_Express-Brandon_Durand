const express = require('express');
const User = require('../models').Users
const authenticate = require('../middleware/authenticate');


const Router = express.Router();

Router.get('/users', authenticate, async (req, res, next)=>{
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password', 'createdAt', 'updatedAt']}
        });
        res.status(200).send(users);
    } catch (error) {
        next(error)
    }
})

Router.post('/users', async (req, res, next)=>{
    try {

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