import React from "react";
import styled from "styled-components";
import { createImgPath } from "../utils";

const Image = styled.Image`
    width: 100px;
    height: 140px;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.5);
`;

const Poster = ({ poster_path }) => {
    return (
        <Image source={{ uri: createImgPath(poster_path) }} />
    );
};

export default Poster;
