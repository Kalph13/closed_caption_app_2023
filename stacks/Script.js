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

const FlatList = styled.FlatList`
    padding: 0px 20px;
`;

const VirtualizedList = styled.VirtualizedList`
    padding: 0px 20px;
`;

const TextView = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
`;

const TouchableOpacity = styled.TouchableOpacity``;

const Text = styled.Text`
    font-size: 16px;
    line-height: 32px;
`;

const Modal = styled.Modal`

`;

const SafeAreaView = styled.View`
    flex: 1;
`;

const CenteredView = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
`

const ModalView = styled.View`
    width: 250px;
    height: 250px;
    margin: 20px;
    padding: 20px;
    background-color: white;
    border-radius: 20px;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
`

const CloseButton = styled.TouchableOpacity`
    border-radius: 20px;
    padding: 10px;
    background-color: black;
`

const CloseText = styled.Text`
    color: white;
`

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
                        <TouchableOpacity key={splitIndex++} onPress={() => getVoca(item)}>
                            <Text>{item + " "}</Text>
                        </TouchableOpacity>
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
    
        $vocaList.each((ids, node) => {
            vocaArray.push({
                key: ids,
                mean: $(node).find(".txt_search").text().trim(),
                pronounce: $(node).find(".txt_pronounce").text().trim()
            }); 
        });
    
        console.log("trimmed: ", trimmed);
        console.log("vocaArray: ", vocaArray);

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
                renderItem={({item}) => <TextView>{item.payload}</TextView>}
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
                        <Text>{vocaState[0]?.mean}</Text>
                        <Text>{vocaState[0]?.pronounce}</Text>
                        <CloseButton
                            onPress={() => setIsModal(false)}
                        >
                            <CloseText>Close Modal</CloseText>
                        </CloseButton>
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