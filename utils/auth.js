const withAuth = (req, res, next) => {
    if (!req.session.user_id) {
        console.log(`
        ================
        You need to be logged in to do this action
        ================`)
        res.redirect(`/login`); //Place holder redirect
    }
    else {
        next();
    }
}

module.exports = withAuth;