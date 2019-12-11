import * as firebase from 'firebase';
require("firebase/firestore");

var collectionMeta={
	"events":{
		"fields":{
			"group":"REFERENCE:/groups/YOURDEFAULTGROUP",
			"name":"D New Event name",
			"tickets":["some"],
			"location":new firebase.firestore.GeoPoint(41.22, 22.34)
		},
		"collections":["tickets"],
	},
	"tickets":{
		"fields":{
			"price":"300",
			"name":"Regular"
		},
		"collections":["nested"],
	},
	"nested":{
		"fields":{
			"name":"nested collection"
		},
		"collections":[],
	},
	"TEMPLATE":{
		"fields":{},
		"collections":[],
	}
}
module.exports = collectionMeta;