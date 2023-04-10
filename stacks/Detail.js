import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, Platform, Share, StyleSheet } from "react-native";
import { useQuery } from "react-query";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

/* How to Use Gradient in React Native: https://docs.expo.dev/versions/latest/sdk/linear-gradient */
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";

import Loader from "../components/Loader";
import Poster from "../components/Poster";
import { createImgPath } from "../utils";
import { tmdbAPI, BASE_URL, API_KEY } from "../api";

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
    font-size: 32px;
    font-weight: bold;
    align-self: flex-end;
    width: 60%;
    margin-left: 15px;
`;

const Data = styled.View`
    padding: 0px 20px;
`;

const Overview = styled.Text`
    font-size: 16px;
    margin: 20px 0px;
    line-height: 24px;
`;

const VideoButton = styled.TouchableOpacity`
    flex-direction: row;
`;

const ShareButton = styled.TouchableOpacity``;

const ButtonText = styled.Text`
    font-size: 16px;
    line-height: 24px;
    margin-left: 10px;
    margin-bottom: 10px;
`;

const Separator = styled.View`
    background-color: black;
    height: 2px;
    margin-bottom: 10px;
`;

const SeasonView = styled.View``;

const SeasonText = styled.Text`
    font-size: 28px;
    font-weight: bold;
    margin: 10px 0px;
`;

const EpisodeButton = styled.TouchableOpacity``;

const EpisodeText = styled.Text`
    font-size: 16px;
    line-height: 32px;
`;

const Detail = ({ navigation: { setOptions }, route: { params } }) => {
    const isAndroid = Platform.OS === "android";
    const navigation = useNavigation();

    const { isLoading, data } = useQuery(["TVs", params.id], tmdbAPI.detail);
    const [ seasonsData, setSeasonsData ] = useState([]);

    const getSeasonsData = async () => {
        var fetchedData = [];
        /* for (var num = 1; num <= data.seasons.length; num++ ) {
            fetchedData = [...fetchedData, await fetch(`${BASE_URL}/tv/${params.id}/season/${num}?api_key=${API_KEY}`).then(res => res.json())];
        } */
        for (const season of data.seasons) {
            fetchedData = [...fetchedData, await fetch(`${BASE_URL}/tv/${params.id}/season/${season.season_number}?api_key=${API_KEY}`).then(res => res.json())];
        }
        setSeasonsData(fetchedData);
    };

    const moveToScript = ( original_name, season_number, episode_number ) => {
        navigation.navigate("Stacks", {
            screen: "Script",
            params: {
                original_name,
                season_number,
                episode_number
            }
        });
    };

    const shareMedia = async () => {
        await Share.share({
            url: isAndroid ? null : data.homepage,
            message: isAndroid ? data.homepage : null,
            title: isAndroid ? params.original_name : null
        });
    };

    const ShareButtonHeaderRight = () => (
        <ShareButton onPress={shareMedia}>
            <Ionicons name="share-outline" color={"black"} size={24} />
        </ShareButton>
    );

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

    
    useEffect(() => {
        data ? getSeasonsData() : null
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
                {seasonsData?.map(season => 
                    <SeasonView key={season.id}>
                        <SeasonText>{season.name}</SeasonText>
                        <Separator />
                        {season.episodes.map(episode => 
                            <EpisodeButton key={episode.id} onPress={() => moveToScript(params.original_name, season.season_number, episode.episode_number)}>
                                <EpisodeText>{episode.name}</EpisodeText>
                            </EpisodeButton>
                        )}
                    </SeasonView>
                )}
            </Data>
        </ScrollView>
    );
}

export default Detail;
