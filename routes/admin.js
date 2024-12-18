import express from 'express';
import Badge from "../models/badge.model.js";
import User from "../models/user.model.js";

let router = express.Router();

router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.get('/dashboard', function (req, res) {
    if (req.session.role !== 'admin') {
        req.session.errorMessage = 'Necesitas permisos adicionales para acceder. Inicia sesión como administrador.';
        return res.redirect('/users/login');
    }
    res.render('admin_dashboard');
});

router.get('/users', function (req, res) {
    res.render('manage_users');
});

router.get('/badges', function (req, res) {
    res.render('badges');
});

router.get('/badges/edit/:id', async (req, res) => {
    const name = req.params.id;
    try {
        const badge = await Badge.findOne({name: name});
        if (badge) {
            res.render('edit_badge', {badge: badge});
        } else {
            res.status(404).send(`Badge ${id} not found`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving badge from database');
    }
});

router.post('/badges/edit/:id', async (req, res) => {
    const name = req.params.id;
    const {action, bitpoints_min, bitpoints_max, image_url} = req.body;
    try {
        const badge = await Badge.findOne({name: name});
        if (!badge) {
            return res.status(404).send('Badge not found');
        }
        if (action === 'update') {
            badge.name = name;
            badge.bitpoints_min = Number(bitpoints_min);
            badge.bitpoints_max = Number(bitpoints_max);
            badge.image_url = image_url;

            await badge.save();
            res.redirect(`/admin/badges`);
        } else if (action === 'cancel') {
            res.redirect(`/admin/badges`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing request');
    }
});

router.post('/badges/delete/:id', async (req, res) => {
    const name = req.params.id;
    try {
        await Badge.findOneAndDelete({name: name});
        res.redirect(`/admin/badges`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving badge from database');
    }
});

router.post('/change-password', async (req, res) => {
    const { userId, newPassword } = req.body;

    try {
        const user = await User.findOne({ username: userId });
        if (!user) {
            res.status(404).send('User not found');
        }

        const isSamePassword = await user.comparePassword(newPassword);
        if (isSamePassword) {
            return res.status(400).send('New password cannot be the same as the current password!');
        }

        user.password = newPassword;
        await user.save();
        res.status(200).send('Password changed successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error changing password');
    }
});


export default router;