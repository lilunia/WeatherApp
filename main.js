const input = document.querySelector('.weather-panel-search-input')
const searchBtn = document.querySelector('.weather-panel-btn')
const dateInfo = document.querySelector('.weather-panel-dateTime')
const cityName = document.querySelector('.weather-panel-city')
const error = document.querySelector('.error')
const temperature = document.querySelector('.weather-panel-temperature')
const img = document.querySelector('.weather-panel-img-pic')
const sunriseInfo = document.querySelector('.weather-panel-sun-rise')
const sunsetInfo = document.querySelector('.weather-panel-sun-set')
const forecastPanel = document.querySelector('.weather-panel-forecast')

const forecastImg = document.getElementsByClassName('weather-panel-forecast-info-img-pic')

const weather = document.querySelector('.weather-add-box-weather')
const humidity = document.querySelector('.weather-add-box-humidity')
const wind = document.querySelector('.weather-add-box-wind')
const pressure = document.querySelector('.weather-add-box-pressure')

const toggleBtn = document.querySelector('.weather-panel-main-toggle-btn-circle')
const toggleSlider = document.querySelector('.weather-panel-main-toggle-btn')
let root = document.documentElement

let timeZoneCity, timeZoneUser
let timeDifference, localTime
let sunrise, sunset
let moment
let pathImg
let momentForecast, forecastTime, forecastPanelHour
let countTime
let hrCheck, minCheck, ampmCheck
let dateRise, dateSet

const API_LINK = 'https://api.openweathermap.org/data/2.5/weather?q='
const API_KEY = '&appid=4cc99631ba4cc9ac44c94bfa9d16e0f7'
const API_UNITS = '&units=metric'

const API_FORECAST = 'https://api.openweathermap.org/data/2.5/forecast?q='

const getWeather = () => {
	const city = input.value || 'Warsaw'
	const URL = API_LINK + city + API_KEY + API_UNITS
	clearInterval(countTime)

	fetch(URL)
		.then(res => res.json())
		.then(res => {
			const temp = res.main.temp
			const hum = res.main.humidity
			const press = res.main.pressure
			const speed = res.wind.speed
			const info = Object.assign({}, ...res.weather)
			const wea = info.description
			const timeCity = res.dt

			timeZoneCity = res.timezone
			sunrise = res.sys.sunrise
			sunset = res.sys.sunset

			cityName.textContent = res.name + ', ' + res.sys.country
			temperature.textContent = Math.floor(temp) + '°C'

			weather.innerHTML = `<p class="weather-add-heading">Weather</p>
			<p class="weather-add-weather">${wea}</p>`

			humidity.innerHTML = `<p class="weather-add-heading">Humidity</p>
			<p class="weather-add-humidity">${hum}%</p>`

			wind.innerHTML = ` <p class="weather-add-heading">Wind</p>
			<p class="weather-add-wind">${Math.floor(speed)}m/s</p>`

			pressure.innerHTML = `<p class="weather-add-heading">Pressure</p>
			<p class="weather-add-pressure">${press}hPa</p>`

			checkSunMoment(timeCity, sunrise, sunset)
			checkStatus(info.description, info.id)
			img.setAttribute('src', `${pathImg}`)
			setTime()
			sunInfo(sunrise, sunset)
			input.value = ''
			error.textContent = ''
		})
		.catch(error => {
			error.textContent = 'Enter a correct name'
		})
}
const getForecast = () => {
	const city = input.value || 'Warsaw'
	const URL = API_FORECAST + city + API_KEY + API_UNITS

	fetch(URL)
		.then(res => res.json())
		.then(res => {
			forecastPanel.innerHTML = ''
			const weatherArr = new Array()
			const info3h = Object.assign({}, res.list[0])
			const info6h = Object.assign({}, res.list[1])
			const info9h = Object.assign({}, res.list[2])
			const info12h = Object.assign({}, res.list[3])
			const info15h = Object.assign({}, res.list[4])

			let weaForecast
			let weaInfo
			let weaId
			let tempForecast

			weatherArr.push(info3h, info6h, info9h, info12h, info15h)

			weatherArr.forEach(el => {
				tempForecast = Math.floor(el.main.temp)
				weaForecast = Object.assign({}, ...el.weather)
				weaInfo = weaForecast.description
				weaId = weaForecast.id
				setTimeForecast(el.dt)

				checkSunMoment(el.dt, sunrise, sunset)
				checkStatus(weaInfo, weaId)

				forecastPanelHour = document.createElement('div')
				forecastPanelHour.classList.add('weather-panel-forecast-info')
				forecastPanelHour.innerHTML = `
				<p class="weather-panel-forecast-info-hour">${forecastTime}</p>
                    <p class="weather-panel-forecast-info-temp">${tempForecast}°C</p>
                    <div class="weather-panel-forecast-info-img"><img class="weather-panel-forecast-info-img-pic"
                            src=${pathImg} alt=""></div>
				`
				forecastPanel.append(forecastPanelHour)
			})
		})
		.catch(() => {
			error => console.error(error)
			error.textContent = 'Enter a correct name'
			clearStuff()
		})
}
const clearStuff = () => {
	input.value = ''
	dateInfo.textContent = ''
	weather.innerHTML = ''
	humidity.innerHTML = ''
	wind.innerHTML = ''
	pressure.innerHTML = ''
	sunriseInfo.innerHTML = ''
	sunsetInfo.innerHTML = ''
	cityName.textContent = ''
	temperature.textContent = ''
	forecastPanelHour = ''
	img.setAttribute('src', './img/unknown.png')
}
const setTimeForecast = dtime => {
	const time = new Date(dtime * 1000)
	calculateLocalTime(time)
	forecastTime = `${hrCheck} ${ampmCheck}`
}

const checkStatus = (info, id) => {
	if (info === 'thunderstorm' || (id >= 200 && id < 300)) {
		if (moment === 'day') {
			pathImg = './img/thunderstorm_d.png'
		} else {
			pathImg = './img/thunderstorm_n.png'
		}
	} else if (info === 'rain' || (id >= 500 && id < 521)) {
		if (moment === 'day') {
			pathImg = './img/rain_d.png'
		} else {
			pathImg = './img/rain_n.png'
		}
	} else if (info === 'shower rain' || (id >= 521 && id < 600)) {
		if (moment === 'day') {
			pathImg = './img/showerrain_d.png'
		} else {
			pathImg = './img/showerrain_n.png'
		}
	} else if (info === 'snow' || (id >= 600 && id < 700)) {
		if (moment === 'day') {
			pathImg = './img/snow_d.png'
		} else {
			pathImg = './img/snow_n.png'
		}
	} else if (info === 'mist' || (id >= 700 && id < 800)) {
		if (moment === 'day') {
			pathImg = './img/mist_d.png'
		} else {
			pathImg = './img/mist_n.png'
		}
	} else if (info === 'clear sky' && id === 800) {
		if (moment === 'day') {
			pathImg = './img/clearsky_d.png'
		} else {
			pathImg = './img/clearsky_n.png'
		}
	} else if (info === 'few clouds' || id === 801) {
		if (moment === 'day') {
			pathImg = './img/fewclouds_d.png'
		} else {
			pathImg = './img/fewclouds_n.png'
		}
	} else if (info === 'scattered clouds' || id === 802) {
		if (moment === 'day') {
			pathImg = './img/scatteredclouds_d.png'
		} else {
			pathImg = './img/scatteredclouds_n.png'
		}
	} else if (info === 'broken clouds' || (id >= 803 && id < 900)) {
		if (moment === 'day') {
			pathImg = './img/brokenclouds_d.png'
		} else {
			pathImg = './img/brokenclouds_n.png'
		}
	} else {
		pathImg = './img/unknown.png'
	}
}

const setTime = () => {
	const time = new Date()
	timeZoneUser = time.getTimezoneOffset() * 60
	timeDifference = (timeZoneCity + timeZoneUser) / 3600

	countTime = setInterval(() => {
		const time = new Date()
		calculateLocalTime(time)
		let currDay, currdayWeek
		const day = time.getDate()
		const dayOfWeek = time.getDay()
		const month = time.getMonth()
		const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
		const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		const currMonth = monthNames[month]

		if (localTime >= 24) {
			currDay = day + 1
			currdayWeek = dayOfWeek + 1
		} else if (localTime < 0) {
			currDay = day - 1
			currdayWeek = dayOfWeek - 1
		} else {
			currDay = day
			currdayWeek = dayOfWeek
		}
		const currDayName = dayNames[currdayWeek]
		dateInfo.textContent = `${currDayName}, ${currMonth} ${currDay}, ${hrCheck}:${minCheck} ${ampmCheck}`
	}, 1000)
}

const calculateLocalTime = time => {
	const timeDiff = timeDifference.toString().slice(-2)
	let hours = time.getHours()
	localTime = hours + timeDifference
	const hoursLocal = Math.abs(hours + timeDifference + 24) % 24
	let hoursAmpm = hoursLocal % 12 || 12
	let minutes = time.getMinutes()

	if (timeDiff === '.5') {
		minutes = minutes + 30
		hoursAmpm = parseInt(hoursAmpm.toString().slice(0, -1))
	} else if (timeDiff === '75') {
		minutes = minutes + 45
		hoursAmpm = parseInt(hoursAmpm.toString().slice(0, -2))
	}
	if (minutes > 60) {
		hoursAmpm++
		minutes = minutes - 60
	}

	hrCheck = hoursAmpm < 10 ? `0${hoursAmpm}` : `${hoursAmpm}`
	minCheck = minutes < 10 ? `0${minutes}` : `${minutes}`
	ampmCheck = hoursLocal % 24 >= 12 ? 'pm' : 'am'
}

const sunInfo = (rise, set) => {
	const riseTimestamp = rise
	const setTimestamp = set
	dateRise = new Date(riseTimestamp * 1000) // The Date() constructor takes a timestamp in milliseconds
	dateSet = new Date(setTimestamp * 1000)
	setSunrise()
	setSunset()
}
const setSunrise = () => {
	calculateLocalTime(dateRise)
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
	</svg></span><span class="weather-panel-sun-rise-info">${hrCheck}:${minCheck} ${ampmCheck}</span>`
}
const setSunset = () => {
	calculateLocalTime(dateSet)
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
	</svg></span><span class="weather-panel-sun-set-info">${hrCheck}:${minCheck} ${ampmCheck}</span>`
}
const checkSunMoment = (timeCity, sunrise, sunset) => {
	if (
		(timeCity > sunrise && timeCity < sunset) ||
		(timeCity > sunrise + 86400 && timeCity < sunset + 86400) ||
		(timeCity > sunrise - 86400 && timeCity < sunset - 86400)
	) {
		moment = 'day'
	} else {
		moment = 'night'
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
		root.style.setProperty('--app-color', '#fff')
		root.style.setProperty('--main-color', '#000')
		root.style.setProperty('--box-shadow', '#808080')
		root.style.setProperty('--error-color', '#593333')
	}
}
const checkEnter = e => {
	if (e.key === 'Enter') {
		getWeather()
		getForecast()
	}
}
searchBtn.addEventListener('click', () => {
	getWeather()
	getForecast()
})
input.addEventListener('keyup', checkEnter)
toggleSlider.addEventListener('click', () => {
	checkActive()
	toggleAction()
})
