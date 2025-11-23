import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity, // タップ可能にするために必要
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StoreData } from '../../types';

const BookmarkScreen = () => {
    const router = useRouter();
    const [favorites, setFavorites] = useState<StoreData[]>([]);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const savedData = await AsyncStorage.getItem('favorite_restaurants');
            if (savedData) {
                setFavorites(JSON.parse(savedData));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const clearFavorites = () => {
        Alert.alert(
            "削除確認",
            "保存したお店をすべて削除しますか？",
            [
                { text: "キャンセル", style: "cancel" },
                {
                    text: "削除する",
                    style: "destructive",
                    onPress: async () => {
                        await AsyncStorage.removeItem('favorite_restaurants');
                        setFavorites([]);
                    }
                }
            ]
        );
    };

    // カード全体をTouchableOpacityにして、ResultScreenへ遷移させる
    const renderItem = ({ item }: { item: StoreData }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => {
                // 既存のResultScreenに「この店を表示して(targetStoreNo)」と指示を出して遷移
                router.push({
                    pathname: '/screens/ResultScreen',
                    params: { targetStoreNo: item.storeNo }
                });
            }}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.storeName}>{item.storeName}</Text>
                <Text style={styles.genre}>{item.genre}</Text>
            </View>
            <View style={styles.details}>
                <Text style={styles.detailText}>📍 {item.address}</Text>
                <Text style={styles.detailText}>💰 {item.budget}</Text>
                <Text style={styles.detailText}>⏰ {item.businessHours}</Text>
            </View>
            {/* 詳しく見る、という誘導テキストを追加 */}
            <Text style={styles.clickHint}>タップして詳細を見る ＞</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.headerContainer}>

                <Text style={styles.headerTitle}>　　　　　　　保存したお店</Text>
                <TouchableOpacity onPress={clearFavorites} style={styles.clearButton}>
                    <Text style={styles.clearText}>全削除</Text>
                </TouchableOpacity>
            </View>

            {favorites.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>まだ保存されたお店はありません。</Text>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.storeNo.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: '#FFFBEB' },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#fff',
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    backButton: { padding: 5 },
    backText: { fontSize: 16, color: '#007AFF' },
    clearButton: { padding: 5 },
    clearText: { fontSize: 14, color: '#ff3b30' },

    listContent: { padding: 15 },
    // ▼▼▼ タッチしたときにフィードバックがあるようカードスタイル調整 ▼▼▼
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 5
    },
    storeName: { fontSize: 18, fontWeight: 'bold', color: '#007AFF', flex: 1 },
    genre: { fontSize: 12, color: '#666', backgroundColor: '#f0f0f0', padding: 4, borderRadius: 4, overflow: 'hidden' },
    details: { gap: 5 },
    detailText: { fontSize: 14, color: '#444' },

    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: '#888', fontSize: 16 },

    clickHint: {
        marginTop: 10,
        textAlign: 'right',
        fontSize: 12,
        color: '#999'
    }
});

export default BookmarkScreen;