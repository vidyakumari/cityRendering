const express = require('express');
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const route = require('./routes/routes')
const http = require('http');
// const io = require('socket.io');
const cors = require('cors')
// create express app
const app = express();
const county = require('./modal')
const fetch = require('node-fetch');
//const distance = require('distance-calculator-radians');

// parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }))

// // parse requests of content-type - application/json
// app.use(bodyParser.json())

app.use(cors())
// Configuring the database
// Connecting to the database
mongoose.connect('mongodb://localhost:27017/Location', { useNewUrlParser: true })
    .then(() => {
        console.log('Database connected');
    })
    .catch((error) => {
        console.log('Error connecting to database');
    });



app.get('/testload', function (req, res) {
    const osm = Number(req.query.osm);
    return county.findOne({'osm': osm})
        .then(async (data) => {
            if(data && data.length > 0){
               res.json(data);
            }
            else{
                const response = await fetch(`http://polygons.openstreetmap.fr/get_geojson.py?id=${osm}&params=0`);
                const myJson = await response.json();
                let locData = myJson.geometries[0].coordinates[0][0];
                if(locData.length > 0){
                    let formattedData = [];
                    await locData.map(item => {
                        formattedData.push({ lat: item[1], lng: item[0] });
                    })
                    if(formattedData && formattedData.length > 0){
                        let countyData = new county({
                            osm: osm,
                            data: formattedData
                        });

                        countyData.save((err) => {
                            if(err){
                                console.log(err)
                            }else{
                                res.json({
                                    osm: osm,
                                    data: formattedData
                                })
                            }
                        })
                    }
                }
                
            }
        })
        .catch((error) => {
            console.log(error);
        })
})
// const socketIo = io(server);

// define a simple route
// app.get('/', (req, res) => {
//     res.json({"message": "Welcome"});
// });

// // Require Notes routes
// app.use('/', route);

// listen for requests
// const pointObj = { 
//     latitude: '28.704060', 
//     longitude: '77.102493'
// }

// const targetObj = { 
//     latitude: '28.459497', 
//     longitude: '77.026634'
// }

// let dist = distance.distanceCalculator(pointObj, targetObj);
// console.log('Distance',dist);

app.listen(4000, () => {
    console.log("Server is listening on port 4000");
});


