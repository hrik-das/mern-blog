import React, { useEffect, useState } from "react";
import axios from "axios";

import PostItem from "./PostItem";
import Loader from "./Loader";

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts`);
                setPosts(response?.data);   
            } catch (error) {
                console.log(error.message);
            }

            setIsLoading(false);
        };

        fetchPosts();
    }, []);

    if (isLoading) return <Loader />;

    return (
        <section className="posts">
            { posts.length > 0 ? <div className="container posts-container">
                { 
                    posts.map(({ _id: id, thumbnail, category, title, description, creator,  createdAt }) => <PostItem key={id} postId={id} thumbnail={thumbnail} category={category} title={title} description={description} authorId={creator} createdAt={createdAt} />)
                    // posts.map((post, index) => <PostItem key={`${post.id}-${index}`} {...post} />)
                }
            </div> : <h2 className="center">No Posts Found!</h2>}
        </section>
    );
};

export default Posts;