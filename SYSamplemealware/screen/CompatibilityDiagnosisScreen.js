import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

const CompatibilityDiagnosisScreen = ({ route, navigation }) => {
  const { campus } = route.params;
  
  const [mood, setMood] = useState(null);
  const [uniqueness, setUniqueness] = useState(null);
  const [calmness, setCalmness] = useState(null);
  const [photogenic, setPhotogenic] = useState(null);

  const handleDiagnose = () => {
    if (mood && uniqueness && calmness && photogenic) {
        navigation.navigate('Result', {
            campus: campus,
            diagnosisType: 'compatibility',
            answers: { mood, uniqueness, calmness, photogenic },
        });
    } else {
        alert('すべての質問に回答してください。');
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* 質問1 */}
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>お昼の気分は？</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.optionButton, mood === '気軽に' && styles.selectedOption]}
              onPress={() => setMood('気軽に')}
            >
              <Text style={[styles.optionButtonText, mood === '気軽に' && styles.selectedOptionText]}>気軽に</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.optionButton, mood === '奮発' && styles.selectedOption]}
              onPress={() => setMood('奮発')}
            >
              <Text style={[styles.optionButtonText, mood === '奮発' && styles.selectedOptionText]}>奮発</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* 質問2 */}
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>我が道を行くタイプ？</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={[styles.optionButton, uniqueness === 'はい' && styles.selectedOption]} onPress={() => setUniqueness('はい')}>
              <Text style={[styles.optionButtonText, uniqueness === 'はい' && styles.selectedOptionText]}>はい</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionButton, uniqueness === 'うーん' && styles.selectedOption]} onPress={() => setUniqueness('うーん')}>
              <Text style={[styles.optionButtonText, uniqueness === 'うーん' && styles.selectedOptionText]}>うーん</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* 質問3 */}
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>ちょっと落ち着きたい気分？</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={[styles.optionButton, calmness === 'はい' && styles.selectedOption]} onPress={() => setCalmness('はい')}>
              <Text style={[styles.optionButtonText, calmness === 'はい' && styles.selectedOptionText]}>はい</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionButton, calmness === 'うーん' && styles.selectedOption]} onPress={() => setCalmness('うーん')}>
              <Text style={[styles.optionButtonText, calmness === 'うーん' && styles.selectedOptionText]}>うーん</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 質問4 */}
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>派手目な料理が好き？</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={[styles.optionButton, photogenic === 'はい' && styles.selectedOption]} onPress={() => setPhotogenic('はい')}>
              <Text style={[styles.optionButtonText, photogenic === 'はい' && styles.selectedOptionText]}>はい</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionButton, photogenic === 'うーん' && styles.selectedOption]} onPress={() => setPhotogenic('うーん')}>
              <Text style={[styles.optionButtonText, photogenic === 'うーん' && styles.selectedOptionText]}>うーん</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.diagnoseButton} onPress={handleDiagnose}>
          <Text style={styles.diagnoseButtonText}>この条件で診断する</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F5F5F7' },
  container: { padding: 20 },
  mainTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 20 },
  questionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  questionText: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 15, textAlign: 'center' },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-around' },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    width: '45%',
    alignItems: 'center',
  },
  optionButtonText: { color: '#007AFF', fontSize: 16 },
  selectedOption: { backgroundColor: '#007AFF' },
  selectedOptionText: { color: '#FFFFFF' },
  diagnoseButton: {
    backgroundColor: '#28a745', // 成功をイメージさせる緑色
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  diagnoseButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }
});

export default CompatibilityDiagnosisScreen;