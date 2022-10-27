const withAuth = (req, res, next) => {
    if (!req.session.user_id) {
        res.redirect(`/login`); //Place holder redirect
    }
    else {
        next();
    }
}

module.exports = withAuth;