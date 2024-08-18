const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const Post = require("../models/post");
const User = require("../models/user");
const HttpError = require("../models/error");

// CREATE POST
// POST: http://localhost:5000/api/posts
// PROTECTED
const create = async (req, res, next) => {
    try {
        let { title, category, description } = req.body;

        if (!title || !category || !description || !req.files)
            return next(new HttpError("Fill in all fields and choose a thumbnail!", 422));

        const { thumbnail } = req.files;

        // check file size
        if (thumbnail.size > 2000000) return next(new HttpError("Thumbnail should be less than 2MB!", 422));

        let fileName = thumbnail.name.split(".")[0] + uuid() + "." + thumbnail.name.split(".").pop();
        thumbnail.mv(path.join(__dirname, "..", "/uploads/posts", fileName), async (error) => {
            if (error) return next(new HttpError(error));

            const newPost = await Post.create({ title, category, description, thumbnail: fileName, creator: req.user.id });

            if (!newPost) return next(new HttpError("Post couldn't be created!", 422));

            // find user and increase post count by one
            const currentUser = await User.findById(req.user.id);
            const postCount = currentUser.posts + 1;
            await User.findByIdAndUpdate(req.user.id, { posts: postCount });

            res.status(201).json(newPost);
        });
    } catch (error) {
        return next(new HttpError(error));
    }
};

// GET ALL THE POSTS
// GET: http://localhost:5000/api/posts
// UNPROTECTED
const posts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ updatedAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error));
    }
};

// GET A SINGLE POST
// GET: http://localhost:5000/api/posts/:id
// UNPROTECTED
const post = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) return next(new HttpError("Post not found!", 404));

        res.status(200).json(post);
    } catch (error) {
        return next(new HttpError(error));
    }
};

// GET CATEGORY POST
// GET: http://localhost:5000/api/posts/categories/:category
// UNPROTECTED
const category = async (req, res, next) => {
    try {
        const { category } = req.params;
        const posts = await Post.find({ category }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error));
    }
};

// GET USER POSTS
// GET: http://localhost:5000/api/posts/users/:id
// UNPROTECTED
const self = async (req, res, next) => {
    try {
        const { id } = req.params;
        const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error));
    }
};

// EDIT POST
// PATCH: http://localhost:5000/api/posts/:id
// PROTECTED
const edit = async (req, res, next) => {
    try {
        let updatedPost;
        const postId = req.params.id;
        const { title, category, description } = req.body;

        // React-Quill (FRONTEND) has a paragraph opening and closing tag with a break tag in between so there are 11 caharcters in there already.
        if (!title || !category || description.length < 12) return next(new HttpError("Fill in all fields!", 422));
        
        // get old post from database
        const oldPost = await Post.findById(postId);
        
        if (req.user.id === oldPost.creator.toString()) {
            if (!req.files) {
                updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description }, { new: true });
            } else {
                // delete old thumbnail from upload folder
                fs.unlink(path.join(__dirname, "..", "/uploads/posts", oldPost.thumbnail), async (error) => {
                    if (error) return next(new HttpError(error));
                });
                // upload new thumbnail
                const { thumbnail } = req.files;
                // check thumbnail file size
                if (thumbnail.size > 2000000) return next(new HttpError("Thumbnail should be less than 2MB!", 422));
    
                let fileName = thumbnail.name.split(".")[0] + uuid() + "." + thumbnail.name.split(".").pop();
                thumbnail.mv(path.join(__dirname, "..", "/uploads/posts", fileName), (error) => {
                    if (error) return next(new HttpError(error));
                });
                updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description, thumbnail: fileName }, { new: true });
            }
            if (!updatedPost) return next(new HttpError("Post couldn't updated!", 400));
    
            res.status(200).json(updatedPost);
        } else {
            return next(new HttpError("Unauthorized to edit this post!", 403));
        }
        
    } catch (error) {
        return next(new HttpError("An error occurred while updating the post!", 500));
    }
};

// DELETE POST
// DELETE: http://localhost:5000/api/posts/:id
// PROTECTED
const deletee = async (req, res, next) => {
    try {
        const postId = req.params.id;

        if (!postId) return next(new HttpError("Post Unavailable!", 400));

        const post = await Post.findById(postId);
        const fileName = post?.thumbnail;

        if (req.user.id === post.creator.toString()) {
            // delete thumbnail from upload folder
            fs.unlink(path.join(__dirname, "..", "/uploads/posts", fileName), async (error) => {
                if (error) return next(new HttpError(error));
                
                await Post.findByIdAndDelete(postId);
                // find user and reduce post count by one
                const currentUser = await User.findById(req.user.id);
                const postCount = currentUser?.posts - 1;
                await User.findByIdAndUpdate(req.user.id, { posts: postCount });
                res.json(`Post ${postId} deleted.`);
            });
        } else {
            return next(new HttpError("Unauthorized to delete this post!", 403));
        }
    } catch (error) {
        return next(new HttpError(error));
    }
};

module.exports = { create, edit, deletee, self, category, posts, post };