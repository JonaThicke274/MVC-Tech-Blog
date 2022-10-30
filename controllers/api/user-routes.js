const router = require(`express`).Router();
const { User, Post, Comment } = require(`../../models`);
const withAuth = require (`../../utils/auth.js`);

// Get all users
router.get(`/`, (req, res) => {
    User.findAll({
        attributes: { exclude: [`password`] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Get one user by id
router.get(`/:id`, (req, res) => {
    User.findOne({
        attributes: {exclude: [`password`] },
        where: { id: req.params.id },
        include: [
            {
                model: Post,
                attributes: [`id`, `title`, `post_content`, `created_at`]
            },
            {
                model: Comment,
                attributes: [`id`, `comment_text`, `created_at`],
                includes: {
                    model: Post,
                    attributes: [`title`]
                }
            }
        ]
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: `No user with this id exists`});
            return;
        }

        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Create new user
router.post(`/`, (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        github: req.body.github
    })
    .then(dbUserData => {
        req.session.save(() => {
            // Declare session variables
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ message: `Account created! You are now logged in!` });
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Login route
router.post(`/login`, (req, res) => {
    User.findOne({
        where: { email: req.body.email }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: `No user with that email address!` });
            return;
        }

        // Verify user
        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: `Incorrect password!` });
            return;
        }

        req.session.save(() => {
            // Declare session variables
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ message: `You are now logged in!` });
        });
    });
});

// Logout route
router.post(`/logout`, (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.json({ message: `You are now logged out`}).status(204).end();
        });
    }
    else {
        console.log(`
        ===============
        You can't log out if you're not logged in
        ===============`);
        res.status(404).end();
    }
});

// Update user by id
router.put(`/:id`, withAuth, (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        // Looks for id of user
        if (!dbUserData[0]) {
            res.status(404).json({ message: `No user with this id exists` });
            return;
        }
        res.json({ message: `User info updated!` });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Delete user by id
router.delete(`/:id`, withAuth, (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: `No user with this id exists` });
            return;
        }
        res.json({ message: `User deleted` });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;