import React, { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { GrUpdate } from "react-icons/gr";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { UserContext } from "../context/user";

const EditPost = () => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Uncategorized");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [error, setError] = useState("");

    const formats = ["header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image"];

    const postCategories = ["Agriculture", "Business", "Education", "Entertainment", "Art", "Investment", "Community", "Politics", "Science", "Gaming", "Research", "International", "Nature", "Uncategorized", "Weather"];

    const modules = {
        toolbar: [
            [{ "header": [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ "list": "ordered" }, { "list": "bullet" }, { "indent": "-1" }, { "indent": "+1" }],
            ["link", "image"],
            ["clean"]
        ]
    };

    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);
    const token = currentUser?.token;
    const { id } = useParams();

    // redirect to login page for any user who isn't logged in
    useEffect(() => {
        if (!token) navigate("/login");
    }, []);

    useEffect(() => {
        const getPost = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`);
                setTitle(response.data.title);
                setCategory(response.data.category);
                setDescription(response.data.description);
            } catch (error) {
                console.log(error);
            }
        };

        getPost();
    }, []);

    const editPost = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.set("title", title);
        data.set("category", category);
        data.set("description", description);
        data.set("thumbnail", thumbnail);
    
        try {
            const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/posts/${id}`, data, { 
                withCredentials: true, 
                headers: { Authorization: `Bearer ${token}` }
            });
    
            if (response.status == 200) return navigate("/");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
            setError(errorMessage);
        }
    };

    return (
        <section className="create-post">
            <div className="container">
                <h2>Edit Post</h2>
                { error && <p className="form-error-message">{error}</p> }

                <form className="form create-post-form" onSubmit={editPost}>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter Post Title" autoFocus />
                    <select name="category" value={category} onChange={e => setCategory(e.target.value)}>
                        { postCategories.map(category => <option key={category}>{category}</option>) }
                    </select>
                    <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription} />
                    <input type="file" onChange={e => setThumbnail(e.target.files[0])} accept="png, jpg, jpeg" />
                    <button type="submit" className="btn primary"><GrUpdate /> Update</button>
                </form>
            </div>
        </section>
    );
};

export default EditPost;