/**
 * @author Luís Mestre <https://github.com/LMestre14>
 */
import React, { Component } from 'react';
import { View, Image, Animated, Easing } from 'react-native';
import Styles, { width, height, EXTRA_WIDTH } from './styles';

export default class ImageWrapper extends Component {
    static defaultProps = {
        uri: null,
        index: 0,
        duration: 5000,
        focusedIndex: 0,
        fullWidth: false,
        direction: 'par',
        extraSpacing: EXTRA_WIDTH,
        layoutWidth: width,
    };

    constructor(props) {
        super(props);

        this.state = {
            maxWidth: -1,
            imgWidth: props.extraSpacing + props.layoutWidth,
            translateX: new Animated.Value(0),
        };
    }

    // wip
    componentWillMount() {
        const { uri } = this.props;
        if(isNaN(uri)) {
            Image.getSize(uri, (imgWidth, imgHeight) => {
                try {
                    let maxWidth = imgWidth * height / imgHeight;
                    this.setState({ maxWidth });
                } catch(err) {
    
                }
            });
        }
    }

    componentDidMount() {
        if(this.props.focusedIndex == this.props.index) {
            this.startAnimation();
        }
    }

    componentWillReceiveProps(nextProps) {
        this.state.translateX.stopAnimation(() => {
            if(nextProps.focusedIndex == nextProps.index) {
                this.startAnimation();
            }
        });
    }

    // true -> left to right
    // false -> right to left
    getDirection() {
        const { index, direction } = this.props;

        switch(direction) {
            case 'left': return true;
            case 'right': return false;
            case 'odd': return (index + 1) % 2;
            default: return index % 2;
        }
    }

    getExtraSpacing() {
        const { maxWidth } = this.state;
        const { extraSpacing, fullWidth, layoutWidth } = this.props;

        if(maxWidth == -1) return extraSpacing;

        let fullExtraSpacing = this.state.maxWidth - layoutWidth;

        if(fullWidth || extraSpacing > fullExtraSpacing) return fullExtraSpacing;

        return extraSpacing;
    }

    startAnimation() {
        const { duration } = this.props;

        let extraSpacing = Math.floor(this.getExtraSpacing());

        if(this.getDirection()) extraSpacing *= -1;

        Animated.timing(this.state.translateX, {
            toValue: -extraSpacing,
            easing: Easing.ease,
            useNativeDriver: true,
            duration: duration * 1.1,
        }).start(() => {
            this.setState({ translateX: new Animated.Value(0) });
        });
    }

    render() {
        const { uri, layoutWidth } = this.props;
        const { translateX } = this.state;

        const imgWidth = layoutWidth + this.getExtraSpacing();
        const direction = this.getDirection() ? 'flex-end' : 'flex-start';

        return (
            <View style={[Styles.itemContainer, { width: layoutWidth }]}>
                <Animated.Image
                    style={[Styles.image, { alignSelf: direction, width: imgWidth, transform: [{ translateX }] }]}
                    source={isNaN(uri) ? { uri } : uri}
                    resizeMethod='resize'
                />
            </View>
        );
    }
}