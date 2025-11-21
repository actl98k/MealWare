import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Expo Router の画面遷移用
import { router } from 'expo-router';

export default function CampusSelectScreen() {
    // キャンパスを押したときに diagnose 画面へ移動
    const handleSelectCampus = (campus: string) => {
        router.push({
            pathname: '/screens/DiagnosisSelectScreen',
            params: { campus }, // diagnose 画面にデータを渡す
        });
    };

    // ▼▼▼ 追加：保存リスト画面へ移動する機能 ▼▼▼
    const handleGoToBookmarks = () => {
        // 作成済みのBookmarkScreenへ移動
        router.push('/screens/BookmarkScreen');
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.container}>
                <Text style={styles.title}>Mealware(仮)</Text>
                <Text style={styles.subtitle}>あなたの所属キャンパスを選択してください</Text>

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

                {/* デザイン調整用の余白 */}
                <View style={{ height: 30 }} />

                {/* ▼▼▼ 追加：保存したお店を見るボタン ▼▼▼ */}
                <TouchableOpacity
                    style={styles.bookmarkButton} // スタイルを別に作成
                    onPress={handleGoToBookmarks}
                >
                    <Text style={styles.bookmarkButtonText}>★ 保存したお店を見る</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}

// ========= スタイル定義 =========
const styles = StyleSheet.create({
    wrapper: {
        flex: 1, //画面全体を使う
        backgroundColor: '#FFFBEB', 
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
        backgroundColor: '#f8a547ff', // ボタンの背景色
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
    },

    // ▼▼▼ 追加したボタン用のスタイル ▼▼▼
    bookmarkButton: {
        backgroundColor: '#fff', // 背景は白
        borderWidth: 2,          // 枠線をつける
        borderColor: '#007AFF',  // 枠線（メインのオレンジと区別）
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        width: '90%',
        alignItems: 'center',
        marginBottom: 15,
    },
    bookmarkButtonText: {
        color: '#007AFF', // 文字色
        fontSize: 18,
        fontWeight: 'bold',
    },
});