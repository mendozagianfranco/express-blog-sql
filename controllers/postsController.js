const posts = require('../data/posts');
const connection = require('../data/db');

function index(req, res) {

    const sql = 'SELECT * FROM posts';

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(results);
    });

}

function show(req, res) {
    const { id } = req.params;

    const postSql = 'SELECT * FROM posts WHERE id= ?';

    const tagsSql = `SELECT tags.* 
                    FROM tags
                    JOIN post_tag ON tags.id = post_tag.tag_id
                    WHERE post_tag.post_id = ?`;

    connection.query(postSql, [id], (err, postResults) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (postResults.length === 0) return res.status(404).json({ error: 'Post not found' });
        const post = postResults[0];

        connection.query(tagsSql, [id], (err, tagsResults) => {
            if (err) return res.status(500).json({ error: 'Database query failed' });
            post.tags = tagsResults;
            res.json(post);
        });
    });
}

function store(req, res) {
    const newId = posts.at(-1).id + 1;
    const newPost = {
        id: newId,
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags
    };

    posts.push(newPost);
    console.log(posts);
    res.status(201).json(newPost);
}

function update(req, res) {
    const id = parseInt(req.params.id);
    const post = posts.find(post => post.id === id);

    if (!post) {
        return res.status(404).json({
            status: 404,
            error: "Not Found",
            message: "Post non trovato"
        });
    }

    post.title = req.body.title;
    post.content = req.body.content;
    post.image = req.body.image;
    post.tags = req.body.tags;

    res.json(post);

}

function modify(req, res) {
    const id = parseInt(req.params.id);
    const post = posts.find(post => post.id === id);

    if (!post) {
        return res.status(404).json({
            status: 404,
            error: "Not Found",
            message: "Post non trovato"
        });
    }

    if (req.body.title) {
        post.title = req.body.title;
    }

    if (req.body.content) {
        post.content = req.body.content;
    }

    if (req.body.image) {
        post.image = req.body.image;
    }

    if (req.body.tags) {
        post.tags = req.body.tags;
    }

    console.log(posts);

    res.json(post);
}

function destroy(req, res) {
    const { id } = req.params;

    const sql = 'DELETE FROM posts WHERE id = ?';

    connection.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to delete post' });
        res.sendStatus(204);
    });
}

module.exports = { index, show, store, update, modify, destroy };