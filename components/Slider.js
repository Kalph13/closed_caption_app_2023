import React from "react";
import { Dimensions } from "react-native";

/* React Native Web Swiper: https://github.com/reactrondev/react-native-web-swiper */
/* Support Web, But Worse Usability for iOS */
// import Swiper from 'react-native-web-swiper';

/* React Native Swiper: https://github.com/leecade/react-native-swiper */
/* Doesn't Support Web, But Better Usability for iOS */
import Swiper from 'react-native-swiper';
import Slide from "./Slide";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Slider = ({ data }) => {
    return (
        <Swiper
            horizontal
            loop
            autoplay
            timeout={2.5}
            showsButtons={false}
            showsPagination={false}
            containerStyle={{ width: "100%", height: SCREEN_HEIGHT / 4, marginBottom: 25 }}
        >
            {data.map(title =>
                <Slide 
                    key={title.id}
                    backdrop_path={title.backdrop_path || ""}
                    poster_path={title.poster_path || ""}
                    original_title={title.original_title ?? title.original_name}
                    vote_average={title.vote_average}
                    overview={title.overview}
                    data={title}
                />
            )}    
        </Swiper>
    );
};

export default Slider;
