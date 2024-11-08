const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static("public"));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html')
})

app.get('/api/coupons', (req, res) => {
	res.sendFile('coupons.json', { root: '.' })
})

app.get('/api/carts', (req, res) => {
	res.sendFile('carts.json', { root: '.' })
})

app.listen(3001, () => {
	console.log('Listening...')
})