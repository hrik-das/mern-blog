import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

import Logo from "../assets/Logo.png";
import { UserContext } from "../context/user";

const Header = () => {
    const [isNavbarShowing, setIsNavbarShowing] = useState(window.innerWidth > 800 ? true : false);
    const { currentUser } = useContext(UserContext);

    const closeNavbarHandler = () => {
        if (window.innerWidth < 800) setIsNavbarShowing(false);
        else setIsNavbarShowing(true);
    }

    return (
        <nav>
            <div className="container navbar-container">
                <Link to="/" className="navbar-logo" onClick = {closeNavbarHandler}>
                    <img src={Logo} alt="Logo"/>
                </Link>

                { currentUser?.id && isNavbarShowing && <ul className="navbar-menu">
                    <li><Link to={`/profile/${currentUser?.id}`} onClick = {closeNavbarHandler}>{currentUser?.name}</Link></li>
                    <li><Link to="/" onClick = {closeNavbarHandler}>Home</Link></li>
                    <li><Link to="/create" onClick = {closeNavbarHandler}>Create Post</Link></li>
                    <li><Link to="/authors" onClick = {closeNavbarHandler}>Authors</Link></li>
                    <li><Link to="/logout" onClick = {closeNavbarHandler}>Logout</Link></li>
                </ul> }
                
                { !currentUser?.id && isNavbarShowing && <ul className="navbar-menu">
                    <li><Link to="/" onClick = {closeNavbarHandler}>Home</Link></li>
                    <li><Link to="/authors" onClick = {closeNavbarHandler}>Authors</Link></li>
                    <li><Link to="/login" onClick = {closeNavbarHandler}>Login</Link></li>
                </ul> }

                <button className="navbar-toggle-btn" onClick = {() => setIsNavbarShowing(!isNavbarShowing)}>
                    { isNavbarShowing ? <AiOutlineClose /> : <FaBars /> }
                </button>
            </div>
        </nav>
    );
};

export default Header;