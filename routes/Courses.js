const express = require('express');
const { Model, where } = require('sequelize');
const User = require('../models').Users;
const Course = require('../models').Course
const authenticate = require('../middleware/authenticate');

const Router = express.Router();

Router.get('/courses', async (req, res, next)=>{
    try {
        const courses = await Course.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt']},
            include: [
                {
                    model: User,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'password']},
                }
            ]
        });
        res.status(200).send(courses);
    } catch (error) {
        next(error)
    }
})

Router.get('/courses/:id', async (req, res, next)=>{
    try {
        const courses = await Course.findOne({
            where: {
                id: req.params.id
            },
            attributes: { exclude: ['createdAt', 'updatedAt']},
            include: [
                {
                    model: User,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'password']},
                }
            ]
        });
        res.status(200).send(courses);
    } catch (error) {
        next(error)
    }
})

Router.put('/courses/:id', authenticate, async (req, res, next)=>{
    try {
        const course = await Course.findOne({ where: {id: req.params.id } });

        let ownerCheckError = new Error('You do not own this course');
        ownerCheckError.status = 403;
        if(course.id !== req.currentUser.id) return next(ownerCheckError);

        await Course.update(
            {
                title: req.body.title,
                description: req.body.description,
                UserId: req.body.userId
            },
            {
                where: {
                    id: req.params.id
                },
            }
        );
        res.status(204).send('')
    } catch (error) {
        next(error)
    }
})

Router.delete('/courses/:id', authenticate, async (req, res, next)=>{
    try {
        const course = await Course.findOne({ where: {id: req.params.id } });

        let ownerCheckError = new Error('You do not own this course');
        ownerCheckError.status = 403;
        if(course.id !== req.currentUser.id) return next(ownerCheckError);

        const deleteCourse = await Course.findByPk(req.params.id)
        await deleteCourse.destroy();
        res.status(204).send('')
    } catch (error) {
        next(error)
    }
})

Router.post('/courses', authenticate, async (req, res, next)=>{
    try {
        const course = await Course.create({
            UserId: req.body.userId,
            title: req.body.title,
            description: req.body.description,
            estimatedTime: req.body.estimatedTime,
            materialsNeeded: req.body.materialsNeeded,
        })
        res.location('/api/courses/' + course.id).status(201).send();
    } catch (error) {
        next(error)
    }
})

module.exports = Router;