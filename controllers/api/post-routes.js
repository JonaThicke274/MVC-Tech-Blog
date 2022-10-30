const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Get all posts
router.get(`/`, (req, res) => {
    Post.findAll({
        attributes: [`id`, `title`, `created_at`, `post_content`],
        order: [[`created_at`,`DESC`]],
        include: [
            {
                model: Comment,
                attributes: [`id`, `comment_text`, `user_id`, `created_at`],
                include: {
                    model: User,
                    attributes: [`username`, `github`]
                }
            },
            {
                model: User,
                attributes: [`username`, `github`]
            }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Get one post by id
router.get(`/:id`, (req, res) => {
    Post.findOne({
        where: { id: req.params.id },
        attributes: [ `id`, `title`, `created_at`, `post_content`],
        include: [
            {
                model: Comment,
                attributes: [`id`, `comment_text`, `user_id`, `created_at`],
                include: {
                    model: User,
                    attributes: [`username`, `github`]
                }
            },
            {
                model: User,
                attributes: [`username`, `github`]
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: `No post with this id exists`});
            return;
        }

        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Create new post
router.post(`/`, withAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        post_content: req.body.post_content,
        user_id: req.session.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Update post title and/or content
router.put(`/:id`, withAuth, (req, res) => {
    Post.update({
        title: req.body.title,
        post_content: req.body.post_content
    },
    {
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: `No post with this id exists`});
            return;
        }

        res.json({ message: `Post updated!`});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Delete as post by id
router.delete(`/:id`, withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: `No post with this id exists` });
            return;
        }

        res.json({ message: `Post deleted` });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;