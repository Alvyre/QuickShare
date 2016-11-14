

// Components
//======================================




// Setup
//======================================

Vue.http.options.root = '/root';
Vue.http.headers.common['Authorization'] = 'Basic YXBpOnBhc3N3b3Jk';


// MAIN APP Vue
//======================================

new Vue({
	el: '#app',
	data: {
		isInfoActive: true,
		isEventActive: true,
		isHelpActive: true,
		posts: [],
		events: [],
		info: {
			title: {type: String},
			description: {type: String},
			birthdate: {type: Date},
			expirydate: {type: Date},
			category: {type: String},
			location: {type: String},
			addInfo: {type: String},
			userID: {type: String}
		},
		isConnected: false
	}, 
	mounted: function() {
		this.fetchInfos();
	},
	methods: {
		fetchInfos () {

		  	this.$http.get('/api/infos/posts').then((response) => {
		    	this.posts = response.data;
		  	}, (response) => {
		    	console.log('Error:', response);
		  	});

		  	this.$http.get('/api/infos/events').then((response) => {
		    		this.events = response.data    	
		  	}, (response) => {
		    	console.log('Error:', response);
		  	});
		},
		addInfo () {

		}
	}
});