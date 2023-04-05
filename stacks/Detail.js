import React, { useEffect } from "react";
import styled from 'styled-components';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, Platform, Share, StyleSheet } from "react-native";
import { useQuery } from "react-query";
import { Ionicons } from "@expo/vector-icons";

/* How to Use Gradient in React Native: https://docs.expo.dev/versions/latest/sdk/linear-gradient */
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";

import Loader from "../components/Loader";
import Poster from "../components/Poster";
import { createImgPath } from "../utils";
import { tmdbAPI } from "../api";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const ScrollView = styled.ScrollView``;
const Image = styled.Image``;

const Header = styled.View`
    height: ${SCREEN_HEIGHT / 4};
    justify-content: flex-end;
    padding: 0px 20px;
`;

const Column = styled.View`
    flex-direction: row;
    padding-bottom: 20px;
`;

const Title = styled.Text`
    font-size: 24px;
    font-weight: bold;
    align-self: flex-end;
    width: 60%;
    margin-left: 15px;
`;

const Data = styled.View`
    padding: 0px 20px;
`;

const Overview = styled.Text`
    margin: 20px 0px;
`;

const VideoButton = styled.TouchableOpacity`
    flex-direction: row;
`;

const ShareButton = styled.TouchableOpacity``;

const ButtonText = styled.Text`
    margin-left: 10px;
    margin-bottom: 10px;
    line-height: 24px;
`;

const Detail = ({ navigation: { setOptions }, route: { params } }) => {
    const isAndroid = Platform.OS === "android";
    const { isLoading, data } = useQuery(["TVs", params.id], tmdbAPI.detail);

    const shareMedia = async () => {
        await Share.share({
            url: isAndroid ? null : data.homepage,
            message: isAndroid ? data.homepage : null,
            title: isAndroid ? params.original_name : null
        });
    }

    const ShareButtonHeaderRight = () => (
        <ShareButton onPress={shareMedia}>
            <Ionicons name="share-outline" color={"black"} size={24} />
        </ShareButton>
    )

    useEffect(() => {
        setOptions({
            title: "TV Shows"
        })
    }, []);

    useEffect(() => {
        data ? setOptions({
            headerRight: () => <ShareButtonHeaderRight />
        }) : null
    }, [data]);

    const openVideo = async (videoID) => {
        const baseURL = `https://m.youtube.com/watch?v=${videoID}`;
        await WebBrowser.openBrowserAsync(baseURL);
    };

    return (
        <ScrollView>
            <Header>
                <Image
                    style={StyleSheet.absoluteFill} 
                    source={{ uri: createImgPath(params.backdrop_path) || "" }}
                />
                <Column>
                    <Poster poster_path={params.poster_path || null} />
                    <Title>{params.original_name}</Title>
                </Column>
            </Header>
            <Data>
                <Overview>{params.overview}</Overview>
                {isLoading ? <Loader /> : null}
                {data?.videos?.results?.map(video =>
                    <VideoButton key={video.key} onPress={() => openVideo(video.key)}>
                        <Ionicons name="logo-youtube" color="black" size={24} />
                        <ButtonText>{video.name}</ButtonText>
                    </VideoButton>
                )}
            </Data>
        </ScrollView>
    );
}

export default Detail;
