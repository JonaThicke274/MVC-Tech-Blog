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

module.exports = router;