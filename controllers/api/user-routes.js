const router = require(`express`).Router();
const { User, Post, Comment } = require(`../../models`);
const withAuth = require (`../../utils/auth.js`);

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

module.exports = router;