const input = document.querySelector('.weather-panel-search-input')
const searchBtn = document.querySelector('.weather-panel-btn')
const dateInfo = document.querySelector('.weather-panel-dateTime')
const cityName = document.querySelector('.weather-panel-city')
const error = document.querySelector('.error')
const temperature = document.querySelector('.weather-panel-temperature')
const img = document.querySelector('.weather-panel-img-pic')
const sunriseInfo = document.querySelector('.weather-panel-sun-rise')
const sunsetInfo = document.querySelector('.weather-panel-sun-set')
const weather = document.querySelector('.weather-add-box-weather')
const humidity = document.querySelector('.weather-add-box-humidity')
const wind = document.querySelector('.weather-add-box-wind')
const pressure = document.querySelector('.weather-add-box-pressure')

const toggleBtn = document.querySelector('.weather-panel-main-toggle-btn-circle')
const toggleSlider = document.querySelector('.weather-panel-main-toggle-btn')
let root = document.documentElement

let timeZoneCity
let timeZoneUser
let timeDifference
let moment

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
			const wea = info.description

			timeZoneCity = res.timezone
			console.log(`time zone city is ${timeZoneCity}`)
			const timeCity = res.dt
			const sunrise = res.sys.sunrise
			const sunset = res.sys.sunset

			cityName.textContent = res.name
			temperature.textContent = Math.floor(temp) + '°C'

			weather.innerHTML = `<p class="weather-add-heading">Weather</p>
			<p class="weather-add-weather">${wea}</p>`

			humidity.innerHTML = `<p class="weather-add-heading">Humidity</p>
			<p class="weather-add-humidity">${hum}%</p>`

			wind.innerHTML = ` <p class="weather-add-heading">Wind</p>
			<p class="weather-add-wind">${Math.floor(speed)}m/s</p>`

			pressure.innerHTML = `<p class="weather-add-heading">Pressure</p>
			<p class="weather-add-pressure">${press}hPa</p>`

			input.value = ''
			error.textContent = ''
			dateInfo.textContent = ''

			checkSunMoment(timeCity, sunrise, sunset)
			checkStatus(info.description, info.id)
			setTime()
			setInterval(setTime, 1000)
			sunInfo(sunrise, sunset)
		})
		.catch(() => {
			error => console.error(error)
			error.textContent = 'Enter a correct name'
		})
}

const checkStatus = (info, id) => {
	if (info === 'thunderstorm' || (id >= 200 && id < 300)) {
		if (moment === 'day') {
			img.setAttribute('src', './img/thunderstorm_d.png')
		} else {
			img.setAttribute('src', './img/thunderstorm_n.png')
		}
	} else if (info === 'rain' || (id >= 500 && id < 521)) {
		if (moment === 'day') {
			img.setAttribute('src', './img/rain_d.png')
		} else {
			img.setAttribute('src', './img/rain_n.png')
		}
	} else if (info === 'shower rain' || (id >= 521 && id < 600)) {
		if (moment === 'day') {
			img.setAttribute('src', './img/showerrain_d.png')
		} else {
			img.setAttribute('src', './img/showerrain_n.png')
		}
	} else if (info === 'snow' || (id >= 600 && id < 700)) {
		if (moment === 'day') {
			img.setAttribute('src', './img/snow_d.png')
		} else {
			img.setAttribute('src', './img/snow_n.png')
		}
	} else if (info === 'mist' || (id >= 700 && id < 800)) {
		if (moment === 'day') {
			img.setAttribute('src', './img/mist_d.png')
		} else {
			img.setAttribute('src', './img/mist_n.png')
		}
	} else if (info === 'clear sky' && id === 800) {
		if (moment === 'day') {
			img.setAttribute('src', './img/clearsky_d.png')
		} else {
			img.setAttribute('src', './img/clearsky_n.png')
		}
	} else if (info === 'few clouds' || id === 801) {
		if (moment === 'day') {
			img.setAttribute('src', './img/fewclouds_d.png')
		} else {
			img.setAttribute('src', './img/fewclouds_n.png')
		}
	} else if (info === 'scattered clouds' || id === 802) {
		if (moment === 'day') {
			img.setAttribute('src', './img/scatteredclouds_d.png')
		} else {
			img.setAttribute('src', './img/scatteredclouds_n.png')
		}
	} else if (info === 'broken clouds' || (id >= 803 && id < 900)) {
		if (moment === 'day') {
			img.setAttribute('src', './img/brokenclouds_d.png')
		} else {
			img.setAttribute('src', './img/brokenclouds_n.png')
		}
	} else {
		img.setAttribute('src', './img/unknown.png')
	}
}

const setTime = () => {
	const time = new Date()

	timeZoneUser = time.getTimezoneOffset() * 60
	timeDifference = (timeZoneCity + timeZoneUser) / 3600

	const hours = time.getHours()
	const hoursLocal = hours + timeDifference
	const hoursAmpm = hoursLocal % 12 || 12
	const hrCheck = hoursAmpm < 10 ? `0${hoursAmpm}` : `${hoursAmpm}`
	const ampmCheck = hoursLocal % 24 >= 12 ? 'pm' : 'am'
	const minutes = time.getMinutes()
	const minCheck = minutes < 10 ? `0${minutes}` : `${minutes}`

	const day = time.getDate()
	const month = time.getMonth()
	const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	const curMonth = monthNames[month]

	let currDay
	if (hoursLocal > 24) {
		currDay = day + 1
	} else if (hoursLocal < 0) {
		currDay = day - 1
	} else {
		currDay = day
	}

	dateInfo.textContent = `${curMonth} ${currDay}, ${hrCheck}:${minCheck}${ampmCheck}`
}

const sunInfo = (rise, set) => {
	const riseTimestamp = rise
	const setTimestamp = set
	const dateRise = new Date(riseTimestamp * 1000) // The Date() constructor takes a timestamp in milliseconds
	const dateSet = new Date(setTimestamp * 1000)

	const hourRise = dateRise.getHours()
	const hoursLocalRise = Math.abs(hourRise + timeDifference + 24) % 24
	const hoursAmpm = hoursLocalRise % 12 || 12
	const hrCheck = hoursAmpm < 10 ? `0${hoursAmpm}` : `${hoursAmpm}`
	const ampmRise = hoursLocalRise >= 12 ? 'pm' : 'am'
	const minutesRise = dateRise.getMinutes()
	const minCheckRise = minutesRise < 10 ? `0${minutesRise}` : `${minutesRise}`

	const hourSet = dateSet.getHours()
	const hoursLocalSet = Math.abs(hourSet + timeDifference + 24) % 24
	const hoursAmpmSet = hoursLocalSet % 12 || 12
	const hrCheckSet = hoursAmpmSet < 10 ? `0${hoursAmpmSet}` : `${hoursAmpmSet}`
	const ampmSet = hoursLocalSet >= 12 ? 'pm' : 'am'
	const minutesSet = dateSet.getMinutes()
	const minCheckSet = minutesSet < 10 ? `0${minutesSet}` : `${minutesSet}`

	sunriseInfo.innerHTML = `<span class="weather-panel-sun-rise-icon"><svg
		xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
		stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
		class="feather feather-sunrise">
		<path d="M17 18a5 5 0 0 0-10 0"></path>
		<line x1="12" y1="2" x2="12" y2="9"></line>
		<line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line>
		<line x1="1" y1="18" x2="3" y2="18"></line>
		<line x1="21" y1="18" x2="23" y2="18"></line>
		<line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line>
		<line x1="23" y1="22" x2="1" y2="22"></line>
		<polyline points="8 6 12 2 16 6"></polyline>
		</svg></span><span class="weather-panel-sun-rise-info">${hrCheck}:${minCheckRise}${ampmRise}</span>`

	sunsetInfo.innerHTML = `<span class="weather-panel-sun-set-icon"><svg
		xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
		stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
		class="feather feather-sunset">
		<path d="M17 18a5 5 0 0 0-10 0"></path>
		<line x1="12" y1="9" x2="12" y2="2"></line>
		<line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line>
		<line x1="1" y1="18" x2="3" y2="18"></line>
		<line x1="21" y1="18" x2="23" y2="18"></line>
		<line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line>
		<line x1="23" y1="22" x2="1" y2="22"></line>
		<polyline points="16 5 12 9 8 5"></polyline>
		</svg></span><span class="weather-panel-sun-set-info">${hrCheckSet}:${minCheckSet}${ampmSet}</span>`
}

const checkSunMoment = (timeCity, sunrise, sunset) => {
	if (timeCity > sunrise && timeCity < sunset) {
		console.log('Tutaj jest teraz dzień ')
		moment = 'day'
	} else {
		console.log('tutaj jest teraz noc')
		moment = 'night'
	}
}

const checkEnter = e => {
	if (e.key === 'Enter') {
		getWeather()
	}
}

const checkActive = () => {
	if (toggleBtn.classList.contains('active') || toggleBtn.classList.contains('non-active')) {
		toggleBtn.classList.toggle('non-active')
		toggleBtn.classList.toggle('active')
	} else {
		toggleBtn.classList.add('active')
	}
}
const toggleAction = () => {
	if (toggleBtn.classList.contains('active')) {
		root.style.setProperty('--background-color', '#0b1b24e7')
		root.style.setProperty('--app-color', '#031926')
		root.style.setProperty('--main-color', '#fff')
		root.style.setProperty('--box-shadow', '#000')
		root.style.setProperty('--error-color', '#9dbebb')
	} else if (toggleBtn.classList.contains('non-active')) {
		root.style.setProperty('--background-color', '#f6f2e9')
		root.style.setProperty('--app-color', '#f4e9cd')
		root.style.setProperty('--main-color', '#000')
		root.style.setProperty('--box-shadow', '#808080')
		root.style.setProperty('--error-color', '#593333')
	}
}

searchBtn.addEventListener('click', getWeather)
input.addEventListener('keyup', checkEnter)

toggleSlider.addEventListener('click', () => {
	checkActive()
	toggleAction()
})
