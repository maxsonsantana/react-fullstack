const Validator = require('validator');
const isEmpty = require('./isEmpty');

const ValidateToDoInput = data => {
    let errors = {};

    if(isEmpty(data.content)){
        errors.content = "O campo conteúdo não pode estar vazio";
    }else if(!Validator.isLength(data.content, { min: 1, max: 300 })){
        errors.content = 'O Campo conteúdo deve ter entre 1 e 300 Caracteres';
    }

    return{
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = ValidateToDoInput;