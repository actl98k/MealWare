import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StoreData } from '../../types';

// ★ チェックボックスなどのUIコンポーネントをインポート
// 例: import { CheckBox } from 'react-native-elements'; 
// もしくは自作のコンポーネントを使用、ここでは簡易テキストで表現

const BookmarkScreen = () => {
    const router = useRouter();
    const [favorites, setFavorites] = useState<StoreData[]>([]);
    
    // ▼▼▼ 選んで削除機能のために追加 ▼▼▼
    const [isEditing, setIsEditing] = useState(false); // 編集モードかどうか
    const [selectedItems, setSelectedItems] = useState<number[]>([]); // 選択されたstoreNoの配列
    // ▲▲▲ 選んで削除機能のために追加 ▲▲▲

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

    // ▼▼▼ 選んで削除機能のために追加 ▼▼▼
    // 編集モードの切り替え
    const toggleEditMode = () => {
        if (isEditing) {
            // 編集モードを抜けるときは選択をリセット
            setSelectedItems([]);
        }
        setIsEditing(!isEditing);
    };

    // アイテム選択時の処理
    const toggleSelectItem = (storeNo: number) => {
        if (selectedItems.includes(storeNo)) {
            setSelectedItems(selectedItems.filter(id => id !== storeNo));
        } else {
            setSelectedItems([...selectedItems, storeNo]);
        }
    };

    // 選択した項目を削除する処理
    const deleteSelectedItems = () => {
        Alert.alert(
            "選択したお店を削除",
            `${selectedItems.length}件のお店を削除しますか？`,
            [
                { text: "キャンセル", style: "cancel" },
                {
                    text: "削除する",
                    style: "destructive",
                    onPress: async () => {
                        const newFavorites = favorites.filter(item => !selectedItems.includes(item.storeNo));
                        await AsyncStorage.setItem('favorite_restaurants', JSON.stringify(newFavorites));
                        setFavorites(newFavorites);
                        // 編集モードを終了
                        setIsEditing(false);
                        setSelectedItems([]);
                    }
                }
            ]
        );
    };
    // ▲▲▲ 選んで削除機能のために追加 ▲▲▲

    const clearFavorites = () => {
        Alert.alert(
            "すべてのお店を削除",
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

    const renderItem = ({ item }: { item: StoreData }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => {
                if (isEditing) {
                    // 編集モード中は選択処理
                    toggleSelectItem(item.storeNo);
                } else {
                    // 通常時は詳細画面へ遷移
                    router.push({
                        pathname: '/screens/ResultScreen',
                        params: { targetStoreNo: item.storeNo }
                    });
                }
            }}
        >
            {/* ▼ 編集モード中にチェックマークを表示する例 ▼ */}
            {isEditing && (
                <View style={styles.checkbox}>
                    <Text>{selectedItems.includes(item.storeNo) ? '✅' : '⬜️'}</Text>
                </View>
            )}
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.storeName}>{item.storeName}</Text>
                    <Text style={styles.genre}>{item.genre}</Text>
                </View>
                <View style={styles.details}>
                    <Text style={styles.detailText}>📍 {item.address}</Text>
                    <Text style={styles.detailText}>💰 {item.budget}</Text>
                    <Text style={styles.detailText}>⏰ {item.businessHours}</Text>
                </View>
                {!isEditing && <Text style={styles.clickHint}>タップして詳細を見る ＞</Text>}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.headerContainer}>
                {/* ▼▼▼ ボタンの配置と表示切り替え ▼▼▼ */}
                <TouchableOpacity onPress={isEditing ? deleteSelectedItems : toggleEditMode} style={styles.headerButton}>
                    <Text style={[styles.buttonText, isEditing && selectedItems.length === 0 && { color: '#ccc' }]}>
                        {isEditing ? `削除(${selectedItems.length})` : '選んで削除'}
                    </Text>
                </TouchableOpacity>
                
                <Text style={styles.headerTitle}>保存したお店</Text>
                
                <TouchableOpacity onPress={isEditing ? toggleEditMode : clearFavorites} style={styles.headerButton}>
                    <Text style={[styles.buttonText, { color: '#ff3b30' }]}>
                        {isEditing ? 'キャンセル' : '全削除'}
                    </Text>
                </TouchableOpacity>
                {/* ▲▲▲ ボタンの配置と表示切り替え ▲▲▲ */}
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
                    extraData={selectedItems} // 選択状態が変わったときにリストを再描画
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
        paddingHorizontal: 15, // 左右のpaddingを調整
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#fff',
    },
    
    headerTitle: {
        flex: 1, // この行が重要
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    // ▼ 左右のボタンのスタイルを共通化
    headerButton: {
        padding: 5,
        minWidth: 80, // ボタンの最小幅を確保
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 14,
        color: '#007AFF', // デフォルトの色を青に
    },
    
    listContent: { padding: 15 },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: 'row', // チェックボックスとコンテンツを横並びにする
        alignItems: 'center',
    },
    // ▼ 編集モード用のスタイル
    checkbox: {
        marginRight: 15,
    },
    cardContent: {
        flex: 1,
    },
    // ▲
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