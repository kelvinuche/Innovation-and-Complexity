import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { logout } from "../auth";
import BarChart from './Barchart';
import * as d3 from 'd3'; // Import d3 library

const Dashboard = () => {
  const history = useHistory(); // Import useHistory hook

  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [defaultData, setDefaultData] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState([]); // Added selectedDiseases state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonData = await d3.json('data.json'); // Fetch data using d3.json
        // Filter data where Entity is "Germany"
        const germanyData = jsonData.filter(item => item.Entity === "Germany" && item.Year >= 2009 && item.Year <= 2019);

        setData(germanyData);

        const keys = Object.keys(germanyData[0] || {}).filter(key => key !== "Entity" && key !== "Code" && key !== "Year");

        setKeys(keys);

        console.log({ "fetched_keys": keys });

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    // Call logout function from auth.js
    logout();
    // purpleirect to login page after logout
    history.push("/login");
  };

  const filterSearchData = (title) => {
    if (selectedDiseases.includes(title)) {
      setSelectedDiseases(selectedDiseases.filter(item => item !== title));
    } else {
      setSelectedDiseases([...selectedDiseases, title]);
    }
  };

  const filtepurpleData = data.map(item => {
    const filtepurpleItem = { ...item };
    Object.keys(filtepurpleItem).forEach(key => {
      if (keys.includes(key) && selectedDiseases.length > 0 && !selectedDiseases.includes(key)) {
        filtepurpleItem[key] = null;
      }
    });
    return filtepurpleItem;
  }).map(item => {
    const filtepurpleKeys = Object.keys(item).filter(key => item[key] !== null);
    const newFiltepurpleItem = {};
    filtepurpleKeys.forEach(key => {
      // Round down the data value if it's a number
      newFiltepurpleItem[key] = typeof item[key] === 'number' ? Math.floor(item[key]) : item[key];
    });
    return newFiltepurpleItem;
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const text = e.target.result;
      const csvData = d3.csvParse(text, (d) => {
        // Remove double quotes and convert numeric values from strings to integers
        d["Other pharynx cancer"] = parseInt(d["Other pharynx cancer"].replace(/"/g, ""));
        d["Liver cancer"] = parseInt(d["Liver cancer"].replace(/"/g, ""));
        d["Breast cancer"] = parseInt(d["Breast cancer"].replace(/"/g, ""));
        d["Tracheal, bronchus, and lung cancer"] = parseInt(d["Tracheal, bronchus, and lung cancer"].replace(/"/g, ""));
        d["Gallbladder and biliary tract cancer"] = parseInt(d["Gallbladder and biliary tract cancer"].replace(/"/g, ""));
        d["Kidney cancer"] = parseInt(d["Kidney cancer"].replace(/"/g, ""));
        d["Stomach cancer"] = parseInt(d["Stomach cancer"].replace(/"/g, ""));
        d["Thyroid cancer"] = parseInt(d["Thyroid cancer"].replace(/"/g, ""));
        d["Uterine cancer"] = parseInt(d["Uterine cancer"].replace(/"/g, ""));
        d["Bladder cancer"] = parseInt(d["Bladder cancer"].replace(/"/g, ""));
        d["Cervical cancer"] = parseInt(d["Cervical cancer"].replace(/"/g, ""));
        d["Prostate cancer"] = parseInt(d["Prostate cancer"].replace(/"/g, ""));
        d["Brain and central nervous system cancer"] = parseInt(d["Brain and central nervous system cancer"].replace(/"/g, ""));
        d["Testicular cancer"] = parseInt(d["Testicular cancer"].replace(/"/g, ""));
        d["Esophageal cancer"] = parseInt(d["Esophageal cancer"].replace(/"/g, ""));
        d["Nasopharynx cancer"] = parseInt(d["Nasopharynx cancer"].replace(/"/g, ""));
        d["Colon and rectum cancer"] = parseInt(d["Colon and rectum cancer"].replace(/"/g, ""));
        d["Non-melanoma skin cancer"] = parseInt(d["Non-melanoma skin cancer"].replace(/"/g, ""));
        d["Lip and oral cavity cancer"] = parseInt(d["Lip and oral cavity cancer"].replace(/"/g, ""));
        d["Malignant skin melanoma"] = parseInt(d["Malignant skin melanoma"].replace(/"/g, ""));
        d["Other malignant neoplasms"] = parseInt(d["Other malignant neoplasms"].replace(/"/g, ""));
        d["Mesothelioma"] = parseInt(d["Mesothelioma"].replace(/"/g, ""));
        d["Hodgkin lymphoma"] = parseInt(d["Hodgkin lymphoma"].replace(/"/g, ""));
        d["Non-Hodgkin lymphoma"] = parseInt(d["Non-Hodgkin lymphoma"].replace(/"/g, ""));
        d["Year"] = parseInt(d["Year"].replace(/"/g, ""));
        return d;
      });
      setData(csvData);
    };

    reader.readAsText(file);
  };

  const resetData = () => {
    // Reset data to default data
    setData(defaultData);
  };

  console.log("file data upload", { data });

  return (
    <div>
      <div className="h-screen bg-cover">
        <div className="bg-gray-100 bg-opacity-75 min-h-screen">
          <div className="container mx-auto py-8">
            <a href="/"> 
              <h1 className="text-3xl font-bold text-purple mb-8">Dashboard</h1>
            </a>
            <button onClick={handleLogout} className='p-3 bg-purple-500 text-white rounded-lg flex-row justify-end'>Logout</button>
            <div>
              <h1 className='text-center text-3xl my-6'>Cancer Burden Analysis in Germany (2008-2019): Insights into Disability-Adjusted Life
Years (DALYs)</h1>

              <h1 className='text-center mt-0'>Select a Disease to view</h1>
              <form>
                <div className='flex flex-row flex-wrap p-4 justify-center mx-auto'>
                  {keys.map(title => (
                    <div key={title} className="flex items-center mr-4">
                      <input type="checkbox" onChange={() => filterSearchData(title)} className='h-5 w-5 mr-2' />
                      <span>{title}</span>
                    </div>
                  ))}
                </div>
                <hr/><br/>
                <div className='bg-purple-700 py-4 m-4 mt-6 px-4 text-white rounded-lg flex-wrap' style={{ maxWidth: 'fit-content', margin: 'auto' }}>
                  <h3 className='text-center text-3xl m-3 mt-0'>Upload Custom Data</h3>
                  <div className='flex flex-row justify-center'>
                    {/* <label htmlFor="file-upload">Upload CSV file:</label> */}
                    <input type="file" id="file-upload" accept=".csv" onChange={handleFileUpload} />
                    <button className='ring-2 ring-white hover:text-white hover:bg-purple-500 text-white rounded-lg p-2' onClick={resetData}>Reset Data</button> {/* Reset button */}
                  </div>
                </div>
                <br/>


              </form>

              <BarChart data={filtepurpleData} width={600} />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
