const express = require('express');
const router = express.Router();
const User = require("../models/UserModel");
const bcrypt = require('bcryptjs');
const validatorRegisterInput = require('../validation/registerValidation');


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
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name
        });
        const savedUser = await newUser.save();
        return res.json(savedUser);
    }catch(err){
        //TODO
        console.log(err);
        res.status(500).send(err.message);
    }
})

module.exports = router;