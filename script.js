// START
let apiData = {};
let days = [];

// COORDINATES TO API FUNCTION
let hoje = Date.now() - 5000;
async function getCoordinates() {
  if (Date.now()-hoje>5000) {
    hoje = Date.now();
    let warningTrigger = false;
  const latitude = document.getElementById('latitude');
  const longitude = document.getElementById('longitude');
  if (latitude=='' || longitude=='') {
    warningTrigger = true;
  }
  for (let i in latitude.validity) { // I need to find a way to make it easier
    if (latitude.validity[i]==true) {
      if (i=='valid') {
        continue
      }
      document.getElementById('latitudeWarning').innerHTML = (latitude.validationMessage);
      warningTrigger = true;
      break
    }
  }
  for (let i in longitude.validity) { // I need to find a way to make it easier
    if (longitude.validity[i]==true) {
      if (i=='valid') {
        continue
      }
      document.getElementById('longitudeWarning').innerHTML = (longitude.validationMessage);
      warningTrigger = true;
      break
    }
  }
  if (warningTrigger==false) {
    document.getElementById('latitudeWarning').innerHTML = ''
    document.getElementById('longitudeWarning').innerHTML = ''
    apiData = await getData(latitude.value, longitude.value);
    updateCards(apiData);
  }
};
  }

// API REQUEST

async function getData(latitude, longitude) { // Get data from api
  const response = await fetch(fetchData('https://api.open-meteo.com/v1/forecast?', {
      latitude: latitude,
      longitude: longitude,
      forecast_days: 7,
      past_days: 1,
      hourly: 'temperature_2m',
      daily: ['temperature_2m_max', 'temperature_2m_min', 'weathercode'],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }));
  const data = response.json();
  console.log(data);
  return data;
  };

function fetchData(url, obj) { // Get the url and the parameters in a object and return everything combined as a string
  result = url
  for (let i in obj) {
      if (Array.isArray(obj[i]) == true) {
          for (let j of obj[i]) {
              result += i + '=' + j;
              result += '&'
          }
      } else {
          result += i + '=' + obj[i];
          result += '&'
      }
  }
  result = result.slice(0, -1);
  return result
}


// API USAGE
  // WEATHER CARDS
function updateCards(apiData) {
  const temps = [];
  console.log('updateCards:', apiData);
  let day = new Date();
  day = day.getDay();
  for (let i = 0; i <= 7; i++) {
    if (i >= 2) { // CHANGE DAY NAME
      if (day + i - 1 >= 7) {
        day = day - 7;
      };
      switch(day + i - 1) {
        case (0):
          document.getElementById('cardday' + i).innerHTML = 'Sunday';
          break;
        case (1):
          document.getElementById('cardday' + i).innerHTML = 'Monday';
          break;
        case (2):
          document.getElementById('cardday' + i).innerHTML = 'Tuesday';
          break;
        case (3):
          document.getElementById('cardday' + i).innerHTML = 'Wednesday';
          break;
        case (4):
          document.getElementById('cardday' + i).innerHTML = 'Thursday';
          break;
        case (5):
          document.getElementById('cardday' + i).innerHTML = 'Friday';
          break;
        case (6):
          document.getElementById('cardday' + i).innerHTML = 'Saturday';
          break;
    }}
  else {
    switch (i) {
      case 0:
        document.getElementById('cardday' + i).innerHTML = 'Yesterday';
        break;
      case 1:
        document.getElementById('cardday' + i).innerHTML = 'Today';
        break;
    }
  };
      document.getElementById('cardicon' + i).className = ('wi ' + weather_codes[apiData.daily.weathercode[i]][0]);
      // Add a poput to each image showing the code and explaining what the code means
      document.getElementById('cardtemp' + i).innerHTML = apiData.daily.temperature_2m_min[i] + '°C - ' + apiData.daily.temperature_2m_max[i] + '°C';
      temps.push([apiData.daily.temperature_2m_min[i], apiData.daily.temperature_2m_max[i]])
    };
  updateGraph(1);
  document.getElementById('dayselector').style.display = 'grid';
  };

  // GRAPH
const hours = [];
for (let i = 0; i<24; i++) {
  if (i < 10) {
    hours.push('0' + i + ':00');
  }
  else {
    hours.push(i + ':00');
  }
};
let graphData = [];
const ctx = document.getElementById('graph');
config = {
    type: 'line',
    data: {
        labels: hours,
        datasets: [{
            label:'Temperature',
            data: [],
            backgroundColor: '#FF9B00',
            fill: false,
            borderColor: '#FF9B00',
            tension: 0
        },
        {
          label:'Precipitation',
          data: [],
          backgroundColor: '#009BFF',
          fill: false,
          borderColor: '#009BFF',
          tension: 0
      }]
        }
    }
let graph = new Chart(ctx, config);

function updateGraph(position) {
  graphData = [];
  for (let i = 0 + 24 * position; i < 24 + 24 * position; i++) {
    graphData.push(apiData.hourly.temperature_2m[i]);
  }
  console.log(graphData);
  graph.data.datasets[0].data = graphData;
  graph.update();
  document.getElementById('graph').style.display = 'flex';
}


// A mess that needs to be in script.js
const weather_codes = [['wi-day-sunny', 'Cloud development not observed or not observable', 'Characteristic change of the state of sky during the past hour'],
['wi-day-sunny', 'Clouds generally dissolving or becoming less developed ', 'Characteristic change of the state of sky during the past hour'],
['wi-day-sunny', 'State of sky on the whole unchanged', 'Characteristic change of the state of sky during the past hour'],
['wi-day-cloudy', 'Clouds generally forming or developing', 'Characteristic change of the state of sky during the past hour'],
['wi-smoke', 'Visibility reduced by smoke, e.g. veldt or forest fires, industrial smoke or volcanic ashes'],
['wi-day-haze', 'Haze'],
['wi-dust', 'Widespread dust in suspension in the air, not raised by wind at or near the station at the time of observation'],
['wi-dust', 'Dust or sand raised by wind at or near the station at the time of observation, but no well developed dust whirl(s) or sand whirl(s), and no duststorm or sandstorm seen'],
['wi-dust', 'Well developed dust whirl(s) or sand whirl(s) seen at or near the station during the preceding hour or at the time ot observation, but no duststorm or sandstorm'],
['wi-sandstorm', 'Duststorm or sandstorm within sight at the time of observation, or at the station during the preceding hour'],
['wi-fog', 'Mist'],
['wi-day-fog', 'Patches', 'Shallow fog or ice fog at the station, whether on land or sea, not deeper than about 2 metres on land or 10 metres at sea'],
['wi-day-fog', 'More or less continuous', 'Shallow fog or ice fog at the station, whether on land or sea, not deeper than about 2 metres on land or 10 metres at sea'],
['wi-day-lightning', 'Lightning visible, no thunder heard'],
['wi-day-sprinkle', 'Precipitation within sight, not reaching the ground or the surface of the sea'],
['wi-day-sprinkle', 'Precipitation within sight, reaching the ground or the surface of the sea, but distant, i.e. estimated to be more than 5 km from the station'],
['wi-day-sprinkle', 'Precipitation within sight, reaching the ground or the surface of the sea, near to, but not at the station'],
['wi-night-lightning', 'Thunderstorm, but no precipitation at the time of observation'],
['wi-cloudy-gusts', 'Squalls', 'At or within sight of the station during the preceding hour or at the time of observation'],
['wi-tornado', 'Funnel cloud(s)', 'At or within sight of the station during the preceding hour or at the time of observation'],
['wi-snow', 'Drizzle (not freezing) or snow grains', 'Not falling as shower(s)'],
['wi-rain', 'Rain (not freezing)', 'Not falling as shower(s)'],
['wi-snow', 'Snow', 'Not falling as shower(s)'],
['wi-rain-mix', 'Rain and snow or ice pellets', 'Not falling as shower(s)'],
['wi-raindrops', 'Freezing drizzle or freezing rain', 'Not falling as shower(s)'],
['wi-showers', 'Shower(s) of rain'],
['wi-sleet', 'Shower(s) of snow, or of rain and snow'],
['wi-hail', 'Shower(s) of hail, or of rain and hail'],
['wi-fog', 'Fog or ice fog'],
['wi-thunderstorm', 'Thunderstorm (with or without precipitation)'],
['wi-sandstorm', 'Slight or moderate duststorm or sandstorm', 'Has decreased during the preceding hour'],
['wi-sandstorm', 'Slight or moderate duststorm or sandstorm', 'No appreciable change during the preceding hour'],
['wi-sandstorm', 'Slight or moderate duststorm or sandstorm', 'Has begun or has increased during the preceding hour'],
['wi-sandstorm', 'Severe duststorm or sandstorm', 'Has decreased during the preceding hour'],
['wi-sandstorm', 'Severe duststorm or sandstorm', 'No appreciable change during the preceding hour'],
['wi-sandstorm', 'Severe duststorm or sandstorm', 'Has begun or has increased during the preceding hour'],
['wi-dust', 'Slight or moderate blowing snow', 'Generally low (below eye level)'],
['wi-dust', 'Heavy drifting snow', 'Generally low (below eye level)'],
['wi-dust', 'Slight or moderate blowing snow', 'Generally high (above eye level)'],
['wi-dust', 'Heavy drifting snow', 'Generally high (above eye level)'],
['wi-fog', 'Fog or ice fog at a distance at the time of observation, but not at the station during the preceding hour, the fog or ice fog extending to a level above that of the observer'],
['wi-fog', 'Fog or ice fog in patches'],
['wi-fog', 'Fog or ice fog, sky visible', 'Has become thinner during the preceding hour'],
['wi-fog', 'Fog or ice fog, sky invisible', 'Has become thinner during the preceding hour'],
['wi-fog', 'Fog or ice fog, sky visible', 'No appreciable change during the preceding hour'],
['wi-fog', 'Fog or ice fog, sky invisible', 'No appreciable change during the preceding hour'],
['wi-fog', 'Fog or ice fog, sky visible', 'Has begun or has become thicker during the preceding hour'],
['wi-fog', 'Fog or ice fog, sky invisible', 'Has begun or has become thicker during the preceding hour'],
['wi-fog', 'Fog, depositing rime, sky visible'],
['wi-fog', 'Fog, depositing rime, sky invisible'],
['wi-raindrops', 'Drizzle, not freezing, intermittent', 'Slight at time of observation'],
['wi-raindrops', 'Drizzle, not freezing, continuous', 'Slight at time of observation'],
['wi-raindrops', 'Drizzle, not freezing, intermittent', 'Moderate at time of observation'],
['wi-raindrops', 'Drizzle, not freezing, continuous', 'Moderate at time of observation'],
['wi-raindrops', 'Drizzle, not freezing, intermittent', 'Heavy (dense) at time of observation'],
['wi-raindrops', 'Drizzle, not freezing, continuous', 'Heavy (dense) at time of observation'],
['wi-raindrops', 'Drizzle, freezing, slight'],
['wi-raindrops', 'Drizzle, freezing, moderate or heavy (dence)'],
['wi-snow', 'Drizzle and rain, slight'],
['wi-raindrops', 'Drizzle and rain, moderate or heavy'],
['wi-rain', 'Rain, not freezing, intermittent', 'Slight at time of observation'],
['wi-rain', 'Rain, not freezing, continuous', 'Slight at time of observation'],
['wi-rain', 'Rain, not freezing, intermittent', 'Moderate at time of observation'],
['wi-rain', 'Rain, not freezing, continuous', 'Moderate at time of observation'],
['wi-rain', 'Rain, not freezing, intermittent', 'Heavy at time of observation'],
['wi-rain', 'Rain, not freezing, continuous', 'Heavy at time of observation'],
['wi-rain', 'Rain, freezing, slight'],
['wi-rain', 'Rain, freezing, moderate or heavy (dence)'],
['wi-rain', 'Rain or drizzle and snow, slight'],
['wi-rain', 'Rain or drizzle and snow, moderate or heavy'],
['wi-snowflake-cold', 'Intermittent fall of snowflakes', 'Slight at time of observation'],
['wi-snowflake-cold', 'Continuous fall of snowflakes', 'Slight at time of observation'],
['wi-snowflake-cold', 'Intermittent fall of snowflakes', 'Moderate at time of observation'],
['wi-snowflake-cold', 'Continuous fall of snowflakes', 'Moderate at time of observation'],
['wi-snowflake-cold', 'Intermittent fall of snowflakes', 'Heavy at time of observation'],
['wi-snowflake-cold', 'Continuous fall of snowflakes', 'Heavy at time of observation'],
['wi-snowflake-cold', 'Diamond dust (with or without fog)'],
['wi-snow-wind', 'Snow grains (with or without fog)'],
['wi-snowflake-cold', 'Isolated star-like snow crystals (with or without fog)'],
['wi-snowflake-cold', 'Ice pellets'],
['wi-snow-wind', 'Rain shower(s), slight'],
['wi-showers', 'Rain shower(s), moderate or heavy'],
['wi-showers', 'Rain shower(s), violent'],
['wi-showers', 'Shower(s) of rain and snow mixed, slight'],
['wi-showers', 'Shower(s) of rain and snow mixed, moderate or heavy'],
['wi-showers', 'Snow shower(s), slight'],
['wi-showers', 'Snow shower(s), moderate or heavy'],
['wi-showers', 'Shower(s) of snow pellets or small hail, with or without rain or rain and snow mixed', 'Slight'],
['wi-showers', 'Shower(s) of snow pellets or small hail, with or without rain or rain and snow mixed', 'Moderate or heavy'],
['wi-rain-mix', 'Shower(s) of hail, with or without rain or rain and snow mixed, not associated with thunder', 'Slight'],
['wi-rain-mix', 'Shower(s) of hail, with or without rain or rain and snow mixed, not associated with thunder', 'Moderate or heavy'],
['wi-rain', 'Slight rain at time of observation', 'Thunderstorm during the preceding hour but not at time of observation'],
['wi-rain', 'Moderate or heavy rain at time of observation', 'Thunderstorm during the preceding hour but not at time of observation'],
['wi-rain', 'Slight snow, or rain and snow mixed or hail at time of observation', 'Thunderstorm during the preceding hour but not at time of observation'],
['wi-rain', 'Moderate or heavy snow, or rain and snow mixed or hail at time of observation', 'Thunderstorm during the preceding hour but not at time of observation'],
['wi-thunderstorm', 'Thunderstorm, slight or moderate, without hail but with rain and/or snow at time of observation', 'Thunderstorm at time of observation'],
['wi-thunderstorm', 'Thunderstorm, slight or moderate, with hail at time of observation', 'Thunderstorm at time of observation'],
['wi-thunderstorm', 'Thunderstorm, heavy, without hail but with rain and/or snow at time of observation', 'Thunderstorm at time of observation'],
['wi-thunderstorm', 'Thunderstorm combined with duststorm or sandstorm at time of observation', 'Thunderstorm at time of observation'],
['wi-thunderstorm', 'Thunderstorm, heavy, with hail at time of observation', 'Thunderstorm at time of observation']]