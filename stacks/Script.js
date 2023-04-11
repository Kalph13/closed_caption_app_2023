import React from "react";
import styled from 'styled-components';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import Loader from "../components/Loader";

import axios from 'axios';
import * as cheerio from 'cheerio';
import { db_script } from "../database/db_script";

const ScrollView = styled.ScrollView`
    padding: 0px 20px;
`;

const View = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
`;

const TouchableOpacity = styled.TouchableOpacity``;

const Text = styled.Text`
    font-size: 16px;
    line-height: 32px;
`;

export default function Script({ navigation: { setOptions }, route: { params } }) {
    const [ textState, setTextState ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);    
    const { original_name, season_number, episode_number } = params;
    
    const getHTML = async () => {
        return await axios.get(`https://transcripts.foreverdreaming.org/viewtopic.php?t=${db_script[original_name][season_number][episode_number]}`);
    }

    const getText = async () => {
        const html = await getHTML();
        const $ = cheerio.load(html.data);
        const $textList = $(".content");

        let textArray = [];
        let spiltIndex = 0;
        
        $textList.each((idx, node) => {
            $(node.children).each((ids, childNode) => {
                const text = $(childNode).text();
                const spiltText = text.split(/[ \n]+/);
                spiltText.map(item => {
                    textArray.push({
                        key: spiltIndex++,
                        payload: item
                    });
                })
            });
        });

        setTextState(textArray);
        setIsLoading(false);
    };

    const getDict = async (payload) => {
        return await axios.get(`https://dic.daum.net/search.do?q=${payload}&dic=eng&search_first=Y`);
    }
    
    const getVoca = async (payload) => {
        const dict = await getDict(payload);
        const $ = cheerio.load(dict.data);
        const $vocaList = $(".cleanword_type.kuek_type");

        console.log("payload: ", payload);
        
        let vocaArray = [];
    
        $vocaList.each((ids, node) => {
            vocaArray.push({
                key: ids,
                mean: $(node).find(".list_search").text().trim(),
                pronounce: $(node).find(".txt_pronounce").text().trim()
            }); 
        });
    
        console.log("vocaArray: ", vocaArray);
    };
    
    useEffect(() => {
        getText();
    }, []);

    return (
        isLoading ? <Loader /> :
        <ScrollView>
            <StatusBar style="auto" />
            <View>
                {textState.map(node =>
                    <TouchableOpacity key={node.key} onPress={() => getVoca(node.payload)}>
                        <Text>{node.payload}{" "}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );    
}
