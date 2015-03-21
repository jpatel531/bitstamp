var React = require('react/addons');
var rd3 = require('react-d3')
var LineChart = rd3.LineChart;

var _ = require('underscore');


var time = Date.parse(new Date()) / 1000

var BitStampChart = React.createClass({

	getInitialState: function() {

		return {
			asks: {
				name: "asks",
				values: [{x: time, y:254}]
			},
			bids: {
				name: "bids",
				values: [{x: time,y: 254}]
			}
		};
	},

	componentWillMount: function() {
		this.pusher = new Pusher("de504dc5763aeef9ff52");
		this.channel = this.pusher.subscribe("diff_order_book");
	},

	updateValues: function(values, key){
		var time = Date.parse(new Date()) / 1000

		var values = _.map(values, function(value){
			return {x: time, y: parseInt(value[0])}
		});

		var update = {}
		update[key] = {values: {$push: values}}

		var updatedState =  React.addons.update(this.state, update);

		return updatedState
	},

	componentDidMount: function() {
		this.channel.bind('data', function(data){

			_.each(data, function(values, key){
				if (values.length > 0){
					var updatedValues = this.updateValues(values, key);
					this.setState(updatedValues)
				}
			}.bind(this));

		}, this);

	},

	render: function() {

		// console.log('rendering')

		var lineData = [this.state.asks, this.state.bids]

		console.log(lineData);

		return (
			<LineChart
			  legend={true}
			  data={lineData}
			  width={1200}
			  height={600}
			  title="Line Chart"/>
		);
	}

});

React.render(
	<BitStampChart />,
	document.getElementById("app")
)