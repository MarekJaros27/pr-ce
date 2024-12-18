document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "be3b979afd8842c8b5b191453241812"; 
    const searchBtn = document.getElementById("searchBtn");
    const cityInput = document.getElementById("city");
    const weatherResult = document.getElementById("weatherResult");
    const cityName = document.getElementById("cityName");
    const temperature = document.getElementById("temperature");
    const description = document.getElementById("description");
    const humidity = document.getElementById("humidity");
    const windSpeed = document.getElementById("windSpeed");
    const weatherIcon = document.getElementById("weatherIcon");
    const historyList = document.getElementById("historyList");

    // Standardní meteorologické ikony
    const icons = {
        sunny: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
        cloudy: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-cloud"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`,
        rain: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-cloud-rain"><line x1="16" y1="13" x2="16" y2="21"></line><line x1="8" y1="13" x2="8" y2="21"></line><line x1="12" y1="15" x2="12" y2="23"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>`,
        snow: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-cloud-snow"><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path><line x1="8" y1="15" x2="8" y2="23"></line><line x1="16" y1="15" x2="16" y2="23"></line><line x1="12" y1="19" x2="12" y2="23"></line></svg>`,
        wind: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-wind"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg>`,
        humidity: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-droplet"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`
    };

    function getWeather(city) {
        fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=cs`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert("Město nenalezeno.");
                } else {
                    displayWeather(data);
                    saveHistory(city);
                }
            })
            .catch(error => {
                console.error(error);
                alert("Došlo k chybě při načítání dat.");
            });
    }

    function displayWeather(data) {
        cityName.textContent = data.location.name;
        
        // Přidány ikony k jednotlivým informacím
        temperature.innerHTML = `${icons.sunny} Teplota: ${data.current.temp_c}°C`;
        description.textContent = `Popis: ${data.current.condition.text}`;
        humidity.innerHTML = `${icons.humidity} Vlhkost: ${data.current.humidity}%`;
        windSpeed.innerHTML = `${icons.wind} Rychlost větru: ${data.current.wind_kph} km/h`;

        // Resetujeme třídy prostředí
        document.body.classList.remove('sunny', 'rainy', 'snowy', 'cloudy');

        // Zobrazujeme ikonu počasí
        const condition = data.current.condition.text.toLowerCase();
        let selectedIcon = icons.cloudy;

        if (condition.includes("sunny") || condition.includes("clear")) {
            selectedIcon = icons.sunny;
            document.body.classList.add("sunny");
        } else if (condition.includes("rain")) {
            selectedIcon = icons.rain;
            document.body.classList.add("rainy");
        } else if (condition.includes("snow")) {
            selectedIcon = icons.snow;
            document.body.classList.add("snowy");
        } else if (condition.includes("cloud")) {
            selectedIcon = icons.cloudy;
            document.body.classList.add("cloudy");
        }

        // Vložení hlavní ikony počasí
        weatherIcon.innerHTML = selectedIcon;
    }

    // Zbytek kódu zůstává stejný jako v předchozí verzi
    function saveHistory(city) {
        let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
        if (!history.includes(city)) {
            history.unshift(city);
            if (history.length > 5) {
                history.pop();
            }
            localStorage.setItem("weatherHistory", JSON.stringify(history));
            displayHistory();
        }
    }

    function displayHistory() {
        let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
        historyList.innerHTML = "";
        history.forEach(city => {
            const li = document.createElement("li");
            li.textContent = city;
            li.onclick = function() {
                getWeather(city);
            };
            historyList.appendChild(li);
        });
    }

    // Při načtení stránky zobrazíme historii
    displayHistory();

    // Událost pro tlačítko hledání
    searchBtn.addEventListener("click", function() {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        } else {
            alert("Zadejte město.");
        }
    });

    // Funkce pro zpracování Enter klávesy v inputu
    cityInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            searchBtn.click();
        }
    });
});