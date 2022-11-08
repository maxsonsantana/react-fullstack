const express = require('express');
const router = express.Router();
const User = require("../models/UserModel");
const bcrypt = require('bcryptjs');
const validatorRegisterInput = require('../validation/registerValidation');
const jwt = require('jsonwebtoken');


//@route GET /api/auth/test
//@desc Testar a rota Auth
//@access Public 
router.get("/test", (req, res)=>{
    res.send("A rota Auth está Funcionando!");
})

//@route GET /api/auth/register
//@desc Criar um novo usuário
//@access Public
router.post("/register", async(req, res) => {
    try{
        //Validation Input
        const { errors, isValid}= validatorRegisterInput(req.body);
        if(!isValid){
            return res.status(400).json(errors);
        }

        //Check for existing user
        const existingEmail = await User.findOne({ 
            email: new RegExp("^"+ req.body.email + "$", "i")
        });

        if(existingEmail){
            return res.status(400).json({ error: "Já existe um usuário com este email!" });
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        //Create a new user
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name
        });

        //Save the user to the database
        const savedUser = await newUser.save();

        //Não retorna o Password
        const usertoReturn = { ...savedUser._doc }
        delete usertoReturn.password;

        //Return the new user
        return res.json(usertoReturn);
    }catch(err){
        //TODO
        console.log(err);
        res.status(500).send(err.message);
    }
});

//@route POST /api//auth/login
//@desc  Login user and return a access token
//@access Public
router.post("/login", async (req, res)=>{
    try{
        //Check for the user
        const user = await User.findOne({
            email: new RegExp("^"+ req.body.email + "$", "i"),
        });
        if(!user){
            return res
            .status(400)
            .json({ error: 'Existe um problema com suas credenciais de Login'});
        }

        const passwordMatch = await bcrypt.compare(
            req.body.password, 
            user.password
        );

        if(!passwordMatch){
            return res
            .status(400)
            .json({ error: 'Existe um problema com suas credenciais de Login'});
        }

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET,{
            expiresIn: "7d"
        });

        res.cookie("access-token", token,{
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 ),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        });

        const usertoReturn = { ...user._doc};
        delete usertoReturn.password;

        return res.json({
            token: token,
            user: usertoReturn,
        });

    }catch(err){
        console.log(err);
        return res.status(500).send(err.message);
    }
});

module.exports = router;