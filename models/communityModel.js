const mongoose = require('mongoose');

const communityProjectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
    },
    projectDescription: {
        type: String,
        required: true,
    },
    projectLocation: {
        type: String,
        required: true,
    },
    projectType: {
        type: String, 
        required: true,
    },
    totalCapacity: {
        type: Number, 
        required: true,
    },
    energyProduction: {
        type: Number,
        required: true,
    },
    carbonOffset: {
        type: Number,
        required: true,
    },
    minInvestmentAmount: {
        type: Number,
        required: true,
    },
    investmentTerm: {
        type: String, 
        required: true,
    },
    solarPanelType: {
        type: String,
        required: true,
    },
    gridConnectivity: {
        type: String,
        required: true,
    },
    batteryStorage: {
        type: String,
        required: true,
    },
    invested:{
        type:Number,
    },
    eventType: {
        type: String,
        enum: ['Company', 'Community'],
        required: true,
    },
    investors: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            investmentAmount: {
                type: Number,
                required: true,
            },
        },
    ],
});

const CommunityProject = mongoose.model('CommunityProject', communityProjectSchema);
module.exports = CommunityProject;
