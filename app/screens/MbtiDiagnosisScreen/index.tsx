// app/screens/MbtiDiagnosisScreen.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Params = { campus: string };

const mbtiTypes = [
    "ISTJ (管理者)", "ISFJ (擁護者)", "INFJ (提唱者)", "INTJ (建築家)",
    "ISTP (巨匠)", "ISFP (冒険家)", "INFP (仲介者)", "INTP (論理学者)",
    "ESTP (起業家)", "ESFP (ｴﾝﾀｰﾃｲﾅｰ)", "ENFP (広報運動家)", "ENTP (討論者)",
    "ESTJ (幹部)", "ESFJ (領事官)", "ENFJ (主人公)", "ENTJ (指揮官)"
];

const MbtiDiagnosisScreen = () => {
    //const router = useRouter();
    const { campus } = useLocalSearchParams<Params>();

    const handleSelectMbti = (mbti: string) => {
        router.push({
            pathname: '/screens/ResultScreen',
            params: { campus, diagnosisType: 'mbti', selectedMbti: mbti },
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>あなたのMBTIタイプを選択してください</Text>
            <View style={styles.gridContainer}>
            {mbtiTypes.map((type) => (
                <TouchableOpacity key={type} style={styles.button} onPress={() => handleSelectMbti(type)}>
                    <Text style={styles.buttonText}>{type}</Text>
                </TouchableOpacity>
            ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, alignItems: 'center', backgroundColor: '#FFFBEB' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
        //グリッドレイアウト用のスタイルを追加
    gridContainer: {
        flexDirection: 'row',       // 横並びにする
        flexWrap: 'wrap',           // 幅を超えたら折り返す
        justifyContent: 'space-between', // ボタン間の均等配置
        width: '100%',              // 横幅いっぱいに広げる
    },

    //ボタンの幅を調整
    button: { 
        backgroundColor: '#fff', 
        padding: 12, 
        borderRadius: 10, 
        width: '47%',
        alignItems: 'center', 
        marginBottom: 10,
        borderWidth: 1, 
        borderColor: '#007AFF' 
    },
    buttonText: { color: '#007AFF', fontSize: 15, fontWeight: '500' },
});

export default MbtiDiagnosisScreen;
