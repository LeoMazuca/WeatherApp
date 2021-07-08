/*API - Open Weather Map*/

let container = document.getElementById("container");
let mainWeather = document.getElementById("mainWeather");
let secondaryWeather = document.getElementById("secondaryWeather");
let searchForm = document.getElementById("searchSubmit");
let searchInput = document.getElementById("searchInput");
let temperaturaDegree = document.getElementById("degreeNumber");
let weatherIcon = document.getElementById("icon");
let weatherDescription = document.getElementById("weatherDescription");
let city = document.getElementById("city");
let date = document.getElementById("date");
let min = document.getElementById("min");
let max = document.getElementById("max");
let clouds = document.getElementById("clouds");
let wet = document.getElementById("wet");
let windSpeed = document.getElementById("windSpeed");

/*****************************************FUNCIONES SECUNDARIAS */
displayBackgroundImage = (data) => {
    //Extraer la Fecha y Hora del objeto que contiene los datos del tiempo
    //convertirlo a una hora que se entienda
    let dateDay = new Date(data.list[0].dt*1000).toLocaleString("en-Us", {
        dateStyle: "long"
    }); 
    //Mostrar Fecha y Hora en el Weather Principal
    date.textContent = dateDay;
    //Extraer La Hora
    const dayhour = new Date(data.list[0].dt*1000).getHours();

    let isDay = data.list[0].weather[0].icon.charAt(2);
        if (isDay === 'd') {
            mainWeather.classList.remove("nightBackground")
            mainWeather.classList.add("dayBackground")
            secondaryWeather.classList.remove("whiteLetters");
            container.className = "container d01"
        }else{
            mainWeather.classList.remove("dayBackground")
            mainWeather.classList.add("nightBackground")
            secondaryWeather.classList.add("whiteLetters");
            container.className = "container n01n"
        }

    let imagen = data.list[0].weather[0].icon;
    if (imagen.charAt(2) == 'd') {
        container.className = "container d" + imagen;
    }else{
        container.className = "container n" + imagen;
    }
}

displayData = (data) => {
    temperaturaDegree.textContent = Math.floor(data.list[0].main.temp) + " °C";
    city.textContent = data.list[0].name + ", " + data.list[0].sys.country;
    const icon = data.list[0].weather[0].icon;
    weatherIcon.innerHTML = `<img src=Icons/${icon}.png></img>`;
    min.textContent = Math.floor(data.list[0].main.temp_min);
    max.textContent = Math.floor(data.list[0].main.temp_max);
    weatherDescription.textContent = data.list[0].weather[0].description.charAt(0).toUpperCase()+
    data.list[0].weather[0].description.slice(1);
    clouds.textContent = "Clouds: " + data.list[0].clouds.all + "%";
    wet.textContent = "Humidity: " + data.list[0].main.humidity +"%";
    windSpeed.textContent = "Wind Speed: " +  data.list[0].wind.speed + "m/s";
    
}

displayDataWeek = (dataWeek) => {
    const weatherWeek = document.getElementById("weatherWeek");
    weatherWeek.innerHTML = "";
    
    dataWeek.list.forEach(list => {
        let dateDay = new Date(list.dt * 1000).toLocaleString("en-Us", {
            /* dateStyle: "long", */
            weekday: "long",
        });
		weatherWeek.innerHTML += `
        <div class="day" id="day2">
            <div class="webDesign">
            <div class="dayOfWeek" id="day">${dateDay}</div>
            <div class="iconWeek">
                <div id="iconWeek"><img src="Icons/${list.weather[0].icon}.png"></div>
                <div class="weatherDescriptionWeek" id="weatherDescriptionWeek">${list.weather[0].description}</div>
            </div>
            <div class="weatherWeekDegrees">
                <div class="degreeNumberWeek" id="degreeNumberWeek">${Math.floor(list.temp.day)}</div>
                <div class="feelsLikeWeek"><small id="fellsLikeWeek">Feels Like ${Math.floor(list.feels_like.day)}°C</small></div>
            </div>
            <div class="hiddenData">
                <div class="minMaxWeek">
                    <div class="weather_min"><small>Min </small><span id="minWeek">${Math.floor(list.temp.min)}</span>°C</div>
                    <div class="weather_max"><small>Max </small><span id="maxWeek">${Math.floor(list.temp.max)}</span>°C</div>
                </div>
                <div class="weatherData">
                    <div class="firstValue">
                        <div class="weatherDataImage" ><img src="Icons/morning.png" alt=""></div>
                        <div class="weatherDataFirstValue"><strong>Morning:</strong><p id="morning">${Math.floor(list.temp.morn)} °C</p></div>
                    </div>
                    <div class="secondValue">
                        <div class="weatherDataImage"><img src="Icons/evening.png" alt=""></div>
                        <div class="weatherDataFirstValue"><strong>Evening:</strong><p id="evening">${Math.floor(list.temp.eve)} °C</p></div>
                    </div>
                    <div class="thirdValue">
                        <div class="weatherDataImage"><img src="Icons/night.png" alt=""></div>
                        <div class="weatherDataFirstValue"><strong>Night:</strong><p id="night">${Math.floor(list.temp.morn)} °C</p></div>
                    </div>
                </div>
            </div>
            </div>
        </div>
		`
	})
}

/*****************************************FUNCION PRINCIPAL */
getWeatherData = async(city) => {
    //Hacer Request a la API y obtener un objeto que contega los datos
    //Fetch
    const res = await fetch(`https://community-open-weather-map.p.rapidapi.com/find?q=${city}&units=metric`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "f1c4b3b521msh8248e71e60e0da9p1b03d5jsn70ec269be27c",
		    "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com"
        }
    });
    const data = await res.json();
    //Verificar si encontró la ciudad
    if (data.count == 0) {
        alert("City not Found");
    }else{
        getWeatherDataWeek(city);

        //Cambiar las Imagenes del Weather Principal
        displayBackgroundImage(data);

        //Mostrar los Datos en pantalla
        displayData(data);
    }
}

getWeatherDataWeek = async(city) => {
    const resWeek = await fetch(`https://community-open-weather-map.p.rapidapi.com/forecast/daily?q=${city}&cnt=7&units=metric`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "f1c4b3b521msh8248e71e60e0da9p1b03d5jsn70ec269be27c",
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com"
        }
    });
    const dataWeek = await resWeek.json();
    console.log(dataWeek);
    dataWeek.list.splice(0,1);
        displayDataWeek(dataWeek);
}

/*AQUI EL USUARIO BUSCA LA CIUDAD */
searchForm.addEventListener("submit", e => {
    e.preventDefault();
    //verificar si no esta vacio el input
    if (searchInput.value == "") {
        alert("Ingrese una Ciudad, Por Favor");
    } else {
        getWeatherData(searchInput.value);
        /*getWeatherDataWeek(searchInput.value);*/
    }
})

/*Al cargar la pagina va a cargar la ciudad de New York */
window.onload = () => {
    getWeatherData("Matamoros");
    /* getWeatherDataWeek("Matamoros"); */
}
