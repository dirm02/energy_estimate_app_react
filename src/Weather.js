import React, { useState } from 'react';
import Line from './componets/LineChart'
import axios from 'axios';
import WindTurbineCard from './componets/WindTurbineCard';
import SolarPanelCard from './componets/SolarPanelCard';


const API_KEY = '3KAJKHWT3UEMRQWF2ABKVVVZE'
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'


const Weather = () => {
    const [location, setLocation] = useState('');
    const [startMonth, setStartMonth] = useState('');
    const [endMonth, setEndMonth] = useState('');

    // The parameters related to the wind turbine
    const [height, setHubheight] = useState(50); // [m]
    const [bladelength, setBladelength] = useState(25); // [m]
    const [airdensity, setAirdensity] = useState(1.225); // [kg/m^3]
    const [turbineEfficiency, setTurbineEfficiency] = useState(40); // [%]
    // The parameters related to the solar panel
    const [panelArea, setPanelArea] = useState(10); //[m^2]
    const [panelEfficiency, setPanelEfficiency] = useState(20); // [%]


    const [weatherData, setWeatherData] = useState(null);
    const [monthlyWindEnergy, setMonthlyWindEnergy] = useState([{month: 'N/A', energy: 0}]);
    const [monthlySolarEnergy, setMonthlySolarEnergy] = useState([{month: 'N/A', energy: 0}]);

    // Zip code for height: K2A1W1
    // const startMonth = '2021-10-19T13:59:00'
    // const endMonth = '2021-10-19T13:59:00'
    const getLastDayOfMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getLastDayFromInput = (input) => {
        const [year, month] = input.split('-').map(Number);
        const lastDay = getLastDayOfMonth(year, month);
        return lastDay;
    }
    const getMonthsArray = (start, end) => {
        let result = [];
        let itrDate = new Date(start + '-01'); // Adding '-01' to form a full date
        let endDate = new Date(end + '-01');

        while (itrDate <= endDate) {
            // Formatting to 'YYYY-MM' format
            let year = itrDate.getFullYear();
            let month = (itrDate.getMonth() + 1).toString().padStart(2, '0');
            result.push(`${year}-${month}`);
            // Move to the next month
            itrDate.setMonth(itrDate.getMonth() + 1);
        }

        return result;
    }

    function calculateMonthlyWindEnergy(data, windkey) {
        const k = 0.5 * Math.PI * Math.pow(bladelength, 2) * airdensity; // Assumed constant for energy calculation
        const monthlyEnergyMap = {};
        // Iterate over each day in the data
        data.days.forEach(day => {
            const monthKey = day.datetime.slice(0, 7); // 'YYYY-MM' format
            if (!monthlyEnergyMap[monthKey]) {
                monthlyEnergyMap[monthKey] = 0; // Initialize if not already present
            }
            // Iterate over each hour in the day
            day.hours.forEach(hour => {                
                const hourlyEnergy = k * hour[windkey] ** 3; // [W*h]
                monthlyEnergyMap[monthKey] += hourlyEnergy;
            });
        });

        // Extracting the results into an array sorted by month
        const sortedMonths = Object.keys(monthlyEnergyMap).sort();
        const monthlyEnergyArray = sortedMonths.map(month => ({
            month: month,
            energy: monthlyEnergyMap[month]
        }));

        return monthlyEnergyArray;
    }

    function calculateMonthlySolarEnergy(data) {
        const kk = panelArea; // Assumed constant for energy calculation
        const monthlyEnergyMap = {};
        // Iterate over each day in the data
        data.days.forEach(day => {
            const monthKey = day.datetime.slice(0, 7); // 'YYYY-MM' format
            if (!monthlyEnergyMap[monthKey]) {
                monthlyEnergyMap[monthKey] = 0; // Initialize if not already present
            }            

            // Iterate over each hour in the day
            day.hours.forEach(hour => {                
                const hourlyEnergy = kk * (hour['dniradiation'] + hour['difradiation']); // [W*h]
                monthlyEnergyMap[monthKey] += hourlyEnergy;
            });
        });

        // Extracting the results into an array sorted by month
        const sortedMonths = Object.keys(monthlyEnergyMap).sort();
        const monthlyEnergyArray = sortedMonths.map(month => ({
            month: month,
            energy: monthlyEnergyMap[month]
        }));

        return monthlyEnergyArray;
    }


    const fetchData = async () => {
        let url = ''
        const lastDay = getLastDayFromInput(endMonth);
        try {
            url = `${BASE_URL}${location}/${startMonth}-01/${endMonth}-${lastDay}?unitGroup=metric&key=${API_KEY}
                &include=hours&elements=datetime,windspeed,windspeed50,windspeed80,windspeed100,dniradiation,difradiation`;
            console.log(url)
            const response = await axios.get(url);
            setWeatherData(response.data);
            console.log(response.data); //You can see all the weather data in console log
        } catch (error) {
            console.error(error);
        }
    };

    // useEffect(() => {
    //     fetchData();
    // }, []);
    const handleLocationInputChange = (e) => {
        setLocation(e.target.value);
    };
    const handStartMonthleInputChange = (e) => {
        setStartMonth(e.target.value);
    };
    const handleEndMonthInputChange = (e) => {
        setEndMonth(e.target.value);
    }

    const handleHubheightInputChange = (e) => {
        setHubheight(e.target.value);
    };
    const handleBladelengthInputChange = (e) => {
        setBladelength(e.target.value);
    };
    const handleAirdensityInputChange = (e) => {
        setAirdensity(e.target.value);
    };
    const handleTurbineEfficiencyInputChange = (e) => {
        setTurbineEfficiency(e.target.value);
    };
    const handlePanelAreaInputChange= (e) => {
        setPanelArea(e.target.value);
    };
    const handlePanelEfficiencyInputChange = (e) => {
        setPanelEfficiency(e.target.value);
    };

    const handleLoad = (e) => {
        e.preventDefault();
        fetchData();
    }

    const handleWindSubmit = (e) => {
        e.preventDefault();
        let windkey;
        switch (height) {
            case 10:
                windkey = 'windspeed'
                break;
            case 50:
                windkey = 'windspeed50'
                break;
            case 80:
                windkey = 'windspeed80'
                break;
            case 100:
                windkey = 'windspeed100'
                break;

            default:
                windkey = 'windspeed50'
                break;
        }
        setMonthlyWindEnergy(calculateMonthlyWindEnergy(weatherData, windkey));
    };

    const handleSolarSubmint = (e) => {
        e.preventDefault();
        setMonthlySolarEnergy(calculateMonthlySolarEnergy(weatherData));
    }

    const months = monthlyWindEnergy.map(monthData => monthData.month);
    const windEnergies = monthlyWindEnergy.map(monthData => monthData.energy/(10**6)); // [KW*h]
    const solarEnergies = monthlySolarEnergy.map(monthData => monthData.energy/(10**6)); // [KW*h]

    return (
        <div className="container">
            <div id="form-container">
                <form onSubmit={handleLoad}>
                    <input type="text" id="location" name="location" placeholder="Enter the Location" onChange={handleLocationInputChange} required />
                    <input type="month" id="startMonth" name="startMonth" onChange={handStartMonthleInputChange} required />
                    <input type="month" id="endMonth" name="endMonth" onChange={handleEndMonthInputChange} required />
                    <button type="submit">Load Weather Data</button>
                </form>
            </div>
            {weatherData ? (
                <>
                    <div className="generator-container">
                        <WindTurbineCard
                            hubHeight={height}
                            airDensity={airdensity}
                            bladeLength={bladelength}
                            turbineEfficiency={turbineEfficiency}
                            handleSubmit={handleWindSubmit}
                            handleAirdensityInputChange={handleAirdensityInputChange}
                            handleBladelengthInputChange={handleBladelengthInputChange}
                            handleEfficiencyInputChange={handleTurbineEfficiencyInputChange}
                            handleHubheightInputChange={handleHubheightInputChange}
                        />
                        <SolarPanelCard
                            panelArea={panelArea}
                            panelEfficiency={panelEfficiency}
                            handleSubmit={handleSolarSubmint}
                            handlePanelAreaInputChange={handlePanelAreaInputChange}
                            handleEfficiencyInputChange={handlePanelEfficiencyInputChange}
                        />
                        {/* <GeneratorCard info={todayData} /> */}
                    </div>
                    <div className="charts-container">
                        <div className="chart">
                            <Line key="windEChart" label='Monthly Available Wind Energy (MW·h)' inputData={{ xs: months, ys: windEnergies }} />
                        </div>
                        <div className="chart">
                            <Line key="windERealChart" label='Monthly Productable Wind Energy (MW·h)' inputData={{ xs: months, ys: windEnergies.map(energy => energy*turbineEfficiency/100) }} />
                        </div>
                        <div className="chart">
                            <Line key="solarEChart" label='Monthly Available Solar Energy (MW·h)' inputData={{ xs: months, ys: solarEnergies }} />
                        </div>
                        <div className="chart">
                            <Line key="solarERealChart" label='Monthly Productable Solar Energy (MW·h)' inputData={{ xs: months, ys: solarEnergies.map(energy => energy*panelEfficiency/100) }} />
                        </div>
                    </div>
                </>
            ) : (
                <p>Not loaded weather data yet...</p>
            )}
        </div>
    );
}

export default Weather;