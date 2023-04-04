import React from "react";
import styled from "styled-components";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Poster from "./Poster";
import Votes from "./Votes";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const Detail = styled.TouchableOpacity`
    padding: 0px 25px;
    flex-direction: row;
    width: ${SCREEN_WIDTH - 100}px;
`;

const Column = styled.View`
    margin-left: 15px;
`;

const Title = styled.Text`
    font-size: 16px;
    font-weight: bold;
`;

const Release = styled.Text`
    margin-top: 5px;
    font-size: 12px;
    font-weight: bold;
`;

const Overview = styled(Release)`
    font-weight: normal;
`;

const HMedia = ({ poster_path, original_title, release_date, overview, vote_average, data }) => {
    const navigation = useNavigation();

    const moveToDetail = () => {
        navigation.navigate("Stacks", {
            screen: "Detail",
            params: {
                ...data
            }
        });
    };

    return (
        <Detail onPress={moveToDetail}>
            <Poster poster_path={poster_path} />
            <Column>
                <Title>
                    {original_title.slice(0, 50)}
                    {original_title.length > 50 ? "..." : null}
                </Title>
                {release_date ? <Release>{new Date(release_date).toLocaleDateString("en")}</Release> : null }
                {vote_average ? <Votes averageVote={vote_average} /> : null}
                <Overview>
                    {overview.slice(0, 140)}
                    {overview.length > 140 ? "..." : null}
                </Overview>
            </Column>
        </Detail>
    );
};

export default HMedia;
