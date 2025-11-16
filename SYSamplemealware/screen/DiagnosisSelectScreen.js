import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

const DiagnosisSelectScreen = ({ route, navigation }) => {
  const { campus } = route.params;

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}><Text style={styles.campusHighlight}>{campus}</Text>キャンパス</Text>
        <Text style={styles.subtitle}>診断方法を選んでください</Text>
        
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GenreDiagnosis', { campus })}>
          <Text style={styles.buttonText}>料理ジャンル診断</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CompatibilityDiagnosis', { campus })}>
          <Text style={styles.buttonText}>相性診断</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MbtiDiagnosis', { campus })}>
          <Text style={styles.buttonText}>MBTIで診断</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  campusHighlight: {
    color: '#007AFF', // キャンパス名をハイライト
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
  }
});

export default DiagnosisSelectScreen;