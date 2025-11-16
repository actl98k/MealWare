import Papa from 'papaparse';

export interface StoreData {
    storeNo: number;
    storeName: string;
    genre: string;
    businessDays: string;
    businessHours: string;
    regularHoliday: string;
    counterSeats: string;
    budget: string;
    isUnique: string;
    isCalm: string;
    isPhotogenic: string;
    address: string;
    accessTime: string;
    mbtiType: string;
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRAFVowStEnNWJlzv9gYXJzDKgJZjVVtmA3qui5er8Ngn6eGIx0Z7DtUnKS_i_uWzImWyn4Xqx9q_Iu/pub?output=csv';

let cachedData: StoreData[] | null = null;

export const fetchData = async (): Promise<StoreData[]> => {
    if (cachedData) return cachedData;

    try {
        const response = await fetch(CSV_URL);
        const csvString = await response.text();

        const parsedResult = Papa.parse<string[]>(csvString, { skipEmptyLines: true });

        const dataRows = parsedResult.data.slice(1);

        const jsonData: StoreData[] = dataRows
            // rowの型を固定
            .filter((row: string[]) => row[0] && !isNaN(parseInt(row[0], 10)))
            .map((row: string[]): StoreData => ({
                storeNo: parseInt(row[0], 10),
                storeName: row[1] || '',
                genre: row[2] || '',
                businessDays: row[3] || '',
                businessHours: row[4] || '',
                regularHoliday: row[5] || '',
                counterSeats: row[6] || '',
                budget: row[7] || '',
                isUnique: row[8] || '',
                isCalm: row[9] || '',
                isPhotogenic: row[10] || '',
                address: row[11] || '',
                accessTime: row[12] || '',
                mbtiType: row[13] || '',
            }));

        cachedData = jsonData;
        return cachedData;
    } catch (error) {
        console.error("CSVデータの取得または解析に失敗しました:", error);
        return [];
    }
};
