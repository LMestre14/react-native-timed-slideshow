/**
 * @author Luís Mestre <https://github.com/LMestre14>
 */
import { StyleSheet, Platform, Dimensions } from 'react-native';

export const { width, height } = Dimensions.get("window");

export const EXTRA_WIDTH = width * 0.1;
const BAR_HEIGHT = StyleSheet.hairlineWidth * 10;
const FOOTER_HEIGHT = height * 0.25;

export default StyleSheet.create({
    // Main Component Styles
    root: {
        flex: 1,
        backgroundColor: 'gray'
    },

    // Item Styles
    itemContainer: {
        flex: 1,
        width,
        overflow: 'hidden',
        backgroundColor: 'transparent',
    },

    image: {
        height: '100%',
        resizeMode: 'cover',
    },

    arrowImg: {
        width: width * 0.1,
        height: width * 0.1,
    },

    // Footer Styles
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: FOOTER_HEIGHT,
        paddingHorizontal: width * 0.075,
        paddingVertical: FOOTER_HEIGHT * 0.2,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.4)'
    },

    progressBarContainer: {
        width: '100%',
        height: BAR_HEIGHT,
        borderRadius: BAR_HEIGHT / 2,
        backgroundColor: 'rgba(255,255,255,0.4)',
        overflow: 'hidden',
    },

    progressBar: {
        height: '100%',
        width: '100%',
        borderRadius: BAR_HEIGHT / 2,
        backgroundColor: 'red',
    },

    footerContentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    footerTitle: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
    },

    footerText: {
        fontSize: 20,
        color: 'white',
    },

    closeImgWrapper: {
        position: 'absolute',
        right: 20,
        ...Platform.select({
            ios: {
                top: 45,
                shadowColor: '#000',
				shadowOpacity: 0.5,
				shadowRadius: 2,
				shadowOffset: {
					width: 0,
					height: 2,
				},
            },
            android: {
                top: 35,
                elevation: 4,
            },
        }),
    },

    closeImg: {
        width: 25,
        height: 25,
        tintColor: 'white',
        resizeMode: 'contain',
    },
});