import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Alert,
    Keyboard,
    ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';

const CHAT_COLORS = {
    background: '#F5F2EB', // warm cream
    warmGrey: '#E5E1D8',   // received message bg (unused in new design)
    black: '#000000',
    white: '#FFFFFF',
    cream: '#F5F2EB',
    accent: '#ec5b13',     // orange — Align brand
    green: '#00FF00',      // system active dot
    border: '#000000',
};

const SPACING = {
    sm: 8,
    md: 16,
    lg: 20,
    xl: 32,
};

const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const TypingIndicator = ({ showLabel }) => {
    const dot1 = useRef(new Animated.Value(0.2)).current;
    const dot2 = useRef(new Animated.Value(0.2)).current;
    const dot3 = useRef(new Animated.Value(0.2)).current;

    useEffect(() => {
        const createPulse = (anim, delay) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 0.2,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.delay(300),
                ])
            );
        };

        Animated.parallel([
            createPulse(dot1, 0),
            createPulse(dot2, 150),
            createPulse(dot3, 300),
        ]).start();
    }, []);

    const dotStyle = (anim) => ({
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: CHAT_COLORS.black,
        opacity: anim,
    });

    return (
        <View style={styles.receivedContainer}>
            {showLabel && (
                <View style={styles.aiLabelRow}>
                    <View style={styles.aiDot} />
                    <Text style={styles.aiLabel}>ALIGN</Text>
                </View>
            )}
            <View style={styles.typingDotContainer}>
                <Animated.View style={dotStyle(dot1)} />
                <Animated.View style={dotStyle(dot2)} />
                <Animated.View style={dotStyle(dot3)} />
            </View>
        </View>
    );
};

const AlignChatScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const scrollRef = useRef(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const [messages, setMessages] = useState([
        {
            id: '1',
            type: 'received',
            text: "Hi! I'm Align's AI assistant. Ask me anything about your matches, compatibility, or profile.",
            time: getCurrentTime(),
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Voice state
    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            scrollRef.current?.scrollToEnd({ animated: true });
        }, 100);
        return () => clearTimeout(timer);
    }, [messages, isTyping]);

    // Keyboard listener for scrolling
    useEffect(() => {
        const show = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => {
                setTimeout(() =>
                    scrollRef.current?.scrollToEnd({ animated: true }), 100);
            }
        );
        return () => show.remove();
    }, []);

    // Pulse animation for recording (microphone button ring)
    useEffect(() => {
        if (isRecording) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.3,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isRecording]);

    const startRecording = async () => {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('PERMISSION REQUIRED', 'Microphone access is needed for voice input.');
                return;
            }
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording:', err);
        }
    };

    const stopRecording = async () => {
        if (!recording) return;
        setIsRecording(false);
        setIsProcessing(true);
        try {
            await recording.stopAndUnloadAsync();
            // TODO: connect voice to real speech-to-text API (Whisper/Google STT)
            setTimeout(() => {
                setInputText('Tell me about my top match today');
                setIsProcessing(false);
            }, 1000);
        } catch (err) {
            console.error('Failed to stop recording:', err);
            setIsProcessing(false);
        }
        setRecording(null);
    };

    const handleVoicePress = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleSend = () => {
        if (!inputText.trim()) return;

        const userMsg = {
            id: Date.now().toString(),
            type: 'sent',
            text: inputText.trim(),
            time: getCurrentTime(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const replies = [
                "Based on your profile, I'd recommend focusing on shared values first.",
                "Your compatibility score with top matches averages 89%. Strong signal.",
                "I've analysed your preferences. Want me to refine your match filters?",
                "Your profile is performing well. 3 new high-compatibility users today.",
            ];
            const reply = {
                id: (Date.now() + 1).toString(),
                type: 'received',
                text: replies[Math.floor(Math.random() * replies.length)],
                time: getCurrentTime(),
            };
            setMessages(prev => [...prev, reply]);
            setIsTyping(false);
        }, 1500);
    };

    const handleExit = () => {
        // @ts-ignore
        navigation.navigate('TabHome');
    };

    const isFirstInGroup = (index) => {
        if (index === 0) return true;
        return messages[index - 1].type !== messages[index].type;
    };

    const today = new Date();
    const dateString = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getFullYear()).slice(-2)}`;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: CHAT_COLORS.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={{ flex: 1, backgroundColor: CHAT_COLORS.background }}>
                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                    <View style={styles.headerLeft}>
                        <View style={styles.titleRow}>
                            <Text style={styles.title}>ALIGN</Text>
                            <View style={styles.statusDot} />
                        </View>
                        <Text style={styles.statusText}>SYSTEM ACTIVE / GRID 0.1</Text>
                    </View>
                    <Pressable
                        onPress={handleExit}
                        style={styles.exitButton}
                    >
                        <Feather name="x" size={24} color={CHAT_COLORS.black} />
                    </Pressable>
                </View>

                <ScrollView
                    ref={scrollRef}
                    style={styles.messageList}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Session Date Marker */}
                    <View style={styles.dateMarkerContainer}>
                        <View style={styles.dateLine} />
                        <Text style={styles.dateText}>SESSION START: {dateString}</Text>
                        <View style={styles.dateLine} />
                    </View>

                    {messages.map((msg, index) => {
                        const showLabel = isFirstInGroup(index);
                        const isConsecutive = index > 0 && messages[index - 1].type === msg.type;

                        return (
                            <View
                                key={msg.id}
                                style={[
                                    msg.type === 'sent' ? styles.sentContainer : styles.receivedContainer,
                                    isConsecutive && { marginBottom: 8 }
                                ]}
                            >
                                {msg.type === 'received' && showLabel && (
                                    <View style={styles.aiLabelRow}>
                                        <View style={styles.aiDot} />
                                        <Text style={styles.aiLabel}>ALIGN</Text>
                                    </View>
                                )}

                                {msg.type === 'received' ? (
                                    <View>
                                        <Text style={styles.receivedText}>{msg.text}</Text>
                                        <Text style={styles.timestamp}>{msg.time} · SYSTEM</Text>
                                    </View>
                                ) : (
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <View style={styles.sentBubble}>
                                            <Text style={styles.sentText}>{msg.text}</Text>
                                        </View>
                                        <Text style={styles.sentTimestamp}>{msg.time}</Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}

                    {isTyping && <TypingIndicator showLabel={messages[messages.length - 1].type !== 'received'} />}
                </ScrollView>

                {/* Input Bar */}
                <View style={[styles.inputBar, { paddingBottom: insets.bottom + 16 }]}>
                    <Pressable
                        onPress={handleVoicePress}
                        style={({ pressed }) => [
                            styles.voiceButton,
                            isRecording && styles.voiceButtonActive,
                        ]}
                    >
                        {isProcessing ? (
                            <ActivityIndicator size="small" color={CHAT_COLORS.black} />
                        ) : (
                            <Feather
                                name="mic"
                                size={20}
                                color={isRecording ? CHAT_COLORS.white : CHAT_COLORS.black}
                            />
                        )}
                        {isRecording && (
                            <Animated.View style={[
                                styles.pulseRing,
                                { transform: [{ scale: pulseAnim }] }
                            ]} />
                        )}
                    </Pressable>

                    <TextInput
                        style={styles.input}
                        placeholder="TYPE MESSAGE..."
                        placeholderTextColor="rgba(0,0,0,0.3)"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline={true}
                        textAlignVertical="center"
                        selectionColor={CHAT_COLORS.accent}
                    />

                    <Pressable
                        onPress={handleSend}
                        style={({ pressed }) => [
                            styles.sendButton,
                            pressed && styles.sendButtonPressed
                        ]}
                    >
                        <Feather name="arrow-up" size={20} color={CHAT_COLORS.white} />
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: CHAT_COLORS.background,
        borderBottomWidth: 2,
        borderBottomColor: CHAT_COLORS.black,
        paddingHorizontal: 24,
        paddingBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerLeft: {
        flexDirection: 'column',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        fontFamily: 'Inter_700Bold',
        letterSpacing: -1,
        textTransform: 'uppercase',
        color: CHAT_COLORS.black,
    },
    statusDot: {
        width: 12,
        height: 12,
        backgroundColor: CHAT_COLORS.green,
        borderWidth: 1,
        borderColor: CHAT_COLORS.black,
        marginLeft: 8,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 3,
        opacity: 0.6,
        textTransform: 'uppercase',
        marginTop: 6,
        color: CHAT_COLORS.black,
    },
    exitButton: {
        width: 48,
        height: 48,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: CHAT_COLORS.black,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0,
    },
    messageList: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 32,
        flexGrow: 1,
    },
    dateMarkerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
        marginTop: 8,
    },
    dateLine: {
        flex: 1,
        height: 1,
        backgroundColor: CHAT_COLORS.black,
        opacity: 0.1,
    },
    dateText: {
        fontSize: 10,
        fontFamily: 'Inter_600SemiBold',
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: CHAT_COLORS.black,
        opacity: 0.4,
    },
    receivedContainer: {
        alignSelf: 'flex-start',
        maxWidth: '90%',
        marginBottom: 28,
        paddingRight: 24,
    },
    aiLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    aiDot: {
        width: 8,
        height: 8,
        backgroundColor: '#00FF00',
        borderWidth: 1,
        borderColor: '#000000',
    },
    aiLabel: {
        fontFamily: 'Inter_700Bold',
        fontSize: 10,
        letterSpacing: 2,
        color: '#000000',
    },
    receivedText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        lineHeight: 26,
        color: '#000000',
    },
    timestamp: {
        fontFamily: 'Inter_400Regular',
        fontSize: 10,
        color: '#000000',
        opacity: 0.3,
        letterSpacing: 1.5,
        marginTop: 6,
    },
    sentContainer: {
        alignSelf: 'flex-end',
        maxWidth: '75%',
        marginBottom: 28,
        alignItems: 'flex-end',
    },
    sentBubble: {
        backgroundColor: '#000000',
        borderRadius: 18,
        borderBottomRightRadius: 4,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    sentText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 15,
        lineHeight: 22,
        color: '#F5F2EB',
    },
    sentTimestamp: {
        fontFamily: 'Inter_400Regular',
        fontSize: 10,
        color: '#000000',
        opacity: 0.35,
        letterSpacing: 1.5,
        marginTop: 4,
    },
    typingDotContainer: {
        flexDirection: 'row',
        gap: 6,
        paddingVertical: 8,
    },
    inputBar: {
        backgroundColor: CHAT_COLORS.background,
        borderTopWidth: 2,
        borderTopColor: CHAT_COLORS.black,
        paddingHorizontal: 24,
        paddingTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    voiceButton: {
        width: 48,
        height: 48,
        borderWidth: 2,
        borderColor: CHAT_COLORS.black,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    voiceButtonActive: {
        backgroundColor: CHAT_COLORS.black,
    },
    pulseRing: {
        position: 'absolute',
        width: 56,
        height: 56,
        borderWidth: 2,
        borderColor: CHAT_COLORS.accent,
        backgroundColor: 'transparent',
    },
    input: {
        flex: 1,
        backgroundColor: 'transparent',
        borderWidth: 0,
        borderBottomWidth: 2,
        borderBottomColor: CHAT_COLORS.black,
        padding: 16,
        fontSize: 14,
        fontFamily: 'Inter_600SemiBold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: CHAT_COLORS.black,
        minHeight: 48,
        maxHeight: 120,
        borderRadius: 0,
    },
    sendButton: {
        width: 48,
        height: 48,
        backgroundColor: CHAT_COLORS.black,
        borderWidth: 2,
        borderColor: CHAT_COLORS.black,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0,
    },
    sendButtonPressed: {
        backgroundColor: CHAT_COLORS.accent,
    },
});

export default AlignChatScreen;
