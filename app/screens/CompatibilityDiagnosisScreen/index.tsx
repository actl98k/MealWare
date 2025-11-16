import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CompatibilityDiagnosisScreen = () => {
    // 前の画面から渡ってきた campus を取得
    const params = useLocalSearchParams<{ campus?: string }>();
    const campus = params.campus;

    // 各質問の回答を管理するステート
    const [mood, setMood] = useState<string | null>(null);
    const [uniqueness, setUniqueness] = useState<string | null>(null);
    const [calmness, setCalmness] = useState<string | null>(null);
    const [photogenic, setPhotogenic] = useState<string | null>(null);

    // 診断ボタンを押したときの処理
    const handleDiagnose = () => {
        // 全部の質問に答えていない場合は処理を中断し、コンソールにエラーを出力 (alertの代替)
        if (!mood || !uniqueness || !calmness || !photogenic) {
            console.error('すべての質問に回答してください。');
            return;
        }

        // ResultScreen.tsxが期待するキーと値を持つオブジェクトを作成
        const answersObject = {
            mood: mood,
            uniqueness: uniqueness,
            calmness: calmness,
            photogenic: photogenic,
        };

        router.push({
            pathname: '/screens/ResultScreen',
            params: {
                campus,
                diagnosisType: 'compatibility',
                // 修正: オブジェクトをJSON文字列に変換して渡す
                answers: JSON.stringify(answersObject),
            },
        });
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
                            <Text style={[styles.optionButtonText, mood === '気軽に' && styles.selectedOptionText]}>
                                気軽に
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.optionButton, mood === '奮発' && styles.selectedOption]}
                            onPress={() => setMood('奮発')}
                        >
                            <Text style={[styles.optionButtonText, mood === '奮発' && styles.selectedOptionText]}>
                                奮発
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 質問2 */}
                <View style={styles.questionBox}>
                    <Text style={styles.questionText}>我が道を行くタイプ？</Text>

                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[styles.optionButton, uniqueness === 'はい' && styles.selectedOption]}
                            onPress={() => setUniqueness('はい')}
                        >
                            <Text style={[styles.optionButtonText, uniqueness === 'はい' && styles.selectedOptionText]}>
                                はい
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.optionButton, uniqueness === 'うーん' && styles.selectedOption]}
                            onPress={() => setUniqueness('うーん')}
                        >
                            <Text style={[styles.optionButtonText, uniqueness === 'うーん' && styles.selectedOptionText]}>
                                うーん
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 質問3 */}
                <View style={styles.questionBox}>
                    <Text style={styles.questionText}>ちょっと落ち着きたい気分？</Text>

                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[styles.optionButton, calmness === 'はい' && styles.selectedOption]}
                            onPress={() => setCalmness('はい')}
                        >
                            <Text style={[styles.optionButtonText, calmness === 'はい' && styles.selectedOptionText]}>
                                はい
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.optionButton, calmness === 'うーん' && styles.selectedOption]}
                            onPress={() => setCalmness('うーん')}
                        >
                            <Text style={[styles.optionButtonText, calmness === 'うーん' && styles.selectedOptionText]}>
                                うーん
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 質問4 */}
                <View style={styles.questionBox}>
                    <Text style={styles.questionText}>派手目な料理が好き？</Text>

                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[styles.optionButton, photogenic === 'はい' && styles.selectedOption]}
                            onPress={() => setPhotogenic('はい')}
                        >
                            <Text style={[styles.optionButtonText, photogenic === 'はい' && styles.selectedOptionText]}>
                                はい
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.optionButton, photogenic === 'うーん' && styles.selectedOption]}
                            onPress={() => setPhotogenic('うーん')}
                        >
                            <Text style={[styles.optionButtonText, photogenic === 'うーん' && styles.selectedOptionText]}>
                                うーん
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 診断ボタン */}
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
    questionText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
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
        backgroundColor: '#28a745',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    diagnoseButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});

export default CompatibilityDiagnosisScreen;