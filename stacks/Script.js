import React from "react";
import styled from 'styled-components';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import Loader from "../components/Loader";

import axios from 'axios';
import * as cheerio from 'cheerio';
import { db_script } from "../database/db_script";

import Ionicons from '@expo/vector-icons/Ionicons';

const ScrollView = styled.ScrollView`
    padding: 0px 20px;
`;

const FlatList = styled.FlatList`
    padding: 0px 20px;
`;

const VirtualizedList = styled.VirtualizedList`
    padding: 0px 20px;
`;

const ScriptView = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
`;

const ScriptClick = styled.TouchableOpacity``;

const ScriptText = styled.Text`
    font-size: 16px;
    line-height: 32px;
`;

const Modal = styled.Modal``;

const CenteredView = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    padding: 150px 0px;
`

const ModalView = styled.View`
    width: 300px;
    height: 500px;
    background-color: lightgray;
    border-radius: 20px;
`;

const ModalScrollView = styled.ScrollView`
    width: 300px;
    padding: 0px 10px;
    flex-wrap: wrap;
`;

const SectionView = styled.View`
    width: 260px;
    margin: 10px;
    padding: 10px;
    background-color: white;
    border-radius: 20px;
`;

const SectionTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin-top: 10px;
`;

const SearchWordView = styled.View`
    width: 240px;
    margin: 10px;
`;

const SearchWordTitle = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #3eb489;
    margin: 2.5px 0px;
`;

const SearchWordMainText = styled.Text`
    font-size: 16px;
    margin: 2.5px 0px;
`;

const SearchWordSubText = styled.Text`
    font-size: 14px;
    margin: 2.5px 0px;
    color: grey;
`;

const SearchMeanView = styled.View``;

const SearchExampleView = styled.View``;

const FlexWrapView = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    margin: 2.5px 0px;
`;

const CloseButton = styled.TouchableOpacity`
    width: 290px;
    padding-top: 10px;
    flex-direction: row-reverse;
`;

export default function Script({ navigation: { setOptions }, route: { params } }) {
    const [ textState, setTextState ] = useState([]);
    const [ vocaState, setVocaState ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ isModal, setIsModal ] = useState(false);
    const { original_name, season_number, episode_number } = params;
    
    const getHTML = async () => {
        return await axios.get(`https://transcripts.foreverdreaming.org/viewtopic.php?t=${db_script[original_name][season_number][episode_number]}`);
    }

    const getText = async () => {
        const html = await getHTML();
        const $ = cheerio.load(html.data);
        const $textList = $(".content");

        let textArray = [];
        let splitIndex = 0;
        let splitText = [];
        let mergeText;
        
        $textList.each((idx, node) => {
            $(node.children).each((ids, childNode) => {
                if ($(childNode)[0].name !== "br") {
                    splitText = $(childNode).text().trim().split(/[\s\n]+|""/);
                    mergeText = splitText.map(item =>
                        <ScriptClick key={splitIndex++} onPress={() => getVoca(item)}>
                            <ScriptText>{item + " "}</ScriptText>
                        </ScriptClick>
                    );
                    textArray.push({
                        key: ids,
                        payload: mergeText
                    });
                }
            });
        });

        /* For FlatList */
        /* let text = "";
        let splitText = [];
        let lineCount = 0;
        
        $textList.each((idx, node) => {
            $(node.children).each((ids, childNode) => {
                if ($(childNode)[0].name === "br") {
                    while(lineCount < 9) {
                        splitText.push("");
                        lineCount++;
                    }
                } else {
                    text = $(childNode).text().trim();
                    splitText = text.split(/[\s\n]+|""/);
                    lineCount = splitText.length % 9;
                }
                splitText.map(item => {
                    textArray.push({
                        key: splitIndex++,
                        payload: item + " "
                    });
                });
                splitText=[];
            });
        }); */

        setTextState(textArray);
        setIsLoading(false);
    };

    const getDict = async (payload) => {
        return await axios.get(`https://dic.daum.net/search.do?q=${payload}&dic=eng&search_first=Y`);
    }
    
    const getVoca = async (payload) => {
        const trimmed = payload.replace(/[.,!?*"]/g, "")
        const dict = await getDict(trimmed);
        const $ = cheerio.load(dict.data);
        const $vocaList = $(".cleanword_type.kuek_type");   
            
        let vocaArray = [];
        let wordArray = [];
        let meanArray = [];
        let pronounceArray = [];
        
        $vocaList.each((ids, node) => {
            wordArray = $(node).find(".txt_emph1").text().trim().split(/[\s\n]+|""/);
            meanArray = $(node).find(".list_search").text().trim().split(/[\s\n]+|""/);
            pronounceArray = $(node).find(".wrap_listen").text().trim().split(/[\s\n]+|""/);
            vocaArray.push({
                key: ids,
                word: wordArray,
                mean: meanArray,
                pronounce: pronounceArray
            }); 
        });

        const $exampleList = $(".list_example.sound_example");
        let exampleArray = [];
        
        $exampleList.each((ids, node) => {
           exampleArray = $(node).text().trim().split(/[\n]+|""/);
        });

        console.log("trimmed:", trimmed);
        console.log("vocaArray:", vocaArray);
        console.log("exampleArray:", exampleArray);

        setVocaState(vocaArray);
        setIsModal(true);
    };
    
    useEffect(() => {
        getText();
    }, []);

    return (
        isLoading ? <Loader /> :
        <>
            <StatusBar style="auto" />
            <VirtualizedList 
                data={textState}
                getItem={(data, index) => data[index]}
                getItemCount={() => textState.length}
                renderItem={({item}) => <ScriptView>{item.payload}</ScriptView>}
                keyExtractor={item => item.key}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModal}
                onRequestClose={() => setIsModal(false)}
            >
                <CenteredView>
                    <ModalView>
                        <CloseButton
                            onPress={() => setIsModal(false)}
                        >
                            <Ionicons name="close-outline" size={24} color="black" />
                        </CloseButton>
                        <ModalScrollView>
                            <SectionView>
                                <SectionTitle>단어·숙어</SectionTitle>
                                <SearchWordView>
                                    <SearchWordTitle>{vocaState[0]?.word[0]}</SearchWordTitle>
                                    <FlexWrapView>
                                        {vocaState[0]?.mean.map((item, index) => <SearchWordMainText key={index}>{item + " "}</SearchWordMainText>)}
                                    </FlexWrapView>
                                    <SearchWordSubText>미국: {vocaState[0]?.pronounce[1]}</SearchWordSubText>
                                    <SearchWordSubText>영국: {vocaState[0]?.pronounce[4]}</SearchWordSubText>
                                </SearchWordView>
                            </SectionView>
                        </ModalScrollView>
                    </ModalView>
                </CenteredView>
            </Modal>
        </>
    );    
}

/* ScrollView: Easy But Too Slow
    <ScrollView>
        <StatusBar style="auto" />
        <TextView>
            {textState.map(node =>
                <TouchableOpacity key={node.key} onPress={() => getVoca(node.payload)}>
                    <Text>{node.payload}{" "}</Text>
                </TouchableOpacity>
            )}
        </TextView>
    </ScrollView>
*/

/* FlatView: Faster But Still Slow
    <FlatList 
        data={textState}
        renderItem={node =>
            <TouchableOpacity onPress={() => getVoca(node.item.payload)}>
                <Text>{node.item.payload}</Text>
            </TouchableOpacity>
        }
        key={item => item.key}
        numColumns={9}
    />
*/

/* Virtualized List: Fastest and I Love It
    <VirtualizedList 
        data={textState}
        getItem={(data, index) => data[index]}
        getItemCount={() => 10000}
        renderItem={({item}) =>
            <TouchableOpacity onPress={() => getVoca(item.payload)}>
                <Text>{item.payload}</Text>
            </TouchableOpacity>
        }
        keyExtractor={item => item.key}
    />
*/