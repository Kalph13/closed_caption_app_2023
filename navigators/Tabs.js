import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons";

import Home from '../tabs/Home';
import Search from '../tabs/Search';
import Heart from '../tabs/Heart';
import Bookmark from '../tabs/Bookmark';
import MyPage from '../tabs/MyPage';

/* Bottom Tabs: https://reactnavigation.org/docs/bottom-tab-navigator/*/
const BottomTab = createBottomTabNavigator();

export default function Tabs() {
    return (
        <BottomTab.Navigator
            initialRouteName="Home"
            screenOptions={{
                unmountOnBlur: true,
                tabBarHideOnKeyboard: true,
                tabBarActiveTintColor: "black",
                tabBarInactiveTintColor: "lightgrey",
                tabBarLabelStyle: {
                    marginTop: -5,
                    marginBottom: 5,
                    fontSize: 10
                },
            }}
        >
            <BottomTab.Screen name="Home" component={Home} options={{
                tabBarIcon: ({ color }) => <Ionicons name="home" size={18} color={color} />
            }} />
            <BottomTab.Screen name="Search" component={Search} options={{
                tabBarIcon: ({ color }) => <Ionicons name="search" size={18} color={color} />
            }} />
            <BottomTab.Screen name="Heart" component={Heart} options={{
                tabBarIcon: ({ color }) => <Ionicons name="heart" size={18} color={color} />
            }} />
            <BottomTab.Screen name="Bookmark" component={Bookmark} options={{
                tabBarIcon: ({ color }) => <Ionicons name="bookmark" size={18} color={color} />
            }} />
            <BottomTab.Screen name="MyPage" component={MyPage} options={{
                tabBarIcon: ({ color }) => <Ionicons name="man" size={18} color={color} />
            }} />
        </BottomTab.Navigator>
    )
};
