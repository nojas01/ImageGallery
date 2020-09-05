import {
    Image,
    useWindowDimensions,
    StyleSheet,
    View,
} from 'react-native';
import * as React from 'react';

interface Props {
    url: string;
}

function GalleryThumb({url}: Props): React.ReactElement {
    const {width, height} = useWindowDimensions();
    return (
        <View style={[styles.thumb, {width: width < height ? width / 2 : width / 4, aspectRatio: 1}]}>
            <Image source={{uri: url}} resizeMode={'contain'} style={{width: '100%', height: '100%'}}/>
        </View>
    );
}

export default GalleryThumb;
const styles = StyleSheet.create({
    thumb: {
        padding:         5,
        backgroundColor: 'transparent',
    },
});
