import React, { useRef, useState } from 'react';
import { Text, View, Animated, PanResponder, TouchableWithoutFeedback, Easing, Dimensions, StyleSheet } from 'react-native';

const LEFT_SWIPE = 'Left';
const RIGHT_SWIPE = 'Right';
const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

const Deck = ({data, renderCard, renderEmptyList, onSwipeLeft, onSwipeRight}) => {
    const position = useRef(new Animated.Value(0)).current;
    const rotation = useRef(new Animated.Value(0)).current;
    const sideOpacity = useRef(new Animated.Value(1)).current;

    const side = 0;
    const [currIndex, setCurrIndex] = useState(0);

    const cardStyle = {
        opacity: sideOpacity,
        transform: [{
            translateX: position
        }]
    }

    const onSwipe = (direction) => {
        let x = 0;
        if (direction === LEFT_SWIPE) {
          x = -SCREEN_WIDTH*2;
        } else if (direction === RIGHT_SWIPE) {
          x = SCREEN_WIDTH*2;
        }
        Animated.parallel([
            Animated.timing(position, {
                toValue: x,
                duration: 250,
                useNativeDriver: true
            }),
            Animated.timing(sideOpacity, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true
            })
        ]).start(() => {
            position.setValue(0); 
            setCurrIndex(prevIndex => prevIndex +1);
            Animated.timing(sideOpacity, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true
            }).start();   
        });
      }

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gesture) => {
                position.setValue(gesture.dx)
            },
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx === 0 && gesture.dy === 0) {
                    console.log('touched')
                } else if (gesture.dx > 100) {
                    onSwipe(RIGHT_SWIPE)
                } else if (gesture.dx < -100) {
                    onSwipe(LEFT_SWIPE)
                } else {
                    Animated.timing(position, {
                        toValue: 0,
                        easing: Easing.bounce,
                        useNativeDriver: true
                    }).start()
                }
            }
        })
    ).current;

    return (
        data.length > currIndex ? 
            <Animated.View style={[styles.cardContainer, {...cardStyle}]} {...panResponder.panHandlers}>
                <Animated.View style={styles.cardContainer}>{renderCard(data[currIndex], "FRONT")}</Animated.View>
                <Animated.View style={styles.cardContainer}>{renderCard(data[currIndex], "BACK")}</Animated.View>
            </Animated.View> : <Text>No more cards</Text>
)};

const styles = StyleSheet.create({
    cardContainer: {
      position: "absolute",
      flex: 1,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    } 
  })

export default Deck;
