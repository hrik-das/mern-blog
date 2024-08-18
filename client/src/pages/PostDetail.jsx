import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import axios from "axios";

import PostAuthor from "../components/PostAuthor";
import DeletePost from "./DeletePost";
import Loader from "../components/Loader";
import { UserContext } from "../context/user";

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { currentUser } = useContext(UserContext);

    useEffect(() => {
        const posts = async () => {
            setIsLoading(true);

            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`);
                setPost(response.data);
            } catch (error) {
                console.log(error.message);
            }

            setIsLoading(false);
        };

        posts();
    }, []);

    if (isLoading) return <Loader />;

    return (
        <section className="post-detail">
            { error && <p className="error">{error}</p> }
            { post && <div className="container post-detail-container">
                <div className="post-detail-header">
                    <PostAuthor authorId={post.creator} createdAt={post.createdAt} />

                    { currentUser?.id == post?.creator && <div className="post-detail-buttons">
                        <Link to={`/posts/${post?._id}/edit`} className="btn sm primary">
                            <FaRegEdit /> Edit
                        </Link>

                        <DeletePost postId={id} />
                    </div> }
                </div>

                <h1>{post.title}</h1>
                <div className="post-detail-thumbnail">
                    <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/posts/${post.thumbnail}`} alt="thumbnail" />
                </div>

                <p dangerouslySetInnerHTML={{ __html: post.description }}></p>
            </div> }
        </section>
    );
};

export default PostDetail;