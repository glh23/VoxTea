const express = require('express');
const router = express.Router();
const User = require('../../models/User'); 

router.get('/me', async (req, res) => {
    console.log('In: me')
    try {
        const user = await User.findById(req.user.id)
        // unselect the password
            .select('-password') 
            .populate('followers', 'following', 'username', 'profilePicture'); 

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
