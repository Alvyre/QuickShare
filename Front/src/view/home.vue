<template>
	<div id="home">
		<div class="container">
		    <section>
		    	<div class="row">
		    		<div class="col-xs-12 col-sm-12">
		    			<h3>Current Informations:</h3>
		    		</div>
		    		
		    	</div>
		    	<div class="row row-centered" id="filter">
		    		<h3><span class="glyphicon glyphicon-filter"></span>Filters:</h3>

		    		<div class="btn-group btn-group-justified" role="group" aria-label="...">
					  <div class="btn-group" role="group">
					    <button type="button" class="btn btn-primary">
					    	<span class="glyphicon glyphicon-info-sign"></span>
					    </button>
					  </div>
					  <div class="btn-group" role="group">
					    <button type="button" class="btn btn-success">
					    	<span class="glyphicon glyphicon-calendar"></span>
					    </button>
					  </div>
					  <div class="btn-group" role="group">
					    <button type="button" class="btn btn-warning">
					    	<span class="glyphicon glyphicon-question-sign"></span>
					    </button>
					  </div>
					</div>
					<br>
				</div>
		    	
				<div class="clearfix"></div>
				
		    	<div class="row row-centered">
		    		<div class="col-xs-12 col-sm-12 col-centered">
		    			<div v-for="post in posts">
		    				<infoLoader :type="post.category" :content="post"></infoLoader>
		    			</div>
		    			<div v-for="event in events">
		    				<infoLoader :type="event.category" :content="info"></infoLoader>
		    			</div>
				 		
					</div>
		    	</div>
		    </section>
		</div> <!-- End Container -->
	</div>	
</template>

<script>
import infoLoader from '../components/infoLoader.vue'

	export default {
		name: 'home',
		data () {
			return {
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
				}
			}	
		},
		mounted () {
			this.fetchInfos();
		},
		components: {
			infoLoader
		},
		methods: {
			fetchInfos () {

		  		this.$http.get('http://localhost:8080/api/infos/posts').then((response) => {
		    		this.posts = response.data;
		  		}, (response) => {
		    		console.log('Error:', response);
		  		});

		  		this.$http.get('http://localhost:8080/api/infos/events').then((response) => {
		    		this.events = response.data    	
		  		}, (response) => {
		    		console.log('Error:', response);
		  		});
			}
		}
	}	
</script>

<style>
	
</style>