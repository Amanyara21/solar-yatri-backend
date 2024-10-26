const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const CommunityProject = require('../models/communityModel');
const userMiddleware = require('../middelware/userMiddleware');

router.post('/invest', userMiddleware, async (req, res) => {
    const { projectId, investmentAmount } = req.body;

    if (!investmentAmount || investmentAmount <= 0) {
        return res.status(400).json({ message: 'Investment amount must be greater than zero' });
    }

    try {
        const user = await User.findById(req.user.id);
        const project = await CommunityProject.findById(projectId);

        if (!user || !project) {
            return res.status(404).json({ message: 'User or Project not found' });
        }

        console.log(user, project);
        
        user.investments.push({ projectId, investmentAmount });
        project.investors.push({ userId: user._id, investmentAmount });

        project.invested += investmentAmount;

        await user.save();
        await project.save();

        res.status(200).json({ message: 'Investment successful', user, project });
    } catch (err) {
        res.status(500).json({ message: 'Error making investment', error: err.message });
    }
});


router.get('/user/orders', userMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate({
                path: 'investments.projectId',
                select: 'projectName totalCapacity co2_saved_per_minute energy_production_per_minute energy_saving',
                options: { lean: true }
            });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check investments before mapping
        console.log("User investments:", user.investments);

        const orders = user.investments.map(investment => {
            const project = investment.projectId;

            // Debugging statement for field check
            console.log('Accessing project fields:', {
                projectName: project.projectName,
                co2_saved_per_minute: project.co2_saved_per_minute,
                energy_production_per_minute: project.energy_production_per_minute,
                energy_saving: project.energy_saving
            });

            const percentageShare = (investment.investmentAmount / project.totalCapacity) * 100;
            return {
                companyName: project.projectName,
                investedAmount: investment.investmentAmount,
                percentageShare,
                co2_saved_per_minute: project.co2_saved_per_minute,
                energy_production_per_minute: project.energy_production_per_minute,
                energy_saving: project.energy_saving
            };
        });

        // Final debugging check before sending response
        console.log("Final Orders Output:", orders);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});




module.exports = router;
