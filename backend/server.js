const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

let index = 0;
let routeData = JSON.parse(fs.readFileSync('./data/route.json'));

app.get('/api/location', (req, res) => {
    const currentPoint = routeData[index];
    index = (index + 1) % routeData.length;
    res.json(currentPoint);
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
