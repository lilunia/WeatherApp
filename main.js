const input = document.querySelector('.weather-panel-search-input')
const searchBtn = document.querySelector('.weather-panel-btn')
const cityName = document.querySelector('.weather-panel-city')
const error = document.querySelector('.error')
const temperature = document.querySelector('.weather-panel-temperature')
const img = document.querySelector('.weather-panel-img-pic')
const weather = document.querySelector('.weather-adds-weather')
const humidity = document.querySelector('.weather-adds-humidity')
const wind = document.querySelector('.weather-adds-wind')
const pressure = document.querySelector('.weather-adds-pressure')

const API_LINK = 'https://api.openweathermap.org/data/2.5/weather?q='
const API_KEY = '&appid=4cc99631ba4cc9ac44c94bfa9d16e0f7'
const API_UNITS = '&units=metric'

const getWeather = () => {
	const city = input.value || 'Warsaw'
	const URL = API_LINK + city + API_KEY + API_UNITS

	fetch(URL)
		.then(res => {
			if (res.ok) {
				return res.json()
			} else {
				reject(`error data`)
			}
		})
		.then(res => {
			console.log(res)
			const temp = res.main.temp
			const hum = res.main.humidity
			const press = res.main.pressure
			const speed = res.wind.speed
			const info = Object.assign({}, ...res.weather)
			const wea = info.main

			console.log(info)

			cityName.textContent = res.name
			temperature.textContent = Math.floor(temp) + '°C'
			weather.textContent = wea
			humidity.textContent = hum + '%'
			wind.textContent = Math.floor(speed) + 'm/s'
			pressure.textContent = press + 'hPa'

			input.value = ''
			error.textContent = ''

			checkStatus(info.id)
		})
		.catch(() => {
			error => console.error(error)
			error.textContent = 'Enter a correct name'
		})
}

const checkStatus = id => {
	if (id >= 200 && id < 300) {
		img.setAttribute('src', './img/thunderstorm.png')
	} else if (id >= 300 && id < 400) {
		img.setAttribute('src', './img/drizzle.png')
	} else if (id >= 500 && id < 600) {
		img.setAttribute('src', './img/rain.png')
	} else if (id >= 600 && id < 700) {
		img.setAttribute('src', './img/snow.png')
	} else if (id >= 700 && id < 800) {
		img.setAttribute('src', './img/fog.png')
	} else if (id === 800) {
		img.setAttribute('src', './img/sun.png')
	} else if (id > 800 && id < 900) {
		img.setAttribute('src', './img/cloud.png')
	} else {
		img.setAttribute('src', './img/unknown.png')
	}
}
const checkEnter = e => {
	if (e.key === 'Enter') {
		getWeather()
	}
}

searchBtn.addEventListener('click', getWeather)
input.addEventListener('keyup', checkEnter)
