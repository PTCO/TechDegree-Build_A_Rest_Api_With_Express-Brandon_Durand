const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    class Users extends Sequelize.Model{}
    Users.init({
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A first name is required'
                },
                notEmpty: {
                    msg: 'Please provide a first name'
                }
            }
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A last name is required'
                },
                notEmpty: {
                    msg: 'Please provide a last name'
                }
            }            
        },
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: {
                msg: 'Email is already in use'
            },
            validate: {
                notNull: {
                    msg: 'An email is required'
                },
                notEmpty: {
                    msg: 'Please provide an email'
                },
                isEmail: {
                    msg: 'Email provided is invalid'
                }
            }            
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A password is required'
                },
                notEmpty: {
                    msg: 'Please provide a password'
                },
            },
            async set(val){
                const hashedPwd = await bcrypt.hashSync(val, 10);
                this.setDataValue('password', hashedPwd);
            }            
        },
    }, {sequelize});

    Users.associate = (models) => {
        Users.hasMany(models.Course)
    }

    return Users;
}