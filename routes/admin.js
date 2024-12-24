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
    const success_msg = req.session.success_msg || null;
    const error_msg = req.session.error_msg || null;
    const error = req.session.error || null;

    delete req.session.success_msg;
    delete req.session.error_msg;
    delete req.session.error;

    const user = req.session.username ? {
        username: req.session.username,
        isAdmin: req.session.role === 'admin',
    } : null;

    res.render('manage_users', {
        success_msg: success_msg,
        error_msg: error_msg,
        error: error,
        user: user
    });
});

router.get('/badges', async (req, res) => {
    const success_msg = req.session.success_msg || null;
    const error_msg = req.session.error_msg || null;
    const error = req.session.error || null;

    delete req.session.success_msg;
    delete req.session.error_msg;
    delete req.session.error;

    const user = req.session.username ? {
        username: req.session.username,
        isAdmin: req.session.role === 'admin',
    } : null;

    res.render('badges', {
        success_msg: success_msg,
        error_msg: error_msg,
        error: error,
        user: user
    });
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
            req.session.error_msg = 'Badge not found';
            return res.redirect('/admin/badges');
        }
        if (action === 'update') {
            badge.name = name;
            badge.bitpoints_min = Number(bitpoints_min);
            badge.bitpoints_max = Number(bitpoints_max);
            badge.image_url = image_url;

            await badge.save();
            req.session.success_msg = 'Badge updated successfully';
            return res.redirect('/admin/badges');
        } else if (action === 'cancel') {
            req.session.success_msg = 'Badge update cancelled';
            return res.redirect('/admin/badges');
        }
    } catch (err) {
        console.error(err);
        req.session.error_msg = 'Server error';
        return res.redirect('/admin/badges');
    }
});

router.post('/badges/delete/:id', async (req, res) => {
    const name = req.params.id;
    try {
        await Badge.findOneAndDelete({name: name});
        req.session.success_msg = 'Badge deleted successfully';
        return res.redirect('/admin/badges');
    } catch (err) {
        console.error(err);
        req.session.error_msg = 'Server error';
        return res.redirect('/admin/badges');
    }
});

router.post('/change-password', async (req, res) => {
    const {userId, newPassword} = req.body;

    try {
        const user = await User.findOne({username: userId});
        if (!user) {
            req.session.error_msg = 'User not found';
            return res.redirect('/admin/users');
        }

        const isSamePassword = await user.comparePassword(newPassword);
        if (isSamePassword) {
            req.session.error_msg = 'New password cannot be the same as the old password';
            return res.redirect('/admin/users');
        }

        user.password = newPassword;
        await user.save();
        req.session.success_msg = 'Password changed successfully';
        return res.redirect('/admin/users');
    } catch (err) {
        console.error(err);
        req.session.error_msg = 'Server error';
        return res.redirect('/admin/users');
    }
});


export default router;