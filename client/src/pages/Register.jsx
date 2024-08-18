import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidUserDetail } from "react-icons/bi";
import { CgLogIn } from "react-icons/cg";
import axios from "axios";

const Register = () => {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const changeInputHandler = (e) => {
        setUserData(previousState => {
            return {...previousState, [e.target.name]: e.target.value};
        })
    };

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const register = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/register`, userData);
            const newUser = await response.data;
            if (!newUser) setError("Could'nt register user, try again!");
            navigate("/login");
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (
        <section className="register">
            <div className="container">
                <h2><BiSolidUserDetail /> SIGN UP</h2>
                <form className="form register-form" onSubmit={register}>
                    { error && <p className="form-error-message">{error}</p> }
                    <input type="text" name="name" value={userData.name} onChange={changeInputHandler} placeholder="Enter Your Name" autoFocus />
                    <input type="email" name="email" value={userData.email} onChange={changeInputHandler} placeholder="Enter Your Email Address" />
                    <input type="password" name="password" value={userData.password} onChange={changeInputHandler} placeholder="Enter Your Password" />
                    <input type="password" name="confirmPassword" value={userData.confirmPassword} onChange={changeInputHandler} placeholder="Confirm Your Password" />
                    <button type="submit" className="btn primary">REGISTER</button>
                </form>

                <small>
                    Already Have an account?
                    <Link to="/login">
                        <CgLogIn /> SIGN IN
                    </Link>
                </small>
            </div>
        </section>
    );
};

export default Register;