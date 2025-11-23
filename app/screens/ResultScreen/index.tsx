import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Linking, //googlemap urlに必要
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchData } from '../../data/restaurantData';
import { StoreData } from '../../types';

type AnswerData = {
    mood: '気軽に' | '奮発';
    uniqueness: 'はい' | 'うーん';
    calmness: 'はい' | 'うーん';
    photogenic: 'はい' | 'うーん';
};

// ▼▼▼targetStoreNo（お店の指名No）を受け取れるようにする ▼▼▼
type Params = {
    campus?: string;
    diagnosisType?: 'genre' | 'mbti' | 'compatibility';
    selectedGenre?: string;
    selectedMbti?: string;
    answers?: string;
    targetStoreNo?: string; // これを追加
};

type InfoRowProps = {
    label: string;
    value: string | null | undefined;
    onPress?: () => void;//urlをリンク化するためのonPress
};

const InfoRow: React.FC<InfoRowProps> = ({ label, value, onPress }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        {onPress ? (
            <TouchableOpacity onPress={onPress} style={styles.infoValueContainer}>
                <Text style={[styles.infoValue, styles.linkText]}>
                    {value || '情報なし'}
                </Text>
            </TouchableOpacity>
        ) : (<Text style={styles.infoValue}>{value || '情報なし'}</Text>)}
    </View>
);

const ResultScreen = () => {
    const params = useLocalSearchParams<Params>();
    const router = useRouter();
    // targetStoreNo を受け取る
    const { campus, diagnosisType, selectedGenre, selectedMbti, answers: answersString, targetStoreNo } = params;
    const [restaurant, setRestaurant] = useState<StoreData | null>(null);
    const [loading, setLoading] = useState(true);

    const saveToFavorites = async () => {
        if (!restaurant) return;
        try {
            const savedData = await AsyncStorage.getItem('favorite_restaurants');
            let currentList: StoreData[] = savedData ? JSON.parse(savedData) : [];

            const isAlreadySaved = currentList.some(item => item.storeNo === restaurant.storeNo);
            if (isAlreadySaved) {
                Alert.alert("確認", "このお店は既に保存されています！");
                return;
            }

            currentList.push(restaurant);
            await AsyncStorage.setItem('favorite_restaurants', JSON.stringify(currentList));

            Alert.alert("成功", "お店をブックマークしました！");
        } catch (error) {
            console.error(error);
            Alert.alert("エラー", "保存に失敗しました");
        }
    };

    //Googlemapで場所を開くための関数
    const getGoogleMapsUrl = () => {
        if (!restaurant || !restaurant.address || !restaurant.storeName) return null;

        // 住所をURIエンコードして、Google Mapsの検索URLを生成
        const encodedQuery = encodeURIComponent(`${restaurant.storeName} ${restaurant.address}`);
        // Google Mapsの汎用的な検索URL
        return `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
    };

    const handleOpenGoogleMaps = () => {
        const url = getGoogleMapsUrl();
        if (url) {
            Linking.openURL(url).catch((err) => {
                //エラー時の処理
                console.error('An error occurred opening Google Maps', err);
                Alert.alert("エラー", "Googleマップを開けませんでした");
            });
        } else {
            Alert.alert("エラー", "住所情報が見つかりませんでした")
        }
    };

    let parsedAnswers: AnswerData | undefined;
    if (answersString && diagnosisType === 'compatibility') {
        try { parsedAnswers = JSON.parse(answersString); } catch (e) { console.error('Failed to parse answers JSON:', e); }
    }

    useEffect(() => {
        const findRestaurant = async () => {
            const allData: StoreData[] = await fetchData();

            // ▼▼▼お店の指名（targetStoreNo）がある場合の処理を追加 ▼▼▼
            if (targetStoreNo) {
                // 指名されたNoのお店を探してセットするだけ
                const target = allData.find(item => item.storeNo.toString() === targetStoreNo);
                setRestaurant(target || null);
                setLoading(false);
                return; // ここで処理終了（ランダム抽選はしない）
            }

            const campusData = allData.filter(item => {
                if (campus === '天白') return item.storeNo >= 1 && item.storeNo <= 41;
                if (campus === '八事') return item.storeNo >= 42 && item.storeNo <= 71;
                if (campus === 'ナゴヤドーム前') return item.storeNo >= 72 && item.storeNo <= 113;
                return false;
            });
            let matched: StoreData[] = [];
            if (diagnosisType === 'genre' && selectedGenre) {
                matched = campusData.filter(item => item.genre === selectedGenre);
            } else if (diagnosisType === 'mbti' && selectedMbti) {
                matched = campusData.filter(item => item.mbtiType.includes(selectedMbti.split(' ')[0]));
            } else if (diagnosisType === 'compatibility' && parsedAnswers) {
                const isCasual = (budget: string) => ['～￥999', '￥1,000～￥1,999'].includes(budget);
                const isSplurge = (budget: string) => ['￥2,000～￥2,999', '￥3,000～￥3,999', '￥4,000～￥4,999'].includes(budget);
                const answers = parsedAnswers;
                matched = campusData.filter(item => {
                    const moodMatch = (answers.mood === '気軽に' && isCasual(item.budget)) || (answers.mood === '奮発' && isSplurge(item.budget));
                    const uniquenessMatch = answers.uniqueness === 'はい' ? item.isUnique === '○' : item.isUnique !== '○';
                    const calmnessMatch = answers.calmness === 'はい' ? item.isCalm === '○' : item.isCalm !== '○';
                    const photogenicMatch = answers.photogenic === 'はい' ? item.isPhotogenic === '○' : item.isPhotogenic !== '○';
                    return moodMatch && uniquenessMatch && calmnessMatch && photogenicMatch;
                });
            }
            setRestaurant(matched[Math.floor(Math.random() * matched.length)] || null);
            setLoading(false);
        };
        findRestaurant();
    }, [campus, diagnosisType, selectedGenre, selectedMbti, answersString, targetStoreNo]); // targetStoreNoを監視対象に追加

    if (loading) {
        return (
            <SafeAreaView style={styles.wrapper}>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            </SafeAreaView>
        );
    }

    if (!restaurant) {
        return (
            <SafeAreaView style={styles.wrapper}>
                <View style={styles.centered}>
                    <Text style={styles.errorText}>
                        データが見つかりませんでした。
                    </Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>戻る</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    //GooglemapのURLを取得
    const mapUrl = getGoogleMapsUrl();

    return (
        <SafeAreaView style={styles.wrapper}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* 指名で来た場合はヘッダーの文言を変える */}
                <Text style={styles.header}>
                    {targetStoreNo ? '保存されたお店情報' : 'あなたへのおすすめはこちら！'}
                </Text>

                <View style={styles.card}>
                    <Text style={styles.title}>{restaurant.storeName}</Text>
                    <InfoRow label="ジャンル" value={restaurant.genre} />
                    <InfoRow label="予算目安" value={restaurant.budget} />
                    <InfoRow label="営業時間" value={restaurant.businessHours} />
                    <InfoRow label="定休日" value={restaurant.regularHoliday} />
                    <InfoRow label="住所" value={restaurant.address} />
                    <InfoRow label="キャンパスからの時間" value={restaurant.accessTime} />
                    {mapUrl && (<InfoRow label="Googleマップで確認する" value="タップして開く" onPress={handleOpenGoogleMaps} />)}
                </View>

                <TouchableOpacity style={styles.favButton} onPress={saveToFavorites}>
                    <Text style={styles.favButtonText}>★ このお店を保存する</Text>
                </TouchableOpacity>

                {/* 保存リスト画面から来た場合、さらにリストへ飛ぶボタンは不要かもしれないが、あってもバグにはならない */}
                {!targetStoreNo && (
                    <TouchableOpacity style={styles.listLinkButton} onPress={() => router.push('/screens/BookmarkScreen')}>
                        <Text style={styles.listLinkText}>保存したお店を見る</Text>
                    </TouchableOpacity>
                )}

                <Text style={styles.disclaimer}>
                    ※実際の情報と異なる場合があります。公式の情報を確認してください。
                </Text>

                {/* 戻るボタンを見やすく追加（特にブックマークから来た時用） */}
                <TouchableOpacity style={{ marginTop: 20, alignItems: 'center' }} onPress={() => router.back()}>
                    <Text style={{ color: '#007AFF', fontSize: 16 }}>＜ 前の画面に戻る</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: '#FFFBEB' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    container: { padding: 15, paddingBottom: 30 },
    header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, color: '#333' },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#007AFF' },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    infoLabel: { fontSize: 16, color: '#666', flex: 2 },
    infoValue: { fontSize: 16, color: '#333', flex: 3, textAlign: 'right', fontWeight: '500' },
    infoValueContainer: { flex: 3, alignItems: 'flex-end' }, //URLリンクのタップ領域
    linkText: { color: '#007AFF', textDecorationLine: 'underline', fontWeight: 'bold' }, //URLリンクのテキストスタイル
    disclaimer: { textAlign: 'center', color: 'gray', fontSize: 12, padding: 10 },
    errorText: { fontSize: 18, color: '#d9534f', textAlign: 'center', marginBottom: 20, lineHeight: 25 },
    backButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    backButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    favButton: {
        backgroundColor: '#FF9500',
        paddingVertical: 15,
        borderRadius: 12,
        marginBottom: 15,
        alignItems: 'center',
    },
    favButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    listLinkButton: {
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        marginBottom: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 12,
    },
    listLinkText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default ResultScreen;