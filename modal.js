const mongoose = require('mongoose');

const county = new mongoose.Schema ({
   osm:{
       type: Number,
   },
   data: { type: Array},
})

module.exports = mongoose.model('county', county)