# Notes

## Import json file into MongoDB

```
$ mongoimport --db sma --collection referrers --file "../api/referrers.json" --jsonArray
```

## Express REST API with data stored in json file

```
app.get("/referrers", function (req, res){
	fs.readFile("../api/referrers.json", function (err,data) {
		if (err) throw err;
		return res.json(JSON.parse(data));
	});
});

app.get("/referrers/:id", function (req, res) {
	fs.readFile("../api/referrers.json", function (err,data) {
		if (err) throw err;
		var referrers = JSON.parse(data).referrers;
		if (referrers.length <= req.params.id || req.params.id < 0) {
			res.statusCode = 404;
			return res.send('Error 404: No referrer found');
		}
		return res.json({"referrer": referrers[req.params.id]});
	});
});
```