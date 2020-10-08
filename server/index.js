const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const axios = require('axios');
const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const instance = axios.create({
  withCredentials: true
})


function tableToArray(table) {
  var result = []
  var rows = table.rows;
  var cells, t;

  // Iterate over rows
  for (var i=0, iLen=rows.length; i<iLen; i++) {
    cells = rows[i].cells;
    t = [];

    // Iterate over cells
    for (var j=0, jLen=cells.length; j<jLen; j++) {
      t.push(cells[j].textContent);
    }
    result.push(t);
  }
  return result; 
}


const getBreeds = async () => {
  try {

    const response = await instance.get('http://www.fundamentus.com.br/resultado.php', {headers : {'X-Requested-With': 'XMLHttpRequest'} });
 
    const dom = new JSDOM(response.data);
    //let dom =  await JSDOM.fromURL("http://www.fundamentus.com.br/resultado.php");
    
    const document = dom.window.document;
    const table = document.getElementById("resultado");
    console.log(table.innerHTML);
return tableToArray(table)
console.log(tableToArray(table))






  //  let $pagina =  await axios.get('http://www.fundamentus.com.br/resultado.php');
  //  console.log($pagina.serialize());

 // const dom = new jsdom.JSDOM($pagina);
    
  //console.log(dom);

 // var ho = meuHtml.getElementsByTagName("table")[0].rows

  //console.log(ho);


   return $pagina;

  } catch (error) {
    console.error(error)
  }
}


// // Multi-process to utilize all CPU cores.
// if (!isDev && cluster.isMaster) {
//   console.error(`Node cluster master ${process.pid} is running`);

//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
//   });

// } else {
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  // Answer API requests.
  app.get('/api', async function (req, res) {
   // res.set('Content-Type', 'application/json');
     let response = await getBreeds();
    // console.log(response);
      res.send(JSON.stringify(response));

    });



  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  });
// }
