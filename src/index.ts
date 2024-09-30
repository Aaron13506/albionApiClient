console.log('Happy developing ✨')
import { getPricesInterface } from './interface/getPricesInterface'
import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import readline from 'node:readline';

const apiServer = 'https://west.albion-online-data.com/api/v2/stats/Charts/'
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

/*export class itemData {
    itemName: string;
    itemAvgPrice: number;
    itemDailySell: number;
    profitPerPlot: number;
    itemSeedPrice: number;
}*/
const cities: Record<number, string> = {
    1: 'caerleon',
    2: 'fort%20sterling',
    3: 'bridgewatch',
    4: 'lymhurst',
    5: 'thetford',
    6: 'martlock',
    7: 'brecilien'
}

const farmItems = 'T1_CARROT,T2_BEAN,T3_WHEAT,T4_TURNIP,T5_CABBAGE,T6_POTATO,T7_CORN,T8_PUMPKIN';
const herbItems = 'T2_AGARIC,T3_COMFREY,T4_BURDOCK,T5_TEASEL,T6_FOXGLOVE,T7_MULLEIN,T8_YARROW'

const seedPrices: Record<string,number>= {
    'T1_CARROT':2000,
    'T2_BEAN': 3000,
    'T3_WHEAT': 5000,
    'T4_TURNIP': 7500,
    'T5_CABBAGE': 10000,
    'T6_POTATO': 15000,
    'T7_CORN': 22500,
    'T8_PUMPKIN': 30000,
    'T2_AGARIC': 3000,
    'T3_COMFREY': 5000,
    'T4_BURDOCK': 7500,
    'T5_TEASEL': 10000,
    'T6_FOXGLOVE':15000,
    'T7_MULLEIN': 22500,
    'T8_YARROW': 30000
}

const seedReturnRate:Record<string,number>= {
    'T1_CARROT':0,
    'T2_BEAN': 33,
    'T3_WHEAT': 60,
    'T4_TURNIP': 73,
    'T5_CABBAGE': 80,
    'T6_POTATO': 87,
    'T7_CORN': 91,
    'T8_PUMPKIN': 93,
    'T2_AGARIC': 33,
    'T3_COMFREY': 60,
    'T4_BURDOCK': 73,
    'T5_TEASEL': 80,
    'T6_FOXGLOVE':87,
    'T7_MULLEIN': 91,
    'T8_YARROW': 93
}

function formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
}
const actualDate = new Date();
const yesterday = formatDate(new Date(actualDate.getTime()-86400000));
const sevenDaysAgo = formatDate(new Date(actualDate.getTime()-1209600000))

let inicio = `Escoge la ciudad que quieres revisar:\n  
1: Caerleon
2: Fort Sterling
3: Bridgewatch
4: Lymhurst
5: Thetford
6: Martlock
7: Brecilien\n`;

let farmArray: { itemName: string; itemAvgPrice: number; itemDailySell: number; minProfitPerPlot: number; maxProfitPerPlot: number; averageProfitPerPlot: number; }[] = []

function getPrices(city: string) {
// https://west.albion-online-data.com/api/v2/stats/Charts/T3_WHEAT.json?locations=fort%20sterling&date=9-18-2024&end_date=9-25-2024&qualities=1&time-scale=24
    //console.log(`${apiServer}${farmItems},${herbItems}.json?locations=${city}&date=${sevenDaysAgo}&end_date=${yesterday}&qualities=1&time-scale=24`);
    axios.get(`${farmItems},${herbItems}.json?locations=${city}&date=${sevenDaysAgo}&end_date=${yesterday}&qualities=1&time-scale=24`, {
        timeout: 10000,
        baseURL: apiServer,
        responseType: 'json',
    })
        .then(function (response) {
            for (const responsePrice of response.data) {
                // @ts-ignore
                responsePrice.data.prices_avg =Math.round( responsePrice.data.prices_avg.reduce((sum, currentValue) => sum + currentValue, 0) / responsePrice.data.prices_avg.length);
                // @ts-ignore
                responsePrice.data.item_count =Math.round( responsePrice.data.item_count.reduce((sum, currentValue) => sum + currentValue, 0) / responsePrice.data.item_count.length);
farmArray.push({
    itemName: responsePrice.item_id,
    itemAvgPrice: responsePrice.data.prices_avg,
    itemDailySell: responsePrice.data.item_count,
    minProfitPerPlot:responsePrice.data.prices_avg*6-(seedPrices[responsePrice.item_id]-(seedPrices[responsePrice.item_id]*seedReturnRate[responsePrice.item_id]/100)),
    maxProfitPerPlot: responsePrice.data.prices_avg*12-(seedPrices[responsePrice.item_id]-(seedPrices[responsePrice.item_id]*seedReturnRate[responsePrice.item_id]/100)),
    averageProfitPerPlot: responsePrice.data.prices_avg*9-(seedPrices[responsePrice.item_id]-(seedPrices[responsePrice.item_id]*seedReturnRate[responsePrice.item_id]/100)),
});
farmArray.sort((a, b) => b.averageProfitPerPlot - a.averageProfitPerPlot);
            }
            console.log(farmArray)
        })
        .catch(function (error: Error) {
            console.log('ERROR:',error);
        })
        .finally(function () {
            // siempre sera ejecutado
        });
}

// @ts-ignore
rl.question(inicio, (cityid: number) => {
    getPrices(cities[cityid]);
    rl.close();
});