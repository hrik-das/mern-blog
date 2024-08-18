import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer>
            <ul className="footer-categories">
                <li><Link to="/posts/categories/Agriculture">Agriculture</Link></li>
                <li><Link to="/posts/categories/Business">Business</Link></li>
                <li><Link to="/posts/categories/Education">Education</Link></li>
                <li><Link to="/posts/categories/Entertainment">Entertainment</Link></li>
                <li><Link to="/posts/categories/Art">Art</Link></li>
                <li><Link to="/posts/categories/Investment">Investment</Link></li>
                <li><Link to="/posts/categories/Uncategorized">Uncategorized</Link></li>
                <li><Link to="/posts/categories/Community">Community</Link></li>
                <li><Link to="/posts/categories/Politics">Politics</Link></li>
                <li><Link to="/posts/categories/Science">Science</Link></li>
                <li><Link to="/posts/categories/Gaming">Gaming</Link></li>
                <li><Link to="/posts/categories/Research">Research</Link></li>
                <li><Link to="/posts/categories/International">International</Link></li>
                <li><Link to="/posts/categories/Nature">Nature</Link></li>
                <li><Link to="/posts/categories/Weather">Weather</Link></li>
            </ul>

            <div className="footer-copyright">
                <small>All Rights Reserved &copy; Copyright, Godlike-Creation 2024.</small>
            </div>
        </footer>
    );
};

export default Footer;