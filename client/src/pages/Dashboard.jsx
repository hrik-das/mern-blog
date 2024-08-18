import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GrFormViewHide } from "react-icons/gr";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import axios from "axios";

import { UserContext } from "../context/user";
import DeletePost from "../pages/DeletePost";
import Loader from "../components/Loader";

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();

    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);
    const token = currentUser?.token;

    // redirect to login page for any user who isn't logged in
    useEffect(() => {
        if (!token) navigate("/login");
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);

            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/users/${id}`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPosts(response.data);
            } catch (error) {
                console.log(error.message);
            }

            setIsLoading(false);
        };

        fetchPosts();
    }, [id]);

    if (isLoading) return <Loader />;

    return (
        <section className="dashboard">
            {
                posts.length ? <div className="container dashboard-container">
                    {
                        posts.map(post => {
                            return <article key={post.id} className="dashboard-post">
                                <div className="dashboard-post-info">
                                    <div className="dashboard-post-thumbnail">
                                        <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/posts/${post.thumbnail}`} alt="" />
                                    </div>

                                    <h5>{post.title}</h5>
                                </div>
                                <div className="dashboard-post-actions">
                                    <Link to={`/posts/${post._id}`} className="btn sm"><GrFormViewHide /> View</Link>
                                    <Link to={`/posts/${post._id}/edit`} className="btn sm primary"><FaRegEdit /> Edit</Link>
                                    <DeletePost postId={post._id} />
                                </div>
                            </article>
                        })
                    }
                </div> : <h2 className="center">You have no posts yet.</h2>
            }
        </section>
    );
};

export default Dashboard;