const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Sequelize.Model{}
    Course.init({
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A title is required'
                },
                notEmpty: {
                    msg: 'Please provide a title'
                }
            }            
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A description is required'
                },
                notEmpty: {
                    msg: 'Please provide a description'
                }
            }            
        },
        estimatedTime: {
            type: Sequelize.STRING,
            allowNull: false,       
        },
        materialsNeeded : {
            type: Sequelize.STRING,
            allowNull: false,
        },
    }, {sequelize});
    
    Course.associate = (models) => {
        Course.belongsTo(models.Users)
    }

    return Course;
}