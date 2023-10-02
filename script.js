const url = 'https://api.open-meteo.com/v1/forecast?';
const latitude = 48.8534;
const longitude = 2.3488;
const current_weather = true;
const forecast_days = 7;

async function getData() {
    /*const request = new Request(url, {
        headers: {
            'latitude': '48.8534',
            'longitude': '2.3488',
            'current_weather': 'true'
        }
    });*/
    console.log((url + 'latitude=' + latitude + '&longitude=' + longitude + '&current_weather=' + current_weather + '&forecast_days=' + forecast_days))
    const response = await fetch(url + 'latitude=' + latitude + '&longitude=' + longitude + '&current_weather=' + current_weather + '&forecast_days=' + forecast_days);
    const data = response.json();
    return data;
    };

async function printData() {
    const data = await getData();
    console.log(data);
}