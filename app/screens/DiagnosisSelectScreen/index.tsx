import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Params = { campus: string };

const DiagnosisSelectScreen = () => {
  const router = useRouter();
  const { campus } = useLocalSearchParams<Params>();

  const handleNavigate = (path: string) => {
    router.push({ pathname: path as any, params: { campus } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{campus}キャンパス周辺グルメを提案します！</Text>
      <Text style={styles.subtitle}>診断方法を選んでください</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleNavigate('/screens/GenreDiagnosisScreen')}>
        <Text style={styles.buttonText}>料理ジャンル診断</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handleNavigate('/screens/CompatibilityDiagnosisScreen')}>
        <Text style={styles.buttonText}>相性診断</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handleNavigate('/screens/MbtiDiagnosisScreen')}>
        <Text style={styles.buttonText}>MBTIで診断</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#FFFBEB' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 10, marginBottom: 40 },
  button: { backgroundColor: '#FFFFFF', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 12, width: '90%', alignItems: 'center', marginBottom: 15, borderWidth: 2, borderColor: '#fbb361ff' },
  buttonText: { color: '#f8a547ff', fontSize: 18, fontWeight: '600' },
});

export default DiagnosisSelectScreen;
