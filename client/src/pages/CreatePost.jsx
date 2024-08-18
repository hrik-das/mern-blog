import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { IoIosCreate } from "react-icons/io";
import axios from "axios";

import { UserContext } from "../context/user";

const CreatePost = () => {
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

    // redirect to login page for any user who isn't logged in
    useEffect(() => {
        if (!token) navigate("/login");
    }, []);

    const createPost = async (e) => {
        e.preventDefault();
    
        const data = new FormData();
        data.set("title", title);
        data.set("category", category);
        data.set("description", description);
        data.set("thumbnail", thumbnail);
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/posts`, data, { 
                withCredentials: true, 
                headers: { Authorization: `Bearer ${token}` }
            });
    
            if (response.status == 201) return navigate("/");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
            setError(errorMessage);
        }
    };    

    return (
        <section className="create-post">
            <div className="container">
                <h2>Create Post</h2>
                { error && <p className="form-error-message">{error}</p> }

                <form className="form create-post-form" onSubmit={createPost}>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter Post Title" autoFocus />
                    <select name="category" value={category} onChange={e => setCategory(e.target.value)}>
                        { postCategories.map(category => <option key={category}>{category}</option>) }
                    </select>
                    <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription} />
                    <input type="file" onChange={e => setThumbnail(e.target.files[0])} accept="png, jpg, jpeg" />
                    <button type="submit" className="btn primary"><IoIosCreate /> Create</button>
                </form>
            </div>
        </section>
    );
};

export default CreatePost;