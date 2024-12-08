let searchInput = document.getElementById("searchInput");

let todayDay;

async function getWeatherData(city = "cairo") {
  try {
    let weatherResponse = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=7d77b96c972b4d119a3151101212704&q=${city}&days=7`
    );
    todayDay = await weatherResponse.json();

    getTodayData();
    getNextData();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    if (city !== "cairo") {
      getWeatherData("cairo");
    }
  }
}

searchInput.addEventListener("input", function () {
  const city = searchInput.value.trim();
  if (city) {
    getWeatherData(city);
  }
});

function getTodayData() {
  const todayDate = new Date(todayDay.location.localtime);
  const dayFormat = new Intl.DateTimeFormat("en-GB", { weekday: "long" });
  const monthDayFormat = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
  });

  const getDay = dayFormat.format(todayDate);
  const getMonthDay = monthDayFormat.format(todayDate);

  document.getElementById("rowData").innerHTML = `
    <div class="col-lg-4">
      <div class="card first mb-3">
        <div class="card-header">
          <div id="todayDay">${getDay}</div>
          <div id="todayMonth">${getMonthDay}</div>
        </div>
        <div class="card-body">
          <h5 class="card-title" id="todayLocation">${todayDay.location.name}</h5>
          <div class="dg">
            <p id="todayTemp">${todayDay.current.temp_c}°C</p>
            <img id="todayImg" class="d-block" width="70" src="https:${todayDay.current.condition.icon}" />
          </div>
          <p id="todayCondition" class="cloud-case">${todayDay.current.condition.text}</p>
          <span class="me-3">
            <img class="me-2" src="./images/icon-umberella.png" /> ${todayDay.current.humidity}%
          </span>
          <span class="me-3">
            <img class="me-2" src="./images/icon-wind.png" /> ${todayDay.current.wind_kph} km/h
          </span>
          <span class="me-3">
            <img class="me-2" src="./images/icon-compass.png" /> ${todayDay.current.wind_dir}
          </span>
        </div>
      </div>
    </div>
  `;
}

function getNextData() {
  let cartoona = "";
  const forecastDays = todayDay.forecast.forecastday;

  for (let i = 1; i < forecastDays.length; i++) {
    const forecast = forecastDays[i];
    const todayDate = new Date(forecast.date);
    const dayFormat = new Intl.DateTimeFormat("en-us", { dateStyle: "full" });
    const getDay = dayFormat.format(todayDate).split(",", 1).join();
    const cardClass = i === 1 ? "second" : i === 2 ? "third" : "";
    cartoona += `
      <div class="col-lg-4">
        <div class="card ${cardClass} mb-3">
          <div class="card-header nextDay ">${getDay}</div>
          <div class="card-body }">
            <img class="mb-3 nextImg" width="70" src="https:${forecast.day.condition.icon}" alt="" />
            <p class="p1 highTemp">${forecast.day.maxtemp_c}°C</p>
            <small class="lowTemp">${forecast.day.mintemp_c}°C</small>
            <p class="cloud-case nextDayCondition">${forecast.day.condition.text}</p>
          </div>
        </div>
      </div>
    `;
  }
  document.getElementById("rowData").innerHTML += cartoona;
}

getWeatherData();
