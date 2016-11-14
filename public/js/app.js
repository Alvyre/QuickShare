

// Components
//======================================

Vue.component('info', {
	props: {
		type: { type: String, default: ''},
		content: {type: Object, default: {} }
	},
	template: `
	<div class="panel" :class="setClass">
		<div class="panel-heading">
			<span>{{content.title}}</span>
			<span class="badge right">
			<a><span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>
			<span>{{content.vote}}</span>
			<a><span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>
		</div>
		<div class="panel-body">
			<p>{{content.description}}</p>
			<p v-if='content.category == "Event"'> From: {{content.birthdate | formatDate}} <br> to: {{content.expirydate | formatDate}}</p>
			<p><span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span>: {{content.location}} <br>
				{{content.addInfo}}
			</p>
		</div>
	</div>`,
	computed: {
		setClass () {
			switch(this.type) {
				case 'Info':
				return 'panel-info';
				break;
				case 'Event':
				return 'panel-success';
				break;
				case 'Help':
				return 'panel-warning';
				break;
				default:
				return '';
				break;
			}
		}
	},
	methods: {

	},
	filters: {
		formatDate (date) {
			return moment(date, 'YYYY-MM-DD' );
		}
	}

});


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