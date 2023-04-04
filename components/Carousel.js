import React from "react";
import styled from "styled-components";
import VMedia from "./VMedia";

const Text = styled.Text`
    font-size: 18px;
    font-weight: bold;
    margin-left: 25px;
    margin-bottom: 10px;
`;

const FlatList = styled.FlatList`
    margin-bottom: 25px;
`;

const Separator = styled.View`
    margin-right: 10px;
`;

const KeyExtractor = item => item.id + "";

const renderItem = ({ item }) => (
    <VMedia 
        poster_path={item.poster_path}
        original_title={item.original_title ?? item.original_name}
        vote_average={item.vote_average}
        data={item}
    />
);

const Carousel = ({ title, data }) => (
    <>
        <Text>{title}</Text>
        <FlatList 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 25 }}
            keyExtractor={KeyExtractor}
            ItemSeparatorComponent={Separator}
            data={data}
            renderItem={renderItem}
        />
    </>
);

export default Carousel;
