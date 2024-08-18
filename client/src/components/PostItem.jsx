import React from "react";
import { Link } from "react-router-dom";

import PostAuthor from "./PostAuthor";

const PostItem = ({ postId, category, title, description, authorId, thumbnail, createdAt }) => {
    const postTitle = title.length > 30 ? title.substr(0, 30) + "..." : title;
    const postDescription = description.length > 145 ? description.substr(0, 145) + "..." : description;

    return (
        <article className="post">
            <div className="post-thumbnail">
                <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/posts/${thumbnail}`} alt={title} />
            </div>

            <div className="post-content">
                <Link to={`/posts/${postId}`}>
                    <h3>{postTitle}</h3>
                </Link>
                
                <p dangerouslySetInnerHTML={{ __html: postDescription }}></p>

                <div className="post-footer">
                    <PostAuthor authorId={authorId} createdAt={createdAt} />
                    <Link to={`/posts/categories/${category}`} className="btn category">{category}</Link>
                </div>
            </div>
        </article>
    );
};

export default PostItem;