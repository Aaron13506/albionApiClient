console.log('Happy developing ✨')
import { getPricesInterface } from './interface/getPricesInterface'
import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
;
import readline from 'node:readline';

const apiServer = 'https://west.albion-online-data.com/api/v2/stats/Charts/'
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const cities: Record<number, string> = {
    1: 'caerleon',
    2: 'fort%20sterling',
    3: 'bridgewatch',
    4: 'lymhurst',
    5: 'thetford',
    6: 'martlock',
    7: 'brecilien'
}
function formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}
const today = new Date();

let inicio = `Escoge la ciudad que quieres revisar:\n  
1: Caerleon
2: Fort Sterling
3: Bridgewatch
4: Lymhurst
5: Thetford
6: Martlock
7: Brecilien\n`;

let city =''

// @ts-ignore
rl.question(inicio, (cityid: number) => {
    city = cities[cityid];
    console.log('Data:',city,'\n', formatDate(today));
    getPrices();
    rl.close();
});
function getPrices(){
// @ts-ignore
    const data: getPricesInterface =  axios.get(`${apiServer}T3_WHEAT.json?locations=${city}&date=9-18-2024&end_date=9-25-2024&qualities=1&time-scale=24`)
        .then(data => {
            console.log(data)
        });
}
