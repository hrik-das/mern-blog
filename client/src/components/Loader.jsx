import React from "react";

import LoadingGif from "../assets/loading.gif";

const Loader = () => {
    return (
        <div className="loader">
            <div className="loader-image">
                <img src={LoadingGif} alt="loader" />
            </div>
        </div>
    );
};

export default Loader;