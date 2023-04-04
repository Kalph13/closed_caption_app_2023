import React from "react";
import styled from 'styled-components';
import { StatusBar } from 'expo-status-bar';

const Container = styled.View`
    flex: 1;
    background-color: #fff;
    align-items: center;
    justify-content: center;
`;

const Contents = styled.Text``;

export default function Detail() {
    return (
        <Container>
            <Contents>Detail</Contents>
        </Container>
    );
}
