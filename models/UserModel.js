const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password:{
            type: String,
            required: true,
        },
        name:{
            type: String,
            required: true,
        }
    },{
        timestamps: true,
    }
);

//Export model
const User = model("UserModel", UserSchema);
module.exports = User;