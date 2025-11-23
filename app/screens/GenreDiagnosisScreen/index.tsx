// app/screens/GenreDiagnosisScreen.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { fetchData } from '../../data/restaurantData';
import { StoreData } from '../../types';

type Params = { campus: string };

const GenreDiagnosisScreen = () => {
    //const router = useRouter();
    const { campus } = useLocalSearchParams<Params>();
    const [genres, setGenres] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const allData: StoreData[] = await fetchData();
            const campusData = allData.filter(item => {
                if (campus === '天白') return item.storeNo >= 1 && item.storeNo <= 41;
                if (campus === '八事') return item.storeNo >= 42 && item.storeNo <= 71;
                if (campus === 'ナゴヤドーム前') return item.storeNo >= 72 && item.storeNo <= 113;
                return false;
            });
            const uniqueGenres = [...new Set(campusData.map(item => item.genre))];
            setGenres(uniqueGenres);
            setLoading(false);
        };
        loadData();
    }, [campus]);

    const handleSelectGenre = (genre: string) => {
        router.push({
            pathname: '/screens/ResultScreen',
            params: { campus, diagnosisType: 'genre', selectedGenre: genre },
        });
    };

    if (loading) return <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1 }} />;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>好きなジャンルを選んでください</Text>
            {genres.map((genre) => (
                <TouchableOpacity key={genre} style={styles.button} onPress={() => handleSelectGenre(genre)}>
                    <Text style={styles.buttonText}>{genre}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, alignItems: 'center', backgroundColor: '#FFFBEB' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
    button: { backgroundColor: '#fff', padding: 12, borderRadius: 10, width: '90%', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#007AFF' },
    buttonText: { color: '#007AFF', fontSize: 16, fontWeight: '500' },
});

export default GenreDiagnosisScreen;
