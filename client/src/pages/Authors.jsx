import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Loader from "../components/Loader";

const Authors = () => {
    const [authors, setAuthors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const authors = async () => {
            setIsLoading(true);
            
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`);
                setAuthors(response.data);
            } catch (error) {
                console.log(error.message);
            }

            setIsLoading(false);
        };

        authors();
    }, []);

    if (isLoading) return <Loader />;

    return (
        <section className="authors">
            { authors.length > 0 ? <div className="container authors-container">
                {
                    authors.map(({ _id: id, avatar, name, posts }) => {
                        return <Link to={`/posts/users/${id}`} key={id} className="author">
                            <div className="author-avatar">
                                <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/users/${avatar}`} alt={`Image of ${name}`} />
                            </div>

                            <div className="author-info">
                                <h4>{name}</h4>
                                <p>{posts}</p>
                            </div>
                        </Link>
                    })
                }
            </div> : <h2 className="center">No Authors Found!</h2> }
        </section>
    );
};

export default Authors;