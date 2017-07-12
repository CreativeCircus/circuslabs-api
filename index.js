const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(cors())

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test')

var Item = mongoose.model('Item', { name: String, type: String, content: String });


app.get('/', function (req, res) {
	res.send('Hello World!')
})

app.get('/data/:name', function (req, res) {

	Item.findOne({ name: req.params.name }, function(err, item) {
		if (err) {
			console.error("error")
			res.status(500).send("error")
		} else if (!item) {
			res.status(404).send("Could not find data by that name")
		} else {
			console.log(item);
			res.status(200).send(item.content)
		}
	});
})


app.post('/data/:name', function (req, res) {
	
	Item.findOne({ name: req.params.name }, function(err, item) {
		if (err) {
			console.error("error")
			res.status(500).send("error")
			return
		}
		if (!item) {
			item = new Item();
			item.name = req.params.name;
		}
	
		if (!req.body.type) {
			res.status(400).send("You must provide a data type");
			return;
		} else if (req.body.type != "number" && req.body.type != "string") {
			res.status(400).send("You must provide a valid data type of 'string' or 'number' ");
			return;
		} else if (req.body.type == "number") {
			// res.send(item.content)
			// return
			if (isNaN(item.content) || !item.content || item.content == "NaN") {
				// res.send(item.content)
				// return
				item.content = 0;
			}
			if (!req.body.action) {
				res.status(400).send("For numbers, you must provide an action: '++', '--', '+=', or '=' ");
				return
			} else if (req.body.action == "++") {
				item.content++;
			} else if (req.body.action == "--") {
				item.content--;
			} else if (req.body.action == "+=") {
				if (!req.body.quantity) {
					res.status(400).send("For numbers, with action '+=', you have to provide a quantity");
					return
				}
				item.content -= -req.body.quantity;
			} else if (req.body.action == "=") {
				if (!req.body.quantity) {
					res.status(400).send("For numbers, with action '=', you have to provide a quantity");
					return
				}
				item.content = req.body.quantity;
			}
			
		} else if (req.body.type == "string") {
			
			if (!req.body.content) {
				res.status(400).send("For strings, you have to provide a 'content' property");
				return
			} else if (req.body.content.length > 4096) {
				res.status(400).send("Strings have a max length of 4096 characters. Yours was " + req.body.content.length + " characters long.");
				return
			}
			item.content = req.body.content;
			
		}

		item.save()
		res.send(item.content)
	})
})

app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
})