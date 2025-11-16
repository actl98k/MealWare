// useLocalSearchParamsのエラー解消のため、URLパラメータをstringとして受け取り、JSONパースするよう修正

import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';
// データの型とフェッチ関数はプロジェクト内の既存のものを使用
import { fetchData } from '../../data/restaurantData';
import { StoreData } from '../../types';

// CompatibilityDiagnosisScreen.tsxからJSON化されて渡されるanswersオブジェクトの型
type AnswerData = {
    mood: '気軽に' | '奮発';
    uniqueness: 'はい' | 'うーん';
    calmness: 'はい' | 'うーん';
    photogenic: 'はい' | 'うーん';
};

// expo-routerのuseLocalSearchParamsに渡すParams型
// URLパラメータはすべてstring型でなければならないため、answersはstringとして受け取る
type Params = {
    campus?: string;
    diagnosisType?: 'genre' | 'mbti' | 'compatibility';
    selectedGenre?: string;
    selectedMbti?: string;
    answers?: string; // JSON文字列として受け取る
};

const ResultScreen = () => {
    const params = useLocalSearchParams<Params>();
    // answersをanswersStringとして受け取る
    const { campus, diagnosisType, selectedGenre, selectedMbti, answers: answersString } = params;

    const [restaurant, setRestaurant] = useState<StoreData | null>(null);
    const [loading, setLoading] = useState(true);

    // answersStringをパースしてオブジェクトに変換
    let parsedAnswers: AnswerData | undefined;
    if (answersString && diagnosisType === 'compatibility') {
        try {
            parsedAnswers = JSON.parse(answersString);
        } catch (e) {
            console.error('Failed to parse answers JSON:', e);
        }
    }

    useEffect(() => {
        const findRestaurant = async () => {
            const allData: StoreData[] = await fetchData();

            // キャンパスでフィルター
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
                matched = campusData.filter(item =>
                    item.mbtiType.includes(selectedMbti.split(' ')[0])
                );
            } else if (diagnosisType === 'compatibility' && parsedAnswers) {
                // パース済みのanswersオブジェクトを使用
                const isCasual = (budget: string) => ['～￥999', '￥1,000～￥1,999'].includes(budget);
                const isSplurge = (budget: string) =>
                    ['￥2,000～￥2,999', '￥3,000～￥3,999', '￥4,000～￥4,999'].includes(budget);

                const answers = parsedAnswers;

                matched = campusData.filter(item => {
                    // answers.mood, answers.uniqueness, answers.calmness, answers.photogenic は、
                    // CompatibilityDiagnosisScreen.tsxで作成されたオブジェクトのプロパティとして参照できる
                    const moodMatch =
                        (answers.mood === '気軽に' && isCasual(item.budget)) ||
                        (answers.mood === '奮発' && isSplurge(item.budget));
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

    if (loading) return <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1 }} />;

    if (!restaurant) return <Text style={styles.message}>条件に合う飲食店が見つかりませんでした。</Text>;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{restaurant.storeName}</Text>
            <Text>ジャンル: {restaurant.genre}</Text>
            <Text>予算目安: {restaurant.budget}</Text>
            <Text>営業時間: {restaurant.businessHours}</Text>
            <Text>定休日: {restaurant.regularHoliday}</Text>
            <Text>住所: {restaurant.address}</Text>
            <Text>キャンパスからの時間: {restaurant.accessTime}</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#F5F5F7', alignItems: 'center' },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#007AFF', textAlign: 'center' },
    message: { fontSize: 18, padding: 20, textAlign: 'center', color: '#d9534f' },
});

export default ResultScreen;