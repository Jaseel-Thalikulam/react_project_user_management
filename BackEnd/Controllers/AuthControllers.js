const { json } = require("express")

const UserModel = require("../Model/UserModel")
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const secretKeyAdmin = process.env.SECRET_KEY_ADMIN;


const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const maxAge = 3 * 24 * 60 * 60

const createToken = (id) => {
  
     return jwt.sign({ id }, secretKey, {
        expiresIn: maxAge
    })
}

const createTokenAdmin = (id) => {
    
    return jwt.sign({ id }, secretKeyAdmin, {
        expiresIn: maxAge
    })
}



const handleErrors = (err) => {

    const errorMessage = err.message;

    let errors = { email: '', password: '', phone: '' }
    if (errorMessage === 'incorrect Email') {

        errors.email = 'This email is not been registred'
    }

    if (errorMessage === 'incorrect password') {

        errors.password = 'wrong password'
    }

    if (errorMessage === 'Password required !') {

        errors.password = 'Password required !'
    }
    if (errorMessage === 'Email required !') {

        errors.password = 'Email required !'
    }
    if (errorMessage === 'Phone number is already registered') {

        errors.phone = 'Phone number is already registered'
    }

    if (err.code === 11000) {

        const emailMatch = errorMessage.match(/email: "(.*?)"/);
        const phoneMatch = errorMessage.match(/phone: "(.*?)"/);
        if (emailMatch) {
            console.log("Exist:", emailMatch[1]);
            errors.email = "Email already exists"
        } else if (phoneMatch) {
            console.log("Exist:", phoneMatch[1]);
            errors.phone = "Mobile Number already exists"
        }

        return errors
    }

    if (errorMessage.includes('Users validation failed')) {

        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
}

module.exports.login = async (req, res, next) => {
    try {


        const { email, password } = req.body
        const user = await UserModel.login(email, password)
        const token = createToken(user._id)
        const tokenAdmin = createTokenAdmin(user._id)

        if (user.user == false) {
            
            res.cookie('jwtadmin', tokenAdmin, {
                withCredentials: true,
                httpOnly: false,
                maxAge: maxAge * 1000

            })
        } else {
            res.cookie('jwt', token, {
                withCredentials: true,
                httpOnly: false,
                maxAge: maxAge * 1000
            })
        }




        res.status(200).json({ user: user, created: true })

    } catch (error) {
        const errors = handleErrors(error)
        res.json({ errors, created: false })
    }
}


module.exports.register = async (req, res) => {
    try {

       const { email, password, phone, firstname} = req.body;
const user = await UserModel.create({ email, password, phone, firstname });



        res.status(201).json({ user: user, created: true })

    } catch (error) {
        console.log('Error founded ', error.message);

        const errors = handleErrors(error)
        res.json({ errors, created: false })
    }
}

module.exports.admin = async (req, res) => {

   
    const data = await UserModel.find({ user: true })

    res.status(200).json({ data: data })

}

module.exports.deleteUser = (req, res, next) => {
    try {
        const id = req.params.id

        UserModel.deleteOne({ _id: id }).then((result) => {
            res.json({ message: "Deletion Successful", status: true });
        })
    } catch (error) {

        console.log(error.message);
    }
}


module.exports.editUser = async (req, res, next) => {
 
    const { id, email, phone, firstname } = req.body

    if (phone) {

        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

            UserModel.updateOne({ _id: id }, {
                $set: { email: email, phone: phone, firstname: firstname }
            }).then(() => {
                res.json({ status: true, message: 'Updation Successful' })
            }).catch((err) => {
                console.log(err.message);
                res.json({ status: false, message: 'Oops,Currently Facing some technical issues' })
            })
        } else {

            res.json({ status: false, message: 'Invalid email format' })
        }

    } else {
        res.json({ status: false, message: 'Phone number required !' })
    }




}

module.exports.uploadImage = async (req, res, next) => {


    const data = await UserModel.findOne({ _id: req.headers.userid })



    if (data.image) {

        fs.unlink(path.join(__dirname, '../../public/public/image/', data.image), (err) => {
            if (err) {
                console.log('Error while deleting image', err.message);
            }
        });

    }

    UserModel.updateOne({ _id: req.headers.userid }, {
        $set: {
            image: req.file.filename
        }
    }).then(async () => {

        const datas = await UserModel.findOne({ _id: req.headers.userid })
        res.json({ user: datas })


    })



}