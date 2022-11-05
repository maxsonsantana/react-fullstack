const Validator = require('validator');
const isEmpty = require("./isEmpty");

const validatorRegisterInput = (data) => {
    let errors = {};

    //Check the email field
    if(isEmpty(data.email)){
        errors.email = "O campo email não pode estar vazio!";
    }else if(!Validator.isEmail(data.email)){
        errors.email = 'Email inválido, favor digitar o email corretamente!';
    }

    //Check password field
    if(isEmpty(data.password)){
        errors.password = "A senha não pode estar vazia";
    }else if(!Validator.isLength(data.password, {min: 3, max: 20})){
        errors.password = "A senha deve ter entre 3 e 20 caracteres";
    }

    //Check name field
    if(isEmpty(data.name)){
        errors.name = "O nome não pode estar vazio!";
    }else if(!Validator.isLength(data.name, {min: 3, max: 60})){
        errors.name = "O nome deve ter entre 3 e 60 caracteres";
    }

    //Check confirm password field
    if(isEmpty(data.confirmPassword)){
        errors.confirmPassword = "O campo de confirmação da Senha não pode estar vazio";
    }else if(!Validator.equals(data.password, data.confirmPassword)){
        errors.confirmPassword = "As senhas não são iguais";
    }

    return{
        errors,
        isValid: isEmpty(errors),
    }
};

module.exports = validatorRegisterInput;