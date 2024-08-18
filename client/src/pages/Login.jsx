import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidUserDetail } from "react-icons/bi";
import { CgLogIn } from "react-icons/cg";
import axios from "axios";

import { UserContext } from "../context/user";

const Login = () => {
    const [userData, setUserData] = useState({
        email: "",
        password: "",
    });

    const changeInputHandler = (e) => {
        setUserData(previousState => {
            return {...previousState, [e.target.name]: e.target.value};
        });
    };

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const { setCurrentUser } = useContext(UserContext);

    const login = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/login`, userData);
            const user = await response.data;
            setCurrentUser(user);
            navigate("/");
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (
        <section className="login">
            <div className="container">
                <h2><CgLogIn /> SIGN IN</h2>
                <form className="form login-form" onSubmit={login}>
                    { error && <p className="form-error-message">{error}</p> }
                    <input type="email" name="email" value={userData.email} onChange={changeInputHandler} placeholder="Enter Your Email Address" autoFocus />
                    <input type="password" name="password" value={userData.password} onChange={changeInputHandler} placeholder="Enter Your Password" />
                    <button type="submit" className="btn primary">LOGIN</button>
                </form>

                <small>
                    Don't Have an account?
                    <Link to="/register">
                    <BiSolidUserDetail /> SIGN UP
                    </Link>
                </small>
            </div>
        </section>
    );
};

export default Login;