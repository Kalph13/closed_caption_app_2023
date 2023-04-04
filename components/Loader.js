import React from "react";
import styled from "styled-components";
import { ActivityIndicator } from "react-native";

const View = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const Loader = () => {
    return (
        <View>
            <ActivityIndicator color="black" size="large" />
        </View>
    );
};

export default Loader;
