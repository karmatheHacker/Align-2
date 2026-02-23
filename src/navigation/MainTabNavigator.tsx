import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import {
    HomeNavigator,
    LikesNavigator,
    ChatNavigator,
    ProfileNavigator,
} from './StackNavigators';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const NAV_COLORS = {
    background: '#F5F0E8',
    activeBackground: '#E8E1D5',
    border: '#0A0A0A',
    iconInactive: '#6B7280',
    iconActive: '#000000',
    separator: '#0A0A0A',
};

const TAB_BAR_HEIGHT = 64; // content height (no safe area)

// Tab configuration
const TABS = [
    {
        routeName: 'TabHome',
        label: 'HOME',
        iconActive: 'home' as const,
        iconInactive: 'home-outline' as const,
    },
    {
        routeName: 'TabLikes',
        label: 'MATCHES',
        iconActive: 'heart' as const,
        iconInactive: 'heart-outline' as const,
    },
    {
        routeName: 'TabChat',
        label: 'CHAT',
        iconActive: 'chatbubble' as const,
        iconInactive: 'chatbubble-outline' as const,
    },
    {
        routeName: 'TabProfile',
        label: 'PROFILE',
        iconActive: 'person' as const,
        iconInactive: 'person-outline' as const,
    },
];

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();
    const totalHeight = TAB_BAR_HEIGHT + insets.bottom;

    const currentRoute = state.routes[state.index];
    const focusedRouteName = getFocusedRouteNameFromRoute(currentRoute);

    // Hide tab bar only on the AlignChat screen (AI Chat)
    if (focusedRouteName === 'AlignChat') {
        return null;
    }

    return (
        <View style={[styles.container, { height: totalHeight, paddingBottom: insets.bottom }]}>
            {/* Top border */}
            <View style={styles.topBorder} />

            {/* Tab row */}
            <View style={styles.tabRow}>
                {TABS.map((tab, index) => {
                    const route = state.routes.find(r => r.name === tab.routeName);
                    if (!route) return null;

                    const isFocused = currentRoute.name === tab.routeName;
                    const isLast = index === TABS.length - 1;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <React.Fragment key={tab.routeName}>
                            <TouchableOpacity
                                style={[
                                    styles.tabItem,
                                    isFocused && styles.tabItemActive,
                                ]}
                                onPress={onPress}
                                activeOpacity={0.8}
                            >
                                <Ionicons
                                    name={isFocused ? tab.iconActive : tab.iconInactive}
                                    size={22}
                                    color={isFocused ? NAV_COLORS.iconActive : NAV_COLORS.iconInactive}
                                />
                                <Text
                                    style={[
                                        styles.tabLabel,
                                        isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                                    ]}
                                    numberOfLines={1}
                                    adjustsFontSizeToFit
                                    minimumFontScale={0.7}
                                >
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>

                            {/* Vertical separator (not after last tab) */}
                            {!isLast && <View style={styles.separator} />}
                        </React.Fragment>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: NAV_COLORS.background,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        // Shadow for elevation
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 8,
    },
    topBorder: {
        height: 2,
        backgroundColor: NAV_COLORS.border,
    },
    tabRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        backgroundColor: NAV_COLORS.background,
    },
    tabItemActive: {
        backgroundColor: NAV_COLORS.activeBackground,
    },
    separator: {
        width: 1,
        backgroundColor: NAV_COLORS.separator,
        alignSelf: 'stretch',
    },
    tabLabel: {
        fontSize: 9,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginTop: 3,
        fontFamily: 'BebasNeue_400Regular',
    },
    tabLabelActive: {
        color: NAV_COLORS.iconActive,
        fontWeight: '700',
    },
    tabLabelInactive: {
        color: NAV_COLORS.iconInactive,
        fontWeight: '400',
    },
});

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            id="main-tabs"
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen name="TabHome" component={HomeNavigator} />
            <Tab.Screen name="TabLikes" component={LikesNavigator} />
            <Tab.Screen name="TabChat" component={ChatNavigator} />
            <Tab.Screen name="TabProfile" component={ProfileNavigator} />
        </Tab.Navigator>
    );
}
