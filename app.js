var React = require('react');
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

	updateValues: function(data, key){
		var time = Date.parse(new Date()) / 1000


		var _values = _.map(data[key], function(value){
			// console.log(value);
			return {x: time, y: parseInt(value[0])}
		});

		var _newState = this.state[key].values.concat(_values)
		// var _newState = _newState.slice(Math.max(_newState.length - 30), 1);

		var newState = {}
		newState[key] = {name: key, values: _newState}
		// console.log(newState);
		return newState
	},

	componentDidMount: function() {
		this.channel.bind('data', function(data){

			if (data.asks.length > 0) {
				var updatedAsks = this.updateValues(data, 'asks')
				this.setState(updatedAsks)
			}

			if (data.bids.length > 0) {
				var updatedBids = this.updateValues(data, 'bids')
				this.setState(updatedBids);
			}

		}, this);

		// var counter = 0;

		// var self = this;
		// setInterval(function(){
		// 	var askValues = self.state.asks.values
		// 	var newAsks = self.state.asks.values.concat({x: counter, y: counter})

		// 	var newState = {asks: {name: "asks", values: newAsks}}

		// 	self.setState(newState)
		// 	counter ++;
		// }, 1000)

	},

	render: function() {

		// var lineData = [
		//   {
		//     name: "series1",
		//     values: [ { x: 0, y: 20 }, { x: 24, y: 10 } ]
		//   },
		//   {
		//     name: "series2",
		//     values: [ { x: 70, y: 82 }, { x: 76, y: 82 } ]
		//   }
		// ];

		// var lineData = [this.state.asks]
		// , this.state.bids]

		// console.log(lineData)

		return (
			<LineChart
			  legend={true}
			  data={[this.state.asks, this.state.bids]}
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