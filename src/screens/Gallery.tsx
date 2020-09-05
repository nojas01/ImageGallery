import * as React from 'react';
import {
    useEffect,
    useState,
} from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Image,
    useWindowDimensions,
    TouchableOpacity,
    Modal,
    Text,
    Dimensions,
} from 'react-native';
import {
    ApiRequest,
    makeApiRequest,
} from '../config/api';
import GalleryThumb from '../components/GalleryThumb';
import LinearGradient from 'react-native-linear-gradient';


interface ListItem {
    thumb: string;
    large: string;
    id: string;
}

function Gallery(): React.ReactElement {
    const [galleryList, setGalleryList]     = useState<Array<ListItem>>([]);
    const [numberOfColumns, setNumberOfColumns] = useState<number>(2);
    const [modalVisible, setModalVisible]   = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState('');
    const [page, setPage]                   = useState(1);

    useEffect(() => {
        const request: ApiRequest = {
            url:    `/photos?page=${page}`,
            config: {
                method: 'get',
            },
        };
        (async function () {
            const result                  = await makeApiRequest<[{ [key: string]: any }]>(request);
            const images: Array<ListItem> = result.map(
                (image) => ({id: image.id, thumb: image.urls.thumb, large: image.urls.regular}));
            setGalleryList([...galleryList, ...images]);
        })();
    }, [page]);

    useEffect(() => {
        Dimensions.addEventListener("change", onDimensionChange);
        return () => {
            Dimensions.removeEventListener("change", onDimensionChange);
        };
    });

    const onDimensionChange = ({ window }) => {
        setNumberOfColumns(window.width < window.height? 2: 4);
    };



    function renderItem({item}: { item: ListItem }) {
        const openModal = () => {
            setModalImageUrl(item.large);
            setModalVisible(true);
        };
        return (
            <TouchableOpacity
                onPress={openModal}
            >
                <GalleryThumb
                    url={item.thumb}
                />
            </TouchableOpacity>
        );
    }

    const toggleModal = () => {
        setModalVisible(false);
        setModalImageUrl('');
    };

    function isPortrait():boolean {
        return useWindowDimensions().width < useWindowDimensions().height
    }

    return (
        <View style={styles.container}>
            <FlatList
                key={numberOfColumns}
                style={{flex: 1, backgroundColor: '#1a4f95'}}
                data={galleryList}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                numColumns={numberOfColumns}
                onEndReached={() => setPage(page + 1)}
            />
            <Modal
                visible={(modalVisible && !!modalImageUrl)}
                supportedOrientations={['portrait', 'landscape']}
            >
                <LinearGradient
                    colors={['#000000', '#00000080']}
                    start={{x: 0.0, y: 0.0}}
                    end={{x: 0.0, y: 0.1}}
                >
                    <TouchableOpacity
                        onPress={toggleModal}
                    >
                        <View
                            style={[styles.modalCloseButton, {right: isPortrait()? 10: 30}]}
                        >
                            <Text style={styles.modalCloseText}>Close</Text>
                        </View>
                        <Image
                            style={styles.modalImage}
                            source={{uri: modalImageUrl}}
                            resizeMode={'contain'}
                        />
                    </TouchableOpacity>
                </LinearGradient>
            </Modal>
        </View>
    );
}

export default Gallery;

const styles = StyleSheet.create({
    container:        {
        flex: 1,
    },
    modal:            {},
    modalImage:       {
        width:  '100%',
        height: '100%',
    },
    modalCloseButton: {
        position:    'absolute',
        top:         '5%',
        width: '10%',
        right:       10,
        height:      '5%',
        aspectRatio: 1,
    },
    modalCloseText:   {
        color: 'white',
    },
});
