const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = class AuthController {

    static login(req, res) {
        res.render('auth/login')
    }

    static register(req, res) {
        res.render('auth/register')
    }

    static async registerPost(req, res) {
        const { id, firstname, lastname, email, password, Confirmpassword, gender } = req.body

        // password match validation
        if(password != Confirmpassword) {
            req.flash('message', 'As senhas não conferem, tente novamente!')
            res.render('auth/register')

            return
        }

        // check if user exists
        const checkIfUserExists = await User.findOne({where: {email: email}})
        if(checkIfUserExists) {
            req.flash('message', 'O e-mail já está em uso!')
            res.render('auth/register')

            return
        }

        // create a password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            id,
            firstname,
            lastname,
            email,
            password: hashedPassword,
            gender
        }

        try {
            await User.create(user)

            req.flash('message', 'Cadastro realizado com sucesso!')

            res.redirect('/home')
        } catch (err) {
            console.log(err)
        }
    }
}