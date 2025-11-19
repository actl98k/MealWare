// useLocalSearchParamsのエラー解消のため、URLパラメータをstringとして受け取り、JSONパースするよう修正

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// データの型とフェッチ関数はプロジェクト内の既存のものを使用
import { fetchData } from '../../data/restaurantData';
import { StoreData } from '../../types';

// 型定義などは変更なし
type AnswerData = {
    mood: '気軽に' | '奮発';
    uniqueness: 'はい' | 'うーん';
    calmness: 'はい' | 'うーん';
    photogenic: 'はい' | 'うーん';
};
type Params = {
    campus?: string;
    diagnosisType?: 'genre' | 'mbti' | 'compatibility';
    selectedGenre?: string;
    selectedMbti?: string;
    answers?: string;
};
type InfoRowProps = {
    label: string;
    value: string | null | undefined;
};

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || '情報なし'}</Text>
    </View>
);

const ResultScreen = () => {
    // この中のロジックは一切変更ありません
    const params = useLocalSearchParams<Params>();
    const router = useRouter();
    const { campus, diagnosisType, selectedGenre, selectedMbti, answers: answersString } = params;
    const [restaurant, setRestaurant] = useState<StoreData | null>(null);
    const [loading, setLoading] = useState(true);
    let parsedAnswers: AnswerData | undefined;
    if (answersString && diagnosisType === 'compatibility') {
        try { parsedAnswers = JSON.parse(answersString); } catch (e) { console.error('Failed to parse answers JSON:', e); }
    }
    useEffect(() => {
        const findRestaurant = async () => {
            const allData: StoreData[] = await fetchData();
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
    }, [campus, diagnosisType, selectedGenre, selectedMbti, answersString]);


    // ========== デザイン部分の変更 ==========

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
                        条件に合う飲食店が見つかりませんでした。{'\n'}条件を変えて再検索してください。
                    </Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>戻って再試行</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.wrapper}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>あなたへのおすすめはこちら！</Text>
                <View style={styles.card}>
                    <Text style={styles.title}>{restaurant.storeName}</Text>
                    <InfoRow label="ジャンル" value={restaurant.genre} />
                    <InfoRow label="予算目安" value={restaurant.budget} />
                    <InfoRow label="営業時間" value={restaurant.businessHours} />
                    <InfoRow label="定休日" value={restaurant.regularHoliday} />
                    <InfoRow label="住所" value={restaurant.address} />
                    <InfoRow label="キャンパスからの時間" value={restaurant.accessTime} />
                </View>
                <Text style={styles.disclaimer}>
                    ※実際の情報と異なる場合があります。公式の情報を確認してください。
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // ★ wrapperにクリーム色の背景色を設定
    wrapper: { 
        flex: 1, 
        backgroundColor: '#FFFBEB'
    },
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
    disclaimer: { textAlign: 'center', color: 'gray', fontSize: 12, padding: 10 },
    errorText: { fontSize: 18, color: '#d9534f', textAlign: 'center', marginBottom: 20, lineHeight: 25 },
    backButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ResultScreen;