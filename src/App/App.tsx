import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import MapContainer from './MapContainer/MapContainer';

async function fetchData() {
  const METADATA_URL =
    'https://data.nsw.gov.au/data/api/3/action/package_show?id=0a52e6c1-bc0b-48af-8b45-d791a6d8e289';
  try {
    const metadataResponse = await axios.get(METADATA_URL);
    const jsonResource = metadataResponse.data.result.resources.find(
      (resource: any) => resource.format === 'JSON'
    );

    const endpoint = localStorage.getItem('endpoint');
    if (endpoint === jsonResource.url) {
      const cachedData = localStorage.getItem('data');
      if (cachedData) {
        console.debug('Using cached data');
        return JSON.parse(cachedData);
      }
    }

    const dataResponse = await axios.get(jsonResource.url);
    localStorage.setItem('endpoint', jsonResource.url);
    localStorage.setItem('data', JSON.stringify(dataResponse.data));
    return dataResponse.data;
  } catch {
    throw new Error('Failed to fetch data');
  }
}

function App() {
  const [locations, setLocations] = useState([]);
  const [lastUpdated, setLastUpdated] = useState({
    date: 'fetching...',
    time: '',
  });

  useEffect(() => {
    fetchData().then((rawData: any) => {
      setLocations(rawData.data.monitor);
      setLastUpdated({ date: rawData.date, time: rawData.time });
    });
  }, []);

  return (
    <div className="App">
      <header>
        <div>
          <strong>Last updated: </strong>
          {`${lastUpdated.date} ${lastUpdated.time}`}
        </div>
        <div>
          <strong>Data source: </strong>
          <a href="https://data.nsw.gov.au/nsw-covid-19-data/case-locations">
            NSW Health
          </a>{' '}
          (<a href="https://creativecommons.org/licenses/by/4.0/">CC-BY 4.0</a>)
        </div>
      </header>
      <MapContainer locations={locations} />
    </div>
  );
}

export default App;
