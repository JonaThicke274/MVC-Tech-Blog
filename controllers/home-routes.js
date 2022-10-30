const router = require(`express`).Router();
// const sequelize = require(`../config/connection.js`);
const { Post, User, Comment } = require(`../models`);

// Homepage/rootpage to display all posts
router.get(`/`, (req, res) => {
    console.log(req.session);

    Post.findAll({
        attributes: [`id`, `title`, `created_at`, `post_content`],
        include: [
            {
                model: Comment,
                attributes: [`id`, `comment_text`, `user_id`, `created_at`]
            },
            {
                model: User,
                attributes: [`username`, `github`]
            }
        ]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true  }));

        // Pass single post object into homeplage template
        res.render(`homepage`, {
            posts,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Login page
router.get(`/login`, (req, res) => {
    if (req.session.loggedIn) {
        res.redirect(`/`);
        return;
    }

    res.render(`login`);
});

// Single-post page
router.get(`/post/:id`, (req, res) => {
    Post.findOne({
        attributes: [`id`, `title`, `created_at`, `post_content`],
        include: [
            {
                model: Comment,
                attributes: [`id`, `comment_text`, `user_id`, `created_at`],
                include: [{
                    model: User,
                    attributes: [`username`]
                }]
            },
            {
                model: User,
                attributes: [`username`, `github`]
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: `No post with this id exists`})
        }

        const post = dbPostData.get({ plain: true });

        res.render(`single-post`,  {
            post,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;