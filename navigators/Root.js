import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Tabs from "./Tabs";
import Stacks from "./Stacks";

const NativeStack = createNativeStackNavigator();

const Root = () => {
    return (
        <NativeStack.Navigator screenOptions={{
            headerShown: false
        }}>
            <NativeStack.Screen name="Tabs" component={Tabs} />
            <NativeStack.Screen name="Stacks" component={Stacks} />
        </NativeStack.Navigator>
    );
};

export default Root;
