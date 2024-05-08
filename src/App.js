
import './App.css';
import { useEffect, useState } from 'react';
import searchIcon from './Assets/search.png';
import stormy from './Assets/stormy.webp';
import cloudy from './Assets/cloudy.jpg';
import partly from './Assets/partly.jpg';
import rainy from './Assets/rainy.jpeg';
import snowy from './Assets/snowy.jpg';
import sunny from './Assets/sunny.jpg';
import highIcon from './Assets/heating.png'
import lowIcon from './Assets/low-temperature.png'
import feelsIcon from './Assets/weather-app.png'
import sunriseIcon from './Assets/sunrise.png'
import windIcon from './Assets/wind.png'
import windImg from './Assets/wind-farm.png'
import sunIcon from './Assets/sun.png';

function App() {
  const key = '72b4b36469f1cca98640257e846eea16';
  // const city = document.getElementById('search').value

  const [city, setCity]=useState('Toronto');
  const [temperature, setTemp]=useState('');
  const [humid, setHumid]=useState('');
  const [windS, setWindS]=useState('');
  const [windG, setWindG]=useState('');
  const [weather, setWeather]=useState('');
  const [bgImage, setBgImage]=useState('');
  const [timezoneOffset, setTimezoneOffset] = useState('');
  const [emoji, setEmoji]=useState("");
  const [low, setLow]=useState("");
  const [high, setHigh]=useState("");
  const [feels, setFeels]=useState("");
  const [sunriseTime, setSunriseTime] = useState('');
  const [sunsetTime, setSunsetTime] = useState('');
  const [country, setCountry]=useState("");
  const [errorMessage, setErrorMessage] = useState('');
  
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`

  useEffect(()=>{
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`);
        const data = await response.json();
        if (data.cod === "404") {
          setErrorMessage("City not found");
        } else {
          // fetch(url)
          // .then((res)=> res.json())
          // .then((data)=> {
            console.log(data)
            const {name: city,
                  timezone: timezone,
                  main: {temp, humidity, temp_min, temp_max, feels_like},
                  weather: [{description, id}],
                  sys: {sunrise, sunset, country}, 
                  wind : {speed, gust}} = data;

                  setCountry(country)
                  setTemp((temp-273.15).toFixed(0))
                  setFeels((feels_like-273.15).toFixed(0))
                  setHumid(humidity)
                  setWindS((speed*3.6).toFixed(0))
                  setWindG((gust*3.6).toFixed(0))
                  setWeather(description)
                  setLow((temp_min-273).toFixed(0))
                  setHigh((temp_max-273).toFixed(0))

                  const bgUrl = getBackgroundImage(id);
                setBgImage(bgUrl);
                setTimezoneOffset(timezone / 3600);
              const weatherEmoji = getWeatherEmoji(id);
              setEmoji(weatherEmoji);

              //sunrise sunset
              const sunriseDate = new Date(sunrise * 1000);
              const sunsetDate = new Date(sunset * 1000);

              const formattedSunrise = sunriseDate.toLocaleTimeString();
              const formattedSunset = sunsetDate.toLocaleTimeString();

              setSunriseTime(formattedSunrise);
              setSunsetTime(formattedSunset);
          }
        } catch (error) {
          console.error('Error fetching weather data:', error);
          setErrorMessage('Failed to fetch weather data');
        }
      };
      fetchWeatherData();

  },[city])

  useEffect(() => {
    const interval = setInterval(() => {
      getCurrentDate();
    }, 1000); // Update every second
    return () => clearInterval(interval);
  }, [timezoneOffset]); 

  const getCurrentDate = () => {
    const currentDate = new Date(); // Create a new Date object with the current date and time

const dayOfWeek = currentDate.getDay();
const month = currentDate.getMonth();
const dayOfMonth = currentDate.getDate();
const year = currentDate.getFullYear();
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayOfWeekName = daysOfWeek[dayOfWeek];
const monthName = months[month];

const formattedDate = `${dayOfWeekName}, ${monthName} ${dayOfMonth}, ${year}`;

return formattedDate;

  };

  const getBackgroundImage = (id) => {
    switch (true) {
      case id >= 200 && id < 300:
        return stormy;
      case id >= 300 && id < 400:
        return rainy;
      case id >= 500 && id < 600:
        return rainy;
      case id >= 600 && id < 700:
        return snowy;
      case id >= 700 && id < 800:
        return cloudy;
      case id === 800:
        return sunny;
      case id >= 801 && id < 810:
        return partly;
      default:
        return partly;
    }
  };

  const submit = (e) =>{
    e.preventDefault();
    const cityField = document.getElementById('search').value;
    setCity(cityField);
  }

  function getWeatherEmoji(weatherId){

    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            return "⛈";
        case (weatherId >= 300 && weatherId < 400):
            return "🌧";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧";
        case (weatherId >= 600 && weatherId < 700):
            return "❄";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫";
        case (weatherId === 800):
            return "☀";
        case (weatherId >= 801 && weatherId < 810):
            return "☁";
        default:
            return "❓";
    }
}
  
  return (
    <div id='body' style={{backgroundImage: `url(${bgImage})`}}>
      {/* //  prompt for city  */}
      <div id='Search'>
        <form>
          <input 
          name='search'
          type='text'
          placeholder='Search city'
          id='search'/>
            <img src={searchIcon} 
            onClick={submit}/>
        </form>
      </div>

      {/* //display details */}
      {errorMessage ? (
        <div id='err_m'>

          <p>{errorMessage}</p>
          </div>
        ) : (<>
        <div id='overview'>

        <div id='details'>
        <h1 className='city'>{city}, {country}</h1>
        <p className='currentDateTime'>{getCurrentDate()}</p>
        </div>
        <div id='weather_details'>
          <div className='weather'>
            <p className='w_emoji'>{emoji}</p>
            <p className='w_desc'>{weather}</p>
          </div>
          {/* <div class="vertical-line"></div> */}
          <div id='temps'>
            <p className='temp'>{temperature}°c </p>
            <div className='temps'>
              <p className='t'><img className='t_icon' src={lowIcon}/>{low}</p>
              <p className='t'><img className='t_icon' src={highIcon}/>{high}</p>
            </div>
          </div>
          
        </div>
      </div>
      <div id='cards'>
          
          <div id='feels'  className='card'>
            <p className='tag'> <img src={feelsIcon}/> FEELS LIKE</p>
            <span className='content'>
              
            <p className='info'>{feels}°c</p>
            </span>
            
          </div>

          <div id='sun'  className='card'>
            <p className='tag'> <img src={sunIcon}/>SUN TIMES</p>
            <span className='content'>
              <p className='info'>{sunriseTime}</p>
            <img src={sunriseIcon}/>
            <p className='info'>{sunsetTime}</p>
            </span>
          </div>

          <div id='wind' className='card'>
            <p className='tag'> <img src={windIcon}/>WIND</p>
            <div className='wind_content'>
               <div className='wind_content_content'>
                <div id='speed' className='content'>
                  <span className='info'>{windS}</span>
                  <div className='wind_details'>
                    <span>KM/H</span>
                    <span>Wind</span>
                  </div>
                </div>
                <div id='gust' className='content'>
                  <span className='info'>{windG} </span>
                  <div className='wind_details'>
                    <span>KM/H</span>
                    <span>Gusts</span>
                  </div>
                </div>
              </div>
              <div className='wind_img'>
                <img src={windImg}/>
              </div> 
            </div>
          </div>
        </div>
    
        </>)}
      </div>
  
  );
}

export default App;
