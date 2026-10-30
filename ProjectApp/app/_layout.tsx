import { Stack, useRouter, useSegments } from 'expo-router';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, ActivityIndicator } from 'react-native';

import { AuthProvider, useAuth } from '@/app/src/context/AuthContext';
import { useEffect } from 'react';

function NavigationGuard() {
    const { token, isLoadingSession } = useAuth();

    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoadingSession) return;

        // DETECTAMOS SI ESTOY EN PÁGINAS PROTEGIDAS
        const inProtectedScreen = segments[0] === "(protected)";

        if (token) {
            console.log("Usuario logueado");

            if (!inProtectedScreen) {
                console.log("Entro al protected");
                router.replace('/(protected)/dashboard');
            }
        } else {
            if (inProtectedScreen) {
                console.log("Usuario no logueado");
                router.replace('/(public)');
            }
        }
    }, [token, isLoadingSession, segments, router]);

    if (isLoadingSession) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
                <ActivityIndicator size="large" color="#005C3A" />
            </View>
        );
    }

    return (
        <Stack initialRouteName={token ? "(protected)" : "(public)"} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(public)" />
            <Stack.Screen name="(protected)" />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthProvider>
                <NavigationGuard />
            </AuthProvider>
        </GestureHandlerRootView>
    );
}
