import Chart from 'chart.js/auto'

(async function() {
  const data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ];

  new Chart(
    document.getElementById('graph'),
    {
      type: 'bar',
      data: {
        labels: data.map(row => row.year),
        datasets: [
          {
            label: 'Acquisitions by year',
            data: data.map(row => row.count)
          }
        ]
      }
    }
  );
})();










// API REQUEST

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