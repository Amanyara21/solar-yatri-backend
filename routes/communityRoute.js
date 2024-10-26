const express = require('express');
const router = express.Router();
const CommunityProject = require('../models/communityModel');
const userMiddleware = require('../middelware/userMiddleware');

router.post('/project', userMiddleware, async (req, res) => {
    // if (req.user.userType !== 'admin') {
    //     return res.status(403).json({ message: 'Access denied. Only admins can add projects.' });
    // }

    const {
        projectName,
        projectDescription,
        projectLocation,
        projectType,
        totalCapacity,
        energyProduction,
        carbonOffset,
        minInvestmentAmount,
        investmentTerm,
        solarPanelType,
        gridConnectivity,
        batteryStorage,
        eventType
    } = req.body;

    try {
        const newProject = new CommunityProject({
            projectName,
            projectDescription,
            projectLocation,
            projectType,
            totalCapacity,
            energyProduction,
            carbonOffset,
            minInvestmentAmount,
            investmentTerm,
            solarPanelType,
            gridConnectivity,
            batteryStorage,
            invested:0,
            eventType,
            investments: [] ,  
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ message: 'Error creating project', error: err.message });
    }
});

router.get('/projects', userMiddleware, async (req, res) => {
    try {
        const projects = await CommunityProject.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving projects', error: err.message });
    }
});

router.get('/project/:id', userMiddleware, async (req, res) => {
    const projectId = req.params.id;

    try {
        const project = await CommunityProject.findById(projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving project', error: err.message });
    }
});

module.exports = router;
