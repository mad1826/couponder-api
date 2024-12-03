const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Joi = require('joi');
const mongoose = require('mongoose');

mongoose
	.connect('mongodb+srv://MD:Z16xunNplfhIJLnz@cluster0.xhgb6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch(err => {
		console.error('Unable to connect to MongoDB', err);
	});

const storeSchema = new mongoose.Schema({
	name: String,
	logo: String,
	location: String
});

const couponSchema = new mongoose.Schema({
	type: String,
	image: String,
	name: String,
	store: storeSchema,
	prices: [String],
	deal: String,
	expiresAt: String,
	details: String,
	qualifyingItems: [String]
});

const Coupon = mongoose.model('Coupon', couponSchema);

const carts = [
	{
		_id: 1,
		firstName: 'Michael',
		items: [1, 2, 20]
	}
];

const app = express();
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, `./public/images/${req.query.type}/`);
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	}
});

const upload = multer({ storage });

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/api/coupons', async (req, res) => {
	const coupons = await Coupon.find();
	res.json(coupons);
});

const formatExpiresAt = str => {
	const [, year, month, date] = str.match(/(\d{4})-(\d{2})-(\d{2})/);
	return `${month}/${date}/${year.slice(2)}`;
};

const validateCoupon = coupon => {
	const schema = Joi.object({
		_id: Joi.string().required(),
		type: Joi.string().required(),
		name: Joi.string().required(),
		storeName: Joi.string().required(),
		oldPrice: Joi.string().required(),
		newPrice: Joi.string().required(),
		deal: Joi.string().allow(''),
		expiresAt: Joi.string().required(),
		qualifyingItems: Joi.string().allow(''),
		details: Joi.string().allow(''),
		oldRent: Joi.string().allow(''),
		newRent: Joi.string().allow('')
	});

	return schema.validate(coupon);
};

const validateEditedCoupon = coupon => {
	const schema = Joi.object({
		name: Joi.string().required(),
		storeName: Joi.string().required(),
		oldPrice: Joi.string().required(),
		newPrice: Joi.string().required(),
		deal: Joi.string().allow(''),
		expiresAt: Joi.string().required(),
		qualifyingItems: Joi.string().allow(''),
		details: Joi.string().allow(''),
		oldRent: Joi.string().allow(''),
		newRent: Joi.string().allow('')
	});

	return schema.validate(coupon);
};

app.post('/api/coupons', upload.single('image'), async (req, res) => {
	const result = validateCoupon(req.body);

	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}

	const prices = [req.body.oldPrice, req.body.newPrice];

	if (req.body.type === 'entertainment') {
		prices.push(req.body.oldRent, req.body.newRent);
	}

	const coupon = new Coupon({
		type: req.body.type,
		name: req.body.name,
		store: {
			name: req.body.storeName,
			location: req.body.storeLocation
		},
		prices,
		deal: req.body.deal || null,
		expiresAt: formatExpiresAt(req.body.expiresAt),
		qualifyingItems: req.body.qualifyingItems === '' ? undefined : [req.body.qualifyingItems],
		details: req.body.details || undefined
	});

	if (req.file) {
		coupon.image = req.file.filename;
	}

	const newCoupon = await coupon.save();

	res.status(200).send(newCoupon);
});

app.delete('/api/coupons/:id', async (req, res) => {
	const coupon = await Coupon.findByIdAndDelete(req.params.id);

	res.status(200).send(coupon);
});

app.put('/api/coupons/:id', upload.single('image'), async (req, res) => {
	const result = validateEditedCoupon(req.body);

	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}

	const prices = [req.body.oldPrice, req.body.newPrice];

	if (req.body.oldRent) {
		prices.push(req.body.oldRent, req.body.newRent);
	}

	const fieldsToUpdate = {
		name: req.body.name,
		store: {
			name: req.body.storeName,
			location: req.body.storeLocation
		},
		prices,
		deal: req.body.deal || null,
		expiresAt: formatExpiresAt(req.body.expiresAt),
		qualifyingItems: req.body.qualifyingItems === '' ? undefined : [req.body.qualifyingItems],
		details: req.body.details || undefined
	};

	if (req.file) {
		fieldsToUpdate.image = req.file.filename;
	}

	await Coupon.updateOne({ _id: req.params.id }, fieldsToUpdate);

	const newCoupon = await Coupon.findOne({ _id: req.params.id });

	res.status(200).send(newCoupon);
});

app.get('/api/carts', (req, res) => {
	res.send(carts);
});

app.listen(3001, () => {
	console.log('Listening...');
});