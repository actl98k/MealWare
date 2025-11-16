import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { fetchData } from '../data/restaurantData';

const ResultScreen = ({ route, navigation }) => {
  // ... (useState, useEffectの中身は変更なし)
  const { campus, diagnosisType, selectedGenre, answers, selectedMbti } = route.params;
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const findRestaurant = async () => {
      try {
        const allData = await fetchData();
        const campusData = allData.filter(item => {
            if (campus === '天白') return item.storeNo >= 1 && item.storeNo <= 41;
            if (campus === '八事') return item.storeNo >= 42 && item.storeNo <= 71;
            if (campus === 'ナゴヤドーム前') return item.storeNo >= 72 && item.storeNo <= 113;
            return false;
        });

        if (campusData.length === 0) {
            setError(`対象キャンパス（${campus}）の飲食店データが見つかりません。`);
            setLoading(false);
            return;
        }

        let matchedRestaurants = [];

        if (diagnosisType === 'genre') {
          matchedRestaurants = campusData.filter(item => item.genre === selectedGenre);
        } 
        else if (diagnosisType === 'mbti') {
          matchedRestaurants = campusData.filter(item => item.mbtiType.includes(selectedMbti.split(' ')[0]));
        }
        else if (diagnosisType === 'compatibility') {
            const isCasual = (budget) => ['～￥999', '￥1,000～￥1,999'].includes(budget);
            const isSplurge = (budget) => ['￥2,000～￥2,999', '￥3,000～￥3,999', '￥4,000～￥4,999'].includes(budget);

            matchedRestaurants = campusData.filter(item => {
                const moodMatch = (answers.mood === '気軽に' && isCasual(item.budget)) || (answers.mood === '奮発' && isSplurge(item.budget));
                const uniquenessMatch = answers.uniqueness === 'はい' ? item.isUnique === '○' : item.isUnique !== '○';
                const calmnessMatch = answers.calmness === 'はい' ? item.isCalm === '○' : item.isCalm !== '○';
                const photogenicMatch = answers.photogenic === 'はい' ? item.isPhotogenic === '○' : item.isPhotogenic !== '○';
                return moodMatch && uniquenessMatch && calmnessMatch && photogenicMatch;
            });
        }
        
        if (matchedRestaurants.length > 0) {
          const randomIndex = Math.floor(Math.random() * matchedRestaurants.length);
          setRestaurant(matchedRestaurants[randomIndex]);
        } else {
          setError('条件に合う飲食店が見つかりませんでした。\n条件を変えて再検索してください。');
        }

      } catch (e) {
        setError('データの処理中にエラーが発生しました。');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    findRestaurant();
  }, [route.params]);

  if (loading) {
    return <SafeAreaView style={styles.wrapper}><ActivityIndicator size="large" color="#007AFF" /></SafeAreaView>;
  }
  
  if (error) {
      return (
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>戻って再試行</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
      );
  }

  if (restaurant) {
    return (
      <SafeAreaView style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>あなたへのおすすめはこちら！</Text>
          <View style={styles.card}>
            <Text style={styles.title}>{restaurant.storeName}</Text>
            <InfoRow label="ジャンル" value={restaurant.genre} />
            <InfoRow label="予算目安" value={restaurant.budget} />
            <InfoRow label="キャンパスからの時間" value={restaurant.accessTime} />
            <InfoRow label="営業日" value={restaurant.businessDays} />
            <InfoRow label="営業時間" value={restaurant.businessHours} />
            <InfoRow label="定休日" value={restaurant.regularHoliday} />
            <InfoRow label="住所" value={restaurant.address} />
          </View>
          <Text style={styles.disclaimer}>
            ※実際の情報と異なる場合があります。公式の情報を確認してください。
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
};

const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{String(value) || '情報なし'}</Text>
    </View>
);

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F5F5F7' },
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
  errorText: { fontSize: 18, color: '#d9534f', textAlign: 'center', marginBottom: 20 },
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
  }
});

export default ResultScreen;