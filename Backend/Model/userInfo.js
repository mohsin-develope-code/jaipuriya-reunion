const mongoose = require("mongoose");

const UserInfo_Schema = new mongoose.Schema({

    user_name: {
        type: String,
        required: true,
    },

    user_number: {
        type: Number,
        required: true, 
    },

    address: {
        type: String,
        required: true,
    },

    city: {
        type: String,
        required: true,
    },

    adhaar: {
        type: String,
        required: true,
    },

    attend_someone:{
        type: String,
        required: true,
    },

    how_many_people:{
        type: Number,
        required: true,
    },

    support: {
        type: String,
        required: true,
    },
})



const User_Model = mongoose.model("user-info", UserInfo_Schema);

module.exports = User_Model;