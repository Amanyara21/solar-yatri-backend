const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    userType: { 
        type: String, 
        enum: ['admin', 'user'], 
        required: true 
    },
    householdSize: {
        type: String,
        required: true,
    },
    investmentCapacity: {
        type: Number,
        required: true,
    },
    monthlyElectricityUsage: {
        type: String,
        required: true,
    },
    investmentDuration: {
        type: String,
        enum: ['Short', 'Medium', 'Long'],
        required: true,
    },
    investments: [
        {
            projectId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CommunityProject',
                required: true,
            },
            investmentAmount: {
                type: Number,
                required: true,
            },
        },
    ],
});

const User = mongoose.model('User', userSchema);
module.exports = User;
