import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Detail from "../stacks/Detail";
import Script from "../stacks/Script";

/* Stack (Normal Performance, More Customizable): https://reactnavigation.org/docs/stack-navigator */
/* Native Stack (Better Performance, Less Customizable): https://reactnavigation.org/docs/native-stack-navigator/ */
const NativeStack = createNativeStackNavigator();

/* Navigation Props: https://reactnavigation.org/docs/navigation-prop */
const Stacks = () => {
    return (
        <NativeStack.Navigator>
            <NativeStack.Screen name="Detail" component={Detail} />
            <NativeStack.Screen name="Script" component={Script} />
        </NativeStack.Navigator>
    );
};

export default Stacks;
