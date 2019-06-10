/**
 * @author Luís Mestre <https://github.com/LMestre14>
 */
import React, { Component } from 'react';
import { Text, View, FlatList, Animated, Easing, Image, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import Styles, { width, height, EXTRA_WIDTH } from './styles';

export { default as ImageWrapper } from './imageWrapper';
import ImageWrapper from './imageWrapper';

export default class TimedSlideshow extends Component {

    static defaultProps = {
		items: [],
		duration: 5000,
        index: 0,
        extraSpacing: EXTRA_WIDTH,
        fullWidth: false,
        progressBarColor: null,
        showProgressBar: true,
        slideDirection: 'even',
        progressBarDirection: 'middle',
        footerStyle: null,
        titleStyle: null,
        textStyle: null,
        renderItem: null,
        renderFooter: null,
        renderIcon: null,
        loop: true,
        onClose: null,
    }
    
    constructor(props) {
        super(props);

        this.state = {
            index: props.index,
            layoutWidth: width,
            loaded: false,
            timer: new Animated.Value(0),
        };

        this.snapToNext = this.snapToNext.bind(this);
        this.onLayout = this.onLayout.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    componentDidMount() {
        // this.animation();
    }

    animation() {
        const { index } = this.state;
        let { duration, items } = this.props;

        if(!!items[index] && !isNaN(items[index].duration)) duration = items[index].duration;

        return Animated.timing(this.state.timer, {
            toValue: 1,
            easing: Easing.ease,
            useNativeDriver: true,
            duration,
        }).start(({ finished }) => finished && this.snapToNext());
    }

    snapToNext() {
        const { index, timer } = this.state;
        let { items, loop } = this.props;

        let newIndex = (index + 1) % items.length;

        timer.stopAnimation(() => {
            if (!loop && newIndex === 0) {
                // we reached the start again, stop the loop
            }
            else {
                this.slideShow.scrollToIndex({ animated: true, index: newIndex });
                this.setState({ timer: new Animated.Value(0), index: newIndex }, () => {
                    this.animation();
                });
            }
        });
    }

    onLayout({ nativeEvent: { layout: { x, y, width, height }}}) {
        try {
            this.setState({ layoutWidth: width, loaded: true }, () => {
                this.animation();
            });
        } catch(err) {
            this.setState({ loaded: true }, () => {
                this.animation();
            });
        }
    }

    renderItem({ item, index }) {
        let { duration, extraSpacing, fullWidth, slideDirection, renderItem } = this.props;
        const { index: focusedIndex, layoutWidth } = this.state;

        if(typeof renderItem == 'function') return renderItem({ item, index, focusedIndex });

        if(!isNaN(item.duration)) duration = item.duration;

        if(!isNaN(item.extraSpacing)) extraSpacing = item.extraSpacing;

        if(!!item.direction) slideDirection = item.direction;

        if(item.fullWidth != void 0) fullWidth = !!item.fullWidth;

        return (
            <ImageWrapper
                uri={item.uri}
                index={index}
                duration={duration}
                fullWidth={fullWidth}
                focusedIndex={focusedIndex}
                extraSpacing={extraSpacing}
                direction={slideDirection}
                layoutWidth={layoutWidth}
            />
        );
    }

    renderProgressBar() {
        const { showProgressBar, progressBarDirection, progressBarColor } = this.props;
        const { layoutWidth } = this.state;
        if(!showProgressBar) return null;

        let animation = { transform: [{scaleX: this.state.timer}] };

        if(progressBarDirection === 'fromLeft' || progressBarDirection === 'fromRight') {
            // Footer container as a width of 100% with paddingHorizontal of 7.5%
            let initialValue = layoutWidth * 0.85;

            if(progressBarDirection === 'fromLeft') initialValue *= -1;

            const translateX = this.state.timer.interpolate({
                inputRange: [0, 1],
                outputRange: [initialValue, 0],
                extrapolate: 'clamp',
            });

            animation.transform = [{ translateX }];
        }

        if (progressBarColor) animation.backgroundColor = progressBarColor;

        return (
            <View style={Styles.progressBarContainer}>
                <Animated.View style={[Styles.progressBar, animation]} />
            </View>
        );
    }

    renderIcon() {
        const { renderIcon } = this.props;

        if(typeof renderIcon == 'function') return renderIcon({ snapToNext: this.snapToNext });

        return (
            <TouchableWithoutFeedback onPress={this.snapToNext}>
                <Image source={require('./arrow.png')} style={Styles.arrowImg} />
            </TouchableWithoutFeedback>
        )
    }

    onClose() {
        const { onClose } = this.props;
        const { index } = this.state;
        if(typeof onClose == 'function') onClose(index);
    }

    renderCloseIcon() {
        const { renderCloseIcon } = this.props;
        if(typeof renderCloseIcon == 'function') return renderCloseIcon({ wrapperStyle: Styles.closeImgWrapper, imageStyle: Styles.closeImg, onPress: this.onClose });

        return (
            <TouchableWithoutFeedback onPress={this.onClose}>
                <View style={Styles.closeImgWrapper}>
                    <Image 
                        source={require('./close.png')} 
                        style={Styles.closeImg}
                    />
                </View>
            </TouchableWithoutFeedback>
        )
    }

    renderFooterContent() {
        const { items, renderFooter, loop, titleStyle = {}, textStyle = {} } = this.props;
        const { index, timer, focusedIndex } = this.state;

        const item = items[index];

        const titleTranslateY = timer.interpolate({
            inputRange: [0, .05],
            outputRange: [100, 0],
            extrapolate: 'clamp'
        });

        const textTranslateY = timer.interpolate({
            inputRange: [0, .06],
            outputRange: [100, 0],
            extrapolate: 'clamp'
        });

        let opacity = timer.interpolate({
            inputRange: [.9, .95],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        });

        const animation = { titleTranslateY, textTranslateY, opacity };

        if(typeof renderFooter == 'function') return renderFooter({ item, index, focusedIndex, defaultStyle: Styles.footerContentContainer, animation });

        if (!loop) opacity = null;
        return (
            <View style={Styles.footerContentContainer}>
                <View style={{ flex: 1 }}>
                    <View style={{ overflow: 'hidden' }}>
                        <Animated.Text numberOfLines={1} style={[Styles.footerTitle, titleStyle, { opacity, transform: [{ translateY: titleTranslateY }] }]}>
                            {item.title}
                        </Animated.Text>
                    </View>

                    <View style={{ overflow: 'hidden' }}>
                        <Animated.Text numberOfLines={2} style={[Styles.footerText, textStyle, { opacity, transform: [{ translateY: textTranslateY }] }]}>
                            {item.text}
                        </Animated.Text>
                    </View>
                </View>
                <View style={{ height: '100%', justifyContent: 'center' }}>
                    {this.renderIcon()}
                </View>
            </View>
        );
    }

    renderFooter() {
        const { footerStyle } = this.props;
        return (
            <View style={[Styles.footerContainer, footerStyle]}>
                {this.renderProgressBar()}
                {this.renderFooterContent()}
            </View>
        );
    }

    renderContent() {
        const { items, index } = this.props;
        const { layoutWidth, loaded } = this.state;

        if(!loaded) return (
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" animating color="red" />
            </View>
        );

        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    ref={ref => this.slideShow = ref}
                    style={{ flex: 1 }}
                    data={items}
                    extraData={this.state}
                    renderItem={this.renderItem}
                    initialScrollIndex={index}
                    horizontal
                    pagingEnabled
                    scrollEnabled={false}
                    getItemLayout={(item, index) => ({ index, length: layoutWidth, offset: layoutWidth * index })}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => `slide_item_${index}`}
                />
                {this.renderCloseIcon()}
                {this.renderFooter()}
            </View>
        );
    }

    render() {
        return (
            <View style={Styles.root} onLayout={this.onLayout}>
                {this.renderContent()}
            </View>
        );
    }
}