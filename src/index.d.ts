/**
 * @author Luís Mestre <https://github.com/LMestre14>
 */
import { Component } from 'react';
import { TextStyle, ViewStyle, Animated, ImageStyle } from 'react-native';

type Item = {
    /**
     * @param {string | number} uri
     * The image path for the slide
     */
    uri: string | number;

    /**
     * @param {number} duration
     * The duration in milliseconds of the animation
     */
    duration?: number;

    /**
     * @param {number} extraSpacing
     * The number of pixels the image will show in animation
     */
    extraSpacing?: number;

    /**
     * @param {boolean} fullWidth
     * If true, the animation will show the full image
     */
    fullWidth?: boolean;

    /**
     * @param {string} direction
     * The direction the image animation will go
     */
    direction?: 'even' | 'odd' | 'left' | 'right';
};

export interface SlideShowProperties {
    /**
     * @param {[Item]} items Array of objects representing an item.
     */
    items: [Item];

    /**
     * @param {boolean} loop
     * If true, items will be displayed in loop
     * Default: true
     */
    loop?: boolean;

    /**
     * @param {number} duration
     * The duration in milliseconds of the animation of all the slides
     * Default: 5000
     */
    duration?: number;

    /**
     * @param {number} index
     * The first slide to appear
     * Default: 0
     */
    index: number;

    /**
     * @param {number} extraSpacing
     * The number of pixels the image will show in animation
     * Default: 10% Screen Width
     */
    extraSpacing?: number;

    /**
     * @param {boolean} fullWidth
     * If true, the animation will show the full image
     * Default: false
     */
    fullWidth?: boolean;

    /**
     * @param {string} progressBarColor
     * String to change the progress bar color
     * Default: null
     */
    progressBarColor?: string;

    /**
     * @param {boolean} showProgressBar
     * Flag to show or hide the progress bar
     * Default: true
     */
    showProgressBar?: boolean;

    /**
     * @param {string} progressBarDirection
     * Progress bar animation direction
     * Default: 'middle'
     */
    progressBarDirection?: 'fromLeft' | 'fromRight' | 'middle';

    /**
     * @param {string} slideDirection
     * The direction the image animation will go
     * Default: 'even'
     */
    slideDirection?: 'even' | 'odd' | 'left' | 'right';

    /**
     * @param {ViewStyle} footerStyle
     * Stylesheet object for the footer main container
     * Default: null
     */
    footerStyle?: ViewStyle;

    /**
     * @param {TextStyle} titleStyle
     * Stylesheet object for the footer title
     * Default: null
     */
    titleStyle?: TextStyle;

    /**
     * @param {TextStyle} textStyle
     * Stylesheet object for the footer text
     * Default: null
     */
    textStyle?: TextStyle;

    /**
     * @param {function} renderItem
     * Function that renders each item
     */
    renderItem?: ({
        item: object,
        index: number,
        focusedIndex: number
    }) => JSX.Element;

    /**
     * @param {function} renderFooter
     * Function that renders the slideshow footer
     */
    renderFooter?: ({
        item: object,
        index: number,
        focusedIndex: number,
        defaultStyle: ViewStyle,
        animation: {
            titleTranslateY: Animated,
            textTranslateY: Animated,
            opacity: Animated
        }
    }) => JSX.Element;

    /**
     * @param {function} renderIcon
     * Function that renders the slideshow footers icon for next
     */
    renderIcon?: ({ snapToNext: Function }) => JSX.Element;

    /**
     * @param {function} renderCloseIcon
     * Function that renders the slideshow close icon
     */
    renderCloseIcon?: ({
        wrapperStyle: ViewStyle,
        imageStyle: ImageStyle,
        onPress: Function
    }) => JSX.Element;

    /**
     * @param {function} onClose
     * Callback when user clicks the close button
     */
    onClose?: (index) => JSX.Element;
}

export default class TimedSlideshow extends Component<SlideShowProperties> {}

export interface ImageWrapperProperties {
    /**
     * @param {string | number} uri
     * The image path for the slide
     */
    uri: string | number;

    /**
     * @param {number} index
     * The slide index
     */
    index: number;

    /**
     * @param {number} focusedIndex
     * The focused index on the Timed-Slideshow component. If you are using the component
     * out of the timed-slideshow you should map the current focused slide index
     */
    focusedIndex: number;

    /**
     * @param {number} duration
     * The duration in milliseconds of the animation
     */
    duration?: number;

    /**
     * @param {number} extraSpacing
     * The number of pixels the image will show in animation
     */
    extraSpacing?: number;

    /**
     * @param {boolean} fullWidth
     * If true, the animation will show the full image
     */
    fullWidth?: boolean;

    /**
     * @param {string} direction
     * The direction the image animation will go
     */
    direction?: 'even' | 'odd' | 'left' | 'right';

    /**
     * @param {number} layoutWidth
     * Default value is window with, and when used in Timed-Slideshow component, it uses
     * the containers width
     */
    layoutWidth?: number;
}

export class ImageWrapper extends Component<ImageWrapperProperties> {}
