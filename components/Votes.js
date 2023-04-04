import React from "react";
import styled from "styled-components";

const Text = styled.Text`
    font-size: 12px;
    font-weight: normal;
    margin-top: 0px;
`;

const Votes = ({ vote_average }) => {
    return (
        <Text>{vote_average > 0 ? `★${vote_average}/10` : `Coming Soon`}</Text>
    );
};

export default Votes;
