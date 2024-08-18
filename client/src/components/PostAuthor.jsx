import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";

import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const PostAuthor = ({ authorId, createdAt }) => {
    const [author, setAuthor] = useState({});

    useEffect(() => {
        const authors = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${authorId}`);
                setAuthor(response?.data);
            } catch (error) {
                console.log(error.message);
            }
        };

        authors();
    }, []);

    return (
        <Link to={`/posts/users/${authorId}`} className="post-author">
            <div className="post-author-avatar">
                <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/users/${author?.avatar}`} alt="avatar" />
            </div>

            <div className="post-author-details">
                <h5>By - {author?.name}</h5>
                <small><ReactTimeAgo date={new Date(createdAt)} locale="en-US" /></small>
            </div>
        </Link>
    );
};

export default PostAuthor;