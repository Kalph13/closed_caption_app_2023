import React from "react";
import styled from "styled-components";
import { useNavigation } from "@react-navigation/native";

import Poster from "./Poster";
import Votes from "./Votes";

const Detail = styled.TouchableOpacity``;

const Title = styled.Text`
    font-size: 16px;
    font-weight: bold;
`;

const VMedia = ({ poster_path, original_title, vote_average, data }) => {
    const navigation = useNavigation();

    const moveToDetail = () => {
        navigation.navigate("Stacks", {
            screen: "Detail",
            params: {
                ...data
            }
        });
    }

    return (
        <Detail onPress={moveToDetail}>
            <Poster poster_path={poster_path} />
            <Title>
                {original_title.slice(0, 10)}
                {original_title.length > 10 ? "..." : null}
            </Title>
            <Votes vote_average={vote_average} />
        </Detail>
    );
};

export default VMedia;
