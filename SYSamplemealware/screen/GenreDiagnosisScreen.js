import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { fetchData } from '../data/restaurantData';

const GenreDiagnosisScreen = ({ route, navigation }) => {
  const { campus } = route.params;
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ... (useEffectの中身は変更なし)
    const loadData = async () => {
      const allData = await fetchData();
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

  const handleSelectGenre = (genre) => {
    navigation.navigate('Result', {
      campus: campus,
      diagnosisType: 'genre',
      selectedGenre: genre,
    });
  };

  if (loading) {
    return <SafeAreaView style={styles.wrapper}><ActivityIndicator size="large" color="#007AFF" /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>好きなジャンルを選んでください</Text>
        {genres.map((genre, index) => (
          <TouchableOpacity key={index} style={styles.button} onPress={() => handleSelectGenre(genre)}>
            <Text style={styles.buttonText}>{genre}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: '5%',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  }
});

export default GenreDiagnosisScreen;