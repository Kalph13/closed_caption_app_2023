import React from "react";
import styled from "styled-components";
import { useNavigation } from "@react-navigation/native";
import Poster from "./Poster";
import { createImgPath } from "../utils";
import { BlurView } from "expo-blur";

const Container = styled.TouchableOpacity`
    flex: 1;
`;

const Image = styled.Image`
    width: 100%;
    height: 100%;
    position: absolute;
`;

const Wrapper = styled.View`
    flex-direction: row;
    height: 100%;
    justify-content: center;
    align-items: center;
`;

const Column = styled.View`
    width: 45%;
    margin-left: 20px;
`;

const Title = styled.Text`
    font-size: 16px;
    font-weight: bold;
`;

const Votes = styled.Text`
    font-size: 12px;
    margin-top: 5px;
`;

const Overview = styled(Votes)``;

const Slide = ({ backdrop_path, poster_path, original_title, vote_average, overview, data }) => {
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
        <Container onPress={moveToDetail}>
            <Image source={{ uri: createImgPath(poster_path) }} />
            <BlurView 
                intensity={100}
                tint="light"
                style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute"
                }}
            >
                <Wrapper>
                    <Poster poster_path={poster_path} />
                    <Column>
                        <Title>{original_title}</Title>
                        {vote_average ? <Votes>★{vote_average}/10</Votes> : null}
                        <Overview>
                            {overview.slice(0, 80)}
                            {overview.length > 80 ? "..." : null}
                        </Overview>
                    </Column>
                </Wrapper>
            </BlurView>
        </Container>
    );
};

export default Slide;
