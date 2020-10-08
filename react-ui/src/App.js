import React, { useCallback, useEffect, useState } from 'react';

import './App.css';

function App() {
  const [message, setMessage] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [url, setUrl] = useState('/api');

  const fetchData = useCallback(() => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }

        console.log(response);
        return response.json();
      })
      .then(json => {
        setMessage(json);
        setIsFetching(false);
      }).catch(e => {
        setMessage(`API call failed: ${e}`);
        setIsFetching(false);
      })
  }, [url]);

  useEffect(() => {
    setIsFetching(true);
    fetchData();
  }, [fetchData]);


  const printMessage = () => {


    if(!isFetching){
      console.log(message)

      return(
        <table>
        {message.map(row => (
          <tr key={row[0]}>
             <td>{row[0]}</td>
            <td>{row[1]}</td>
            <td>{row[2]}</td>
            <td>{row[3]}</td>
          </tr>
        ))}
        </table>
      )
    }
    
  }

  return (
    <div className="App">
 
      

          {isFetching
            ? 'Fetching message from API'
            : printMessage()}
     
    </div>
  );

}

export default App;
