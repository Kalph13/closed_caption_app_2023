import React from "react";
import styled from 'styled-components';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from "react";
import { Dimensions } from "react-native";

/* React Query: https://tanstack.com/query/v3/docs/react/overview */
import { useQuery, useQueryClient, useInfiniteQuery } from "react-query";
import { tmdbAPI } from "../api";

import Loader from "../components/Loader";
import Slider from "../components/Slider";
import Slide from "../components/Slide";
import VMedia from "../components/VMedia";
import HMedia from "../components/HMedia";
import Carousel from "../components/Carousel";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const FlatList = styled.FlatList`
    margin-bottom: 25px;
`;

const Separator = styled.View`
    margin-bottom: 10px;
`;

const Title = styled.Text`
    font-size: 18px;
    font-weight: bold;
    margin-left: 25px;
    margin-right: 10px;
`;

const KeyExtractor = item => item.id + "";

const renderHeaderComponent = (airingTodayDataResults, topRatedDataResults) => (
    <>
        <Slider data={airingTodayDataResults} />
        <Carousel title="Top Rated" data={topRatedDataResults} />
        <Title>Airing Today</Title>
    </>
);

const renderFooterComponent = (airingTodayIsFetchingNextPage) => (
    airingTodayIsFetchingNextPage ? <Loader /> : null
);

const renderItem = ({ item }) => (
    <HMedia 
        key={item.id}
        poster_path={item.poster_path}
        original_title={item.original_title ?? item.original_name}
        release_date={item.release_date}
        overview={item.overview}
        data={item}
    />
);

export default function Home() {
    const queryClient = useQueryClient();
    const [ refreshing, setRefreshing ] = useState(false);

    const {
        isLoading: trendingLoading,
        data: trendingData
    } = useQuery(["TVs", "trending"], tmdbAPI.trending);

    const {
        isLoading: airingTodayLoading,
        data: airingTodayData,
        hasNextPage: airingTodayHasNextPage,
        fetchNextPage: airingTodayFetchNextPage,
        isFetchingNextPage: airingTodayIsFetchingNextPage
    } = useInfiniteQuery(["TVs", "airingToday"], tmdbAPI.airingToday, {
        getNextPageParam: (lastPage) => lastPage.page + 1 > lastPage.total_pages ? null : lastPage.page + 1
    });

    const {
        isLoading: topRatedLoading,
        data: topRatedData
    } = useQuery(["TVs", "topRated"], tmdbAPI.topRated);

    const loading = trendingLoading || airingTodayLoading || topRatedLoading;

    const onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries(["TVs"]);
        setRefreshing(false);
    };

    const loadMore = () => {
        airingTodayHasNextPage ? airingTodayFetchNextPage() : null;
    };

    return loading ? (
        <Loader />
    ) : (
        <FlatList
            refreshing={refreshing}
            onRefresh={onRefresh}
            onEndReached={loadMore}
            onEndReachedThreshold={2} /* Where to Execute loadMore() */
            keyExtractor={KeyExtractor}
            ItemSeparatorComponent={Separator}
            ListHeaderComponent={renderHeaderComponent(trendingData?.results, topRatedData?.results)}
            ListFooterComponent={renderFooterComponent(airingTodayIsFetchingNextPage)}
            data={airingTodayData?.pages.map(page => page.results).flat()}
            renderItem={renderItem}
        />
    )
}
