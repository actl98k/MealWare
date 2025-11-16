import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

const CampusSelectScreen = ({ navigation }) => {
  const handleSelectCampus = (campus) => {
    navigation.navigate('DiagnosisSelect', { campus: campus });
  };

  return (
    // SafeAreaViewは、スマホ上部のノッチ（切り欠き）などを避けて表示してくれる便利なコンポーネント
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>ようこそ Mealware へ！</Text>
        <Text style={styles.subtitle}>所属キャンパスを選択してください</Text>
        
        {/* 天白ボタン */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleSelectCampus('天白')}
        >
          <Text style={styles.buttonText}>天白キャンパス</Text>
        </TouchableOpacity>
        
        {/* 八事ボタン */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleSelectCampus('八事')}
        >
          <Text style={styles.buttonText}>八事キャンパス</Text>
        </TouchableOpacity>

        {/* ナゴヤドーム前ボタン */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleSelectCampus('ナゴヤドーム前')}
        >
          <Text style={styles.buttonText}>ナゴヤドーム前キャンパス</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// スタイル定義を大幅にリッチ化！
const styles = StyleSheet.create({
  wrapper: {
    flex: 1, // 画面全体を使う
    backgroundColor: '#F5F5F7', // 背景色を少しグレーに
  },
  container: {
    flex: 1,
    justifyContent: 'center', // 要素を垂直方向の中央に配置
    alignItems: 'center', // 要素を水平方向の中央に配置
    paddingHorizontal: 20, // 左右に余白
  },
  title: {
    fontSize: 28, // 文字サイズ
    fontWeight: 'bold', // 文字の太さ
    color: '#333', // 文字色
    marginBottom: 10, // 下に余白
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40, // ボタンとの間に大きめの余白
  },
  button: {
    backgroundColor: '#00bfffff', // ボタンの背景色（Appleの標準的な青）
    paddingVertical: 15, // 上下の余白
    paddingHorizontal: 30, // 左右の余白
    borderRadius: 12, // 角を丸くする
    width: '90%', // 横幅
    alignItems: 'center', // 中の文字を中央揃えに
    marginBottom: 15, // 各ボタンの間の余白
    // ボタンに影をつける（iOS）
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // ボタンに影をつける（Android）
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF', // ボタンの文字色（白）
    fontSize: 18,
    fontWeight: '600',
  }
});

export default CampusSelectScreen;