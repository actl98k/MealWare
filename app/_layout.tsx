import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      // アプリ全体のヘッダーのデフォルト設定
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF', // ヘッダーの背景色を青に
        },
        headerTintColor: '#FFFFFF', // タイトルや戻るボタンの色を白に
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        // バックボタンの文字を統一
        headerBackTitle: '戻る', 
      }}
    >
      {/* (tabs) フォルダはヘッダーなし */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* 
        修正ポイント
        一番最初の画面（app/index.tsx）に対する設定を追加しました。
      */}

      <Stack.Screen 
        name="index" 
        options={{ title: 'Mealware' }} 
      />

      {/* 
        修正ポイント:
        ファイルが "app/screens/〇〇/index.tsx" の場合、
        name に "/index" まで明記することで確実に紐づけます。
      */}
      <Stack.Screen
        name="screens/CampusSelectScreen/index" 
        options={{ title: 'Mealware' }}
      />
      <Stack.Screen
        name="screens/DiagnosisSelectScreen/index"
        options={{ title: '診断方法を選択' }}
      />
       <Stack.Screen
        name="screens/GenreDiagnosisScreen/index"
        options={{ title: '料理ジャンル診断' }}
      />
      <Stack.Screen
        name="screens/CompatibilityDiagnosisScreen/index"
        options={{ title: '相性診断' }}
      />
      <Stack.Screen
        name="screens/MbtiDiagnosisScreen/index"
        options={{ title: 'MBTIで診断' }}
      />
      <Stack.Screen
        name="screens/ResultScreen/index"
        options={{ title: '診断結果' }}
      />
    </Stack>
  );
}