import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaCheck } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";
import axios from "axios";

import { UserContext } from "../context/user";

const UserProfile = () => {
    const [avatar, setAvatar] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isAvatarTouched, setIsAvatarTouched] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);
    const token = currentUser?.token;

    // redirect to login page for any user who isn't logged in
    useEffect(() => {
        if (!token) navigate("/login");
    }, []);

    useEffect(() => {
        const getUser = async () => {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${currentUser.id}`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const { name, email, avatar } = response.data;
            setName(name);
            setEmail(email);
            setAvatar(avatar);
        };

        getUser();
    }, []);

    const changeAvatarHandler = async () => {
        setIsAvatarTouched(false);

        try {
            const data = new FormData();
            data.set("avatar", avatar);

            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/change-avatar`, data, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAvatar(response?.data.avatar);
        } catch (error) {
            console.log(error.message);
        }
    };

    const updateDetails = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();
            data.set("name", name);
            data.set("email", email);
            data.set("currentPassword", currentPassword);
            data.set("newPassword", newPassword);
            data.set("confirmNewPassword", confirmNewPassword);
    
            const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/users/edit-user`, data, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            // logout user in order to login with new credentials
            if (response.status == 200) navigate("/logout");
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (
        <section className="profile">
            <div className="container profile-container">
                <Link to={`/myposts/${currentUser.id}`} className="btn">My Posts</Link>
                
                <div className="profile-details">
                    <div className="avatar-wrapper">
                        <div className="profile-avatar">
                            <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/users/${avatar}`} alt="User Image" />
                        </div>

                        <form className="avatar-form">
                            <input type="file" name="avatar" id="avatar" accept="png, jpg, jpeg" onChange={e => setAvatar(e.target.files[0])} />
                            <label htmlFor="avatar" onClick={() => setIsAvatarTouched(true)}><FaEdit /></label>
                        </form>
                        { isAvatarTouched && <button className="profile-avatar-btn" onClick={changeAvatarHandler}><FaCheck /></button> }
                    </div>

                    <h1>{currentUser.name}</h1>
                    <form className="form profile-form" onSubmit={updateDetails}>
                        { error && <p className="form-error-message">{error}</p> }
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter Full Name" autoFocus />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter Email Address" />
                        <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Enter Current Password" />
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter New Password" />
                        <input type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} placeholder="Confirm New Password" />
                        <button type="submit" className="btn primary"><GrUpdate /> Update Details</button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default UserProfile;