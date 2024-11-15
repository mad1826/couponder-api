const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Joi = require('joi');

const coupons = [
	{
		_id: 1,
		type: 'grocery',
		image: 'apple.png',
		name: 'Apples',
		store: {
			name: 'Food Lion',
			logo: 'food-lion.png',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13230.888422060465!2d-81.0320934407241!3d33.99967102082561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8a532cbb7bea1%3A0x55235f2e7f75a1!2sFood%20Lion!5e0!3m2!1sen!2sus!4v1730065700902!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
		},
		prices: ['5.00/oz', '2.99/oz'],
		deal: 'Buy One, Get One Free',
		expiresAt: '1/1/25',
		details: 'Only applicable toward Fuji, Granny Smith, and Golden apples.'
	},
	{
		_id: 2,
		type: 'hygiene',
		image: 'crest-toothpaste.jpg',
		name: 'Crest Toothpaste',
		store: {
			name: 'CVS',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6615.735738225325!2d-81.0330186579937!3d33.995927487776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8bb29bd47bb0d%3A0x8483a80ae0f2d231!2sCVS!5e0!3m2!1sen!2sus!4v1730067276718!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
			logo: 'cvs.png'
		},
		prices: ['4.00', '0.00'],
		deal: 'Buy One, Get One Free',
		expiresAt: '11/1/24',
		qualifyingItems: ['Single pack', 'Double packs']
	},
	{
		_id: 3,
		type: 'grocery',
		image: 'bananas.jpg',
		name: 'Bananas',
		store: {
			name: 'Food Lion',
			logo: 'food-lion.png',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13230.888422060465!2d-81.0320934407241!3d33.99967102082561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8a532cbb7bea1%3A0x55235f2e7f75a1!2sFood%20Lion!5e0!3m2!1sen!2sus!4v1730065700902!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
		},
		prices: ['2.00', '1.00'],
		deal: 'Buy One, Get One Free',
		expiresAt: '11/1/24'
	},
	{
		_id: 4,
		type: 'entertainment',
		image: 'inside-out-2.jpg',
		name: 'Inside Out 2',
		store: {
			name: 'Prime Video',
			logo: 'prime-video.png'
		},
		prices: ['15.00', '11.99', '10.00', '7.99'],
		deal: null,
		expiresAt: '1/1/25'
	},
	{
		_id: 5,
		type: 'hygiene',
		image: 'oral-b-toothbrush.jpg',
		name: 'Oral-B Toothbrush',
		store: {
			name: 'CVS',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6615.735738225325!2d-81.0330186579937!3d33.995927487776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8bb29bd47bb0d%3A0x8483a80ae0f2d231!2sCVS!5e0!3m2!1sen!2sus!4v1730067276718!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
			logo: 'cvs.png'
		},
		prices: ['15.00', '11.99'],
		deal: 'Buy One, Get One 50% Off',
		expiresAt: '1/1/25',
		qualifyingItems: ['Disposable Toothbrushes']
	},
	{
		_id: 6,
		type: 'hygiene',
		image: 'aleve.jpg',
		name: 'Aleve PM',
		store: {
			name: 'Walgreens',
			logo: 'walgreens.png'
		},
		prices: ['15.00', '11.99'],
		deal: 'Buy One, Get One 50% Off',
		expiresAt: '1/1/25',
		qualifyingItems: ['24ct', '48ct']
	},
	{
		_id: 7,
		type: 'entertainment',
		image: 'deadpool-and-wolverine.jpg',
		name: 'Deadpool & Wolverine',
		store: {
			name: 'Prime Video',
			logo: 'prime-video.png'
		},
		prices: ['15.00', '11.99', '10.00', '7.99'],
		deal: null,
		expiresAt: '1/1/25'
	},
	{
		_id: 8,
		type: 'entertainment',
		image: 'despicable-me-4.jpg',
		name: 'Despicable Me 4',
		store: {
			name: 'Prime Video',
			logo: 'prime-video.png'
		},
		prices: ['15.00', '11.99', '10.00', '7.99'],
		deal: null,
		expiresAt: '1/1/25'
	},
	{
		_id: 9,
		type: 'entertainment',
		image: 'dune-part-two.jpg',
		name: 'Dune: Part Two',
		store: {
			name: 'Prime Video',
			logo: 'prime-video.png'
		},
		prices: ['15.00', '11.99', '10.00', '7.99'],
		deal: null,
		expiresAt: '1/1/25'
	},
	{
		_id: 10,
		type: 'entertainment',
		image: 'godzilla-x-kong-the-new-empire.jpg',
		name: 'Godzilla x Kong: The New Empire',
		store: {
			name: 'Prime Video',
			logo: 'prime-video.png'
		},
		prices: ['15.00', '11.99', '10.00', '7.99'],
		deal: null,
		expiresAt: '1/1/25'
	},
	{
		_id: 11,
		type: 'entertainment',
		image: 'kung-fu-panda-4.jpg',
		name: 'Kung Fu Panda 4',
		store: {
			name: 'Prime Video',
			logo: 'prime-video.png'
		},
		prices: ['15.00', '11.99', '10.00', '7.99'],
		deal: null,
		expiresAt: '1/1/25'
	},
	{
		_id: 12,
		type: 'entertainment',
		image: 'bad-boys-ride-or-die.jpg',
		name: 'Bad Boys: Ride or Die',
		store: {
			name: 'Prime Video',
			logo: 'prime-video.png'
		},
		prices: ['15.00', '11.99', '10.00', '7.99'],
		deal: null,
		expiresAt: '1/1/25'
	},
	{
		_id: 13,
		type: 'entertainment',
		image: 'kingdom-of-the-planet-of-the-apes.jpg',
		name: 'Kingdom of the Planet of the Apes',
		store: {
			name: 'Prime Video',
			logo: 'prime-video.png'
		},
		prices: ['15.00', '11.99', '10.00', '7.99'],
		deal: null,
		expiresAt: '1/1/25'
	},
	{
		_id: 14,
		type: 'entertainment',
		image: 'twisters.jpg',
		name: 'Twisters',
		store: {
			name: 'Prime Video',
			logo: 'prime-video.png'
		},
		prices: ['15.00', '11.99', '10.00', '7.99'],
		deal: null,
		expiresAt: '1/1/25'
	},
	{
		_id: 15,
		type: 'hygiene',
		image: 'cerave-hydrating-facial-cleanser.jpg',
		name: 'CeraVe Hydrating Facial Cleanser',
		store: {
			name: 'CVS',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6615.735738225325!2d-81.0330186579937!3d33.995927487776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8bb29bd47bb0d%3A0x8483a80ae0f2d231!2sCVS!5e0!3m2!1sen!2sus!4v1730067276718!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
			logo: 'cvs.png'
		},
		prices: ['5.00', '2.99'],
		deal: null,
		expiresAt: '1/1/25'
	},
	{
		_id: 16,
		type: 'hygiene',
		image: 'dayquil-nyquil.jpg',
		name: 'DayQuil/NyQuil Bundle',
		store: {
			name: 'CVS',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6615.735738225325!2d-81.0330186579937!3d33.995927487776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8bb29bd47bb0d%3A0x8483a80ae0f2d231!2sCVS!5e0!3m2!1sen!2sus!4v1730067276718!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
			logo: 'cvs.png'
		},
		prices: ['5.00', '2.49'],
		deal: 'Buy One, Get One 50% Off',
		expiresAt: '1/1/25',
		qualifyingItems: ['Severe Relief']
	},
	{
		_id: 17,
		type: 'hygiene',
		image: 'dove-body-wash.jpg',
		name: 'Dove Body Wash',
		store: {
			name: 'CVS',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6615.735738225325!2d-81.0330186579937!3d33.995927487776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8bb29bd47bb0d%3A0x8483a80ae0f2d231!2sCVS!5e0!3m2!1sen!2sus!4v1730067276718!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
			logo: 'cvs.png'
		},
		prices: ['5.00', '2.49'],
		deal: 'Buy One, Get One 50% Off',
		expiresAt: '1/1/25',
		qualifyingItems: ['9oz', '12oz']
	},
	{
		_id: 18,
		type: 'hygiene',
		image: 'nature-made-vitamin-c.jpg',
		name: 'Nature Made Vitamin C',
		store: {
			name: 'CVS',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6615.735738225325!2d-81.0330186579937!3d33.995927487776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8bb29bd47bb0d%3A0x8483a80ae0f2d231!2sCVS!5e0!3m2!1sen!2sus!4v1730067276718!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
			logo: 'cvs.png'
		},
		prices: ['5.00', '2.49'],
		deal: 'Buy One, Get One 50% Off',
		expiresAt: '1/1/25',
		qualifyingItems: ['75ct', '150ct']
	},
	{
		_id: 19,
		type: 'hygiene',
		image: 'secret-deodorant-spray.jpg',
		name: 'Secret Full Body Deodorant Spray',
		store: {
			name: 'CVS',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6615.735738225325!2d-81.0330186579937!3d33.995927487776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8bb29bd47bb0d%3A0x8483a80ae0f2d231!2sCVS!5e0!3m2!1sen!2sus!4v1730067276718!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
			logo: 'cvs.png'
		},
		prices: ['5.00', '2.49'],
		deal: 'Buy One, Get One 50% Off',
		expiresAt: '1/1/25'
	},
	{
		_id: 20,
		type: 'hygiene',
		image: 'sinex-saline.jpg',
		name: 'Sinex Saline',
		store: {
			name: 'CVS',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6615.735738225325!2d-81.0330186579937!3d33.995927487776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8bb29bd47bb0d%3A0x8483a80ae0f2d231!2sCVS!5e0!3m2!1sen!2sus!4v1730067276718!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
			logo: 'cvs.png'
		},
		prices: ['5.00', '2.49'],
		deal: 'Buy One, Get One 50% Off',
		expiresAt: '1/1/25'
	},
	{
		_id: 21,
		type: 'grocery',
		image: 'bananas.jpg',
		name: 'Bananas',
		store: {
			name: 'Walmart',
			logo: 'walmart.webp'
		},
		prices: ['2.00', '1.00'],
		deal: '50% Off',
		expiresAt: '1/1/25'
	},
	{
		_id: 22,
		type: 'grocery',
		image: 'bananas.jpg',
		name: 'Bananas',
		store: {
			name: 'Aldi',
			logo: 'aldi.png',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.246932011891!2d-80.94133822482713!3d33.960492122570294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8b1ac447ad533%3A0xc9367c36cd037fcc!2sALDI!5e0!3m2!1sen!2sus!4v1731429953565!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
		},
		prices: ['2.00', '1.00'],
		deal: 'Buy One, Get One 50% Off',
		expiresAt: '1/1/25'
	},
	{
		_id: 23,
		type: 'grocery',
		image: 'cherries.jpg',
		name: 'Cherries',
		store: {
			name: 'Walmart',
			logo: 'walmart.webp'
		},
		prices: ['2.00', '1.00'],
		deal: '50% Off',
		expiresAt: '1/1/25'
	},
	{
		_id: 24,
		type: 'grocery',
		image: 'cherries.jpg',
		name: 'Cherries',
		store: {
			name: 'Aldi',
			logo: 'aldi.png',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.246932011891!2d-80.94133822482713!3d33.960492122570294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8b1ac447ad533%3A0xc9367c36cd037fcc!2sALDI!5e0!3m2!1sen!2sus!4v1731429953565!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
		},
		prices: ['2.00', '1.00'],
		deal: 'Buy One, Get One 50% Off',
		expiresAt: '1/1/25'
	},
	{
		_id: 25,
		type: 'grocery',
		image: 'cherries.jpg',
		name: 'Cherries',
		store: {
			name: 'Food Lion',
			logo: 'food-lion.png',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13230.888422060465!2d-81.0320934407241!3d33.99967102082561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8a532cbb7bea1%3A0x55235f2e7f75a1!2sFood%20Lion!5e0!3m2!1sen!2sus!4v1730065700902!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
		},
		prices: ['2.00', '1.00'],
		deal: 'Buy One, Get One Free',
		expiresAt: '11/1/24'
	},
	{
		_id: 26,
		type: 'grocery',
		image: 'apple.png',
		name: 'Apples',
		store: {
			name: 'Aldi',
			logo: 'aldi.png',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.246932011891!2d-80.94133822482713!3d33.960492122570294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8b1ac447ad533%3A0xc9367c36cd037fcc!2sALDI!5e0!3m2!1sen!2sus!4v1731429953565!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
		},
		prices: ['2.00', '1.00'],
		deal: 'Buy One, Get One 50% Off',
		expiresAt: '1/1/25'
	},
	{
		_id: 27,
		type: 'grocery',
		image: 'apple.png',
		name: 'Apples',
		store: {
			name: 'Walmart',
			logo: 'walmart.webp'
		},
		prices: ['2.00', '1.00'],
		deal: '50% Off',
		expiresAt: '1/1/25'
	},
	{
		_id: 28,
		type: 'grocery',
		image: 'dates.jpg',
		name: 'Dates',
		store: {
			name: 'Walmart',
			logo: 'walmart.webp'
		},
		prices: ['2.00', '1.00'],
		deal: '50% Off',
		expiresAt: '1/1/25'
	},
	{
		_id: 29,
		type: 'grocery',
		image: 'dates.jpg',
		name: 'Dates',
		store: {
			name: 'Aldi',
			logo: 'aldi.png',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.246932011891!2d-80.94133822482713!3d33.960492122570294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8b1ac447ad533%3A0xc9367c36cd037fcc!2sALDI!5e0!3m2!1sen!2sus!4v1731429953565!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
		},
		prices: ['2.00', '1.00'],
		deal: 'Buy One, Get One 50% Off',
		expiresAt: '1/1/25'
	},
	{
		_id: 44,
		type: 'grocery',
		image: 'dates.jpg',
		name: 'Dates',
		store: {
			name: 'Food Lion',
			logo: 'food-lion.png',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13230.888422060465!2d-81.0320934407241!3d33.99967102082561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8a532cbb7bea1%3A0x55235f2e7f75a1!2sFood%20Lion!5e0!3m2!1sen!2sus!4v1730065700902!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
		},
		prices: ['2.00', '1.00'],
		deal: 'Buy One, Get One Free',
		expiresAt: '11/1/24'
	},
	{
		_id: 30,
		type: 'grocery',
		image: 'eggplants.jpg',
		name: 'Eggplants',
		store: {
			name: 'Food Lion',
			logo: 'food-lion.png',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13230.888422060465!2d-81.0320934407241!3d33.99967102082561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8a532cbb7bea1%3A0x55235f2e7f75a1!2sFood%20Lion!5e0!3m2!1sen!2sus!4v1730065700902!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
		},
		prices: ['2.00', '1.00'],
		deal: 'Buy One, Get One Free',
		expiresAt: '11/1/24'
	},
	{
		_id: 31,
		type: 'grocery',
		image: 'eggplants.jpg',
		name: 'Eggplants',
		store: {
			name: 'Walmart',
			logo: 'walmart.webp'
		},
		prices: ['2.00', '1.00'],
		deal: '50% Off',
		expiresAt: '1/1/25'
	},
	{
		_id: 32,
		type: 'grocery',
		image: 'eggplants.jpg',
		name: 'Eggplants',
		store: {
			name: 'Aldi',
			logo: 'aldi.png',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.246932011891!2d-80.94133822482713!3d33.960492122570294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8b1ac447ad533%3A0xc9367c36cd037fcc!2sALDI!5e0!3m2!1sen!2sus!4v1731429953565!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
		},
		prices: ['2.00', '1.00'],
		deal: 'Buy One, Get One 50% Off',
		expiresAt: '1/1/25'
	},
	{
		_id: 33,
		type: 'grocery',
		image: 'figs.webp',
		name: 'Figs',
		store: {
			name: 'Food Lion',
			logo: 'food-lion.png',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13230.888422060465!2d-81.0320934407241!3d33.99967102082561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8a532cbb7bea1%3A0x55235f2e7f75a1!2sFood%20Lion!5e0!3m2!1sen!2sus!4v1730065700902!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
		},
		prices: ['2.00', '1.00'],
		deal: 'Buy One, Get One Free',
		expiresAt: '11/1/24'
	},
	{
		_id: 34,
		type: 'grocery',
		image: 'figs.webp',
		name: 'Figs',
		store: {
			name: 'Walmart',
			logo: 'walmart.webp'
		},
		prices: ['2.00', '1.00'],
		deal: '50% Off',
		expiresAt: '1/1/25'
	},
	{
		_id: 35,
		type: 'grocery',
		image: 'figs.webp',
		name: 'Figs',
		store: {
			name: 'Aldi',
			logo: 'aldi.png',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.246932011891!2d-80.94133822482713!3d33.960492122570294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8b1ac447ad533%3A0xc9367c36cd037fcc!2sALDI!5e0!3m2!1sen!2sus!4v1731429953565!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
		},
		prices: ['2.00', '1.00'],
		deal: 'Buy One, Get One 50% Off',
		expiresAt: '1/1/25'
	},
	{
		_id: 36,
		type: 'grocery',
		image: 'grapes.webp',
		name: 'Grapes',
		store: {
			name: 'Food Lion',
			logo: 'food-lion.png',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13230.888422060465!2d-81.0320934407241!3d33.99967102082561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8a532cbb7bea1%3A0x55235f2e7f75a1!2sFood%20Lion!5e0!3m2!1sen!2sus!4v1730065700902!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
		},
		prices: ['2.00', '1.00'],
		deal: 'Buy One, Get One Free',
		expiresAt: '11/1/24'
	},
	{
		_id: 37,
		type: 'grocery',
		image: 'grapes.webp',
		name: 'Grapes',
		store: {
			name: 'Walmart',
			logo: 'walmart.webp'
		},
		prices: ['2.00', '1.00'],
		deal: '50% Off',
		expiresAt: '1/1/25'
	},
	{
		_id: 38,
		type: 'grocery',
		image: 'grapes.webp',
		name: 'Grapes',
		store: {
			name: 'Aldi',
			logo: 'aldi.png',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.246932011891!2d-80.94133822482713!3d33.960492122570294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8b1ac447ad533%3A0xc9367c36cd037fcc!2sALDI!5e0!3m2!1sen!2sus!4v1731429953565!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
		},
		prices: ['2.00', '1.00'],
		deal: 'Buy One, Get One 50% Off',
		expiresAt: '1/1/25'
	},
	{
		_id: 39,
		type: 'grocery',
		image: 'honeydew.webp',
		name: 'Honeydew',
		store: {
			name: 'Food Lion',
			logo: 'food-lion.png',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13230.888422060465!2d-81.0320934407241!3d33.99967102082561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8a532cbb7bea1%3A0x55235f2e7f75a1!2sFood%20Lion!5e0!3m2!1sen!2sus!4v1730065700902!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
		},
		prices: ['2.00', '1.00'],
		deal: 'Buy One, Get One Free',
		expiresAt: '11/1/24'
	},
	{
		_id: 40,
		type: 'grocery',
		image: 'honeydew.webp',
		name: 'Honeydew',
		store: {
			name: 'Walmart',
			logo: 'walmart.webp'
		},
		prices: ['2.00', '1.00'],
		deal: '50% Off',
		expiresAt: '1/1/25'
	},
	{
		_id: 41,
		type: 'grocery',
		image: 'honeydew.webp',
		name: 'Honeydew',
		store: {
			name: 'Aldi',
			logo: 'aldi.png',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.246932011891!2d-80.94133822482713!3d33.960492122570294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8b1ac447ad533%3A0xc9367c36cd037fcc!2sALDI!5e0!3m2!1sen!2sus!4v1731429953565!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
		},
		prices: ['2.00', '1.00'],
		deal: 'Buy One, Get One 50% Off',
		expiresAt: '1/1/25'
	},
	{
		_id: 42,
		type: 'grocery',
		image: 'kiwis.jpg',
		name: 'Kiwis',
		store: {
			name: 'Food Lion',
			logo: 'food-lion.png',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13230.888422060465!2d-81.0320934407241!3d33.99967102082561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8a532cbb7bea1%3A0x55235f2e7f75a1!2sFood%20Lion!5e0!3m2!1sen!2sus!4v1730065700902!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
		},
		prices: ['2.00', '1.00'],
		deal: 'Buy One, Get One Free',
		expiresAt: '11/1/24'
	},
	{
		_id: 43,
		type: 'grocery',
		image: 'kiwis.jpg',
		name: 'Kiwis',
		store: {
			name: 'Walmart',
			logo: 'walmart.webp'
		},
		prices: ['2.00', '1.00'],
		deal: '50% Off',
		expiresAt: '1/1/25'
	},
	{
		_id: 45,
		type: 'grocery',
		image: 'kiwis.jpg',
		name: 'Kiwis',
		store: {
			name: 'Aldi',
			logo: 'aldi.png',
			location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.246932011891!2d-80.94133822482713!3d33.960492122570294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f8b1ac447ad533%3A0xc9367c36cd037fcc!2sALDI!5e0!3m2!1sen!2sus!4v1731429953565!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
		},
		prices: ['2.00', '1.00'],
		deal: 'Buy One, Get One 50% Off',
		expiresAt: '1/1/25'
	}
];

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
	res.json(coupons);
});

app.get('/api/coupons', (req, res) => {
	res.send(coupons);
});

const validateCoupon = coupon => {
	const schema = Joi.object({ // TODO coupon and store image
		_id: Joi.string().required(),
		type: Joi.string().required(),
		name: Joi.string().required(),
		storeName: Joi.string().required(),
		oldPrice: Joi.string().required(),
		deal: Joi.string().allow(''),
		expiresAt: Joi.string().required(),
		qualifyingItems: Joi.string().allow(''),
		details: Joi.string().allow('')
	});

	return schema.validate(coupon);
};

app.post('/api/coupons', upload.single('image'), (req, res) => {
	const result = validateCoupon(req.body);

	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}

	const coupon = {
		_id: req.body._id,
		type: req.body.type,
		name: req.body.name,
		store: {
			name: req.body.storeName,
			location: req.body.storeLocation
		},
		prices: [req.body.oldPrice, req.body.deal],
		deal: req.body.deal.match(/[a-zA-Z]/) ? req.body.deal : null,
		expiresAt: req.body.expiresAt,
		qualifyingItems: req.body.qualifyingItems === '' ? undefined : [req.body.qualifyingItems],
		details: req.body.details || undefined
	};

	if (req.file) {
		coupon.image = req.file.filename;
	}

	coupons.push(coupon);

	res.status(200).send(coupon);
});

app.get('/api/carts', (req, res) => {
	res.send(carts);
});

app.listen(3001, () => {
	console.log('Listening...');
});