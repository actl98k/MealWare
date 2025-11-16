import Papa from 'papaparse';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRAFVowStEnNWJlzv9gYXJzDKgJZjVVtmA3qui5er8Ngn6eGIx0Z7DtUnKS_i_uWzImWyn4Xqx9q_Iu/pub?output=csv';

let cachedData = null;

// プログラムで使うためのヘッダー名（キー）を定義
const headers = [
  'storeNo', 'storeName', 'genre', 'businessDays', 'businessHours', 
  'regularHoliday', 'counterSeats', 'budget', 'isUnique', 'isCalm', 
  'isPhotogenic', 'address', 'accessTime', 'mbtiType'
];

export const fetchData = async () => {
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch(CSV_URL);
    const csvString = await response.text();

    // PapaParseでCSVを配列の配列として解析
    const parsedResult = Papa.parse(csvString, {
      skipEmptyLines: true, // 空行は無視する
    });
    
    // 最初の行（CSVのヘッダー）を捨てる
    const dataRows = parsedResult.data.slice(1);

    const jsonData = dataRows
      // '店No.'が空または数値でない行（キャンパス名の行など）を除外
      .filter(row => row[0] && !isNaN(parseInt(row[0], 10)))
      .map(row => {
        const item = {};
        headers.forEach((header, index) => {
          item[header] = row[index] || ''; // データがなくてもキーは作成
        });
        
        // storeNoを数値に変換しておく
        item.storeNo = parseInt(item.storeNo, 10);
        return item;
      });

    cachedData = jsonData;
    return cachedData;

  } catch (error) {
    console.error("CSVデータの取得または解析に失敗しました:", error);
    return [];
  }
};