import React from 'react';
import { Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

const MbtiDiagnosisScreen = ({ route, navigation }) => {
    const { campus } = route.params;
    const mbtiTypes = [
        "ISTJ (管理者)", "ISFJ (擁護者)", "INFJ (提唱者)", "INTJ (建築家)",
        "ISTP (巨匠)", "ISFP (冒険家)", "INFP (仲介者)", "INTP (論理学者)",
        "ESTP (起業家)", "ESFP (エンターテイナー)", "ENFP (広報運動家)", "ENTP (討論者)",
        "ESTJ (幹部)", "ESFJ (領事官)", "ENFJ (主人公)", "ENTJ (指揮官)"
    ];

    const handleSelectMbti = (mbti) => {
        navigation.navigate('Result', {
            campus: campus,
            diagnosisType: 'mbti',
            selectedMbti: mbti,
        });
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>あなたのMBTIタイプを　　　　　選択してください！</Text>
                {mbtiTypes.map(type => (
                    <TouchableOpacity key={type} style={styles.button} onPress={() => handleSelectMbti(type)}>
                        <Text style={styles.buttonText}>{type}</Text>
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
        textAlign: 'center',
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

export default MbtiDiagnosisScreen;