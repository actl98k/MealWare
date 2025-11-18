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
      }}
    >
      {/* (tabs) フォルダはヘッダーなし */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* 
        ここから下の name が最も重要なポイントです。
        ファイル構造が "app/screens/〇〇Screen/index.tsx" の場合、
        ルーターが認識する名前は "screens/〇〇Screen" となります。
      */}
      <Stack.Screen
        name="screens/CampusSelectScreen" // これが "app/screens/CampusSelectScreen/index.tsx" を指します
        options={{ title: 'Mealware' }}
      />
      <Stack.Screen
        name="screens/DiagnosisSelectScreen"
        options={{ title: '診断方法を選択' }}
      />
       <Stack.Screen
        name="screens/GenreDiagnosisScreen"
        options={{ title: '料理ジャンル診断' }}
      />
      <Stack.Screen
        name="screens/CompatibilityDiagnosisScreen"
        options={{ title: '相性診断' }}
      />
      <Stack.Screen
        name="screens/MbtiDiagnosisScreen"
        options={{ title: 'MBTIで診断' }}
      />
      <Stack.Screen
        name="screens/ResultScreen"
        options={{ title: '診断結果' }}
      />
    </Stack>
  );
}