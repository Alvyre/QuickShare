<template>
	<div id="home">
		<div class="container" v-if="!loading">
			<div class="row row-centered">
		    	<div class="col-xs-12 col-sm-12 col-centered">
		    		<h3>Current Informations:</h3>
		   		</div> 		
		   	</div>
		    <div class="row row-centered" id="filter">
	    		<div class="col-xs-12 col-sm-12 col-centered">
	    			<h3 class="text-center"><span class="glyphicon glyphicon-filter"></span>Filters:</h3>
		    		<div class="btn-group btn-group-justified" role="group" aria-label="...">
					  <div class="btn-group" role="group">
					    <button type="button" class="btn btn-info" v-on:click="toggleInfo">
					    	<span class="glyphicon glyphicon-info-sign"></span>
					    </button>
					  </div>
					  <div class="btn-group" role="group">
					    <button type="button" class="btn btn-success" v-on:click="toggleEvent">
					    	<span class="glyphicon glyphicon-calendar"></span>
					    </button>
					  </div>
					  <div class="btn-group" role="group">
					    <button type="button" class="btn btn-warning" v-on:click="toggleHelp">
					    	<span class="glyphicon glyphicon-question-sign"></span>
					    </button>
					  </div>
					</div>
					<br>
	    		</div>
			</div>
				
	    	<div class="row row-centered">
	    		<div class="col-xs-12 col-sm-12 col-centered">
	    				<div class="panel-info" v-for="info in infos">
	    					<!-- INFO -->
	    						<div class="panel panel-info" :class="infoActive" v-if='info.category == "Info"'>
									<div class="panel-heading">
										<span>{{info.title}}</span>
									</div>
									<div class="panel-body">
										<p v-if="info.description"><span class="glyphicon glyphicon-comment" aria-hidden="true"></span> : {{info.description}}</p>
										<p>
											<span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span> : {{info.location}}, {{info.addInfo}}
										</p>
										<p><span class="glyphicon glyphicon-time" aria-hidden="true"></span> {{info.birthdate | localeDate }}</p>
										<p><span class="glyphicon glyphicon-hourglass" aria-hidden="true"></span> {{info.expirydate | TimeRemainingWith(info.birthdate) }}</p>
										<hr>
										<footer>
											<div class="right">
												<button type="button" class="btn btn-xs btn-success">
													<span class="glyphicon glyphicon-thumbs-up" aria-hidden="true" style="color: white;"></span>
												</button>
												<span>{{info.voteCount}}</span>
												<button type="button" class="btn btn-xs btn-danger">
													<span class="glyphicon glyphicon-thumbs-down" aria-hidden="true" style="color: white;"></span>
												</button>
											</div>
										</footer>
									</div>
		    					</div>
		    				<!-- Help -->
		    					<div class="panel panel-warning" :class="helpActive" v-if='info.category == "Help"'>
	    						
									<div class="panel-heading">
										<span>{{info.title}}</span>
									</div>
									<div class="panel-body">
										<p v-if="info.description"><span class="glyphicon glyphicon-comment" aria-hidden="true"></span> : {{info.description}}</p>
										<p>
											<span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span> : {{info.location}}, {{info.addInfo}}
										</p>
										<p><span class="glyphicon glyphicon-time" aria-hidden="true"></span> {{info.birthdate | localeDate }}</p>
										<p><span class="glyphicon glyphicon-hourglass" aria-hidden="true"></span> {{info.expirydate | TimeRemainingWith(info.birthdate) }}</p>
										<hr>
										<footer>
											<div class="right">
												<button type="button" class="btn btn-xs btn-success">
													<span class="glyphicon glyphicon-thumbs-up" aria-hidden="true" style="color: white;"></span>
												</button>
												<span>{{info.voteCount}}</span>
												<button type="button" class="btn btn-xs btn-danger">
													<span class="glyphicon glyphicon-thumbs-down" aria-hidden="true" style="color: white;"></span>
												</button>
											</div>
										</footer>
									</div>
		    					</div>		    				
		    				<!-- Event -->
	    						<div class="panel panel-success" :class="eventActive" v-if='info.category == "Event"'>
	    						
									<div class="panel-heading">
										<span>{{info.title}}</span>
									</div>
									<div class="panel-body">
										<p><span class="glyphicon glyphicon-comment" aria-hidden="true"></span> : {{info.description}}</p>
										<p>
											<span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span> : {{info.location}}, {{info.addInfo}}
										</p>
										<p>
											<span class="glyphicon glyphicon-user" aria-hidden="true"></span> : {{info.userList.length}}/{{info.userLimit}}
										</p>
										<p><span class="glyphicon glyphicon-time" aria-hidden="true"></span> {{info.birthdate | localeDate }}</p>
										<p><span class="glyphicon glyphicon-hourglass" aria-hidden="true"></span> {{info.expirydate | TimeRemainingWith(info.birthdate) }}</p>
										<hr>
										<footer>
											<div class="right">
												<button type="button" class="btn btn-xs btn-success">
													<span class="glyphicon glyphicon-thumbs-up" aria-hidden="true" style="color: white;"></span>
												</button>
												<span>{{info.voteCount}}</span>
												<button type="button" class="btn btn-xs btn-danger">
													<span class="glyphicon glyphicon-thumbs-down" aria-hidden="true" style="color: white;"></span>
												</button>
											</div>
										</footer>
									</div>
		    					</div>
		    			</div>
				</div>
	    	</div>
		</div> <!-- End Container -->
	</div>	
</template>

<script>
	import Store from '../store';

	export default {
		name: 'home',
		data () {
			return {
				infoActive: 'active',
				eventActive: 'active',
				helpActive: 'active',
				infos: []
			}	
		},
		mounted () {
			this.fetchInfos();
			Store.commit('loadingOn');
		},
		components: {
		},
		methods: {
			fetchInfos () {

		  		this.$http.get('http://www.sharinfo.api.romainfrancois.fr/api/infos').then((response) => {
		    		this.infos = response.data;
		    		Store.commit('loadingOff');
		  		}, (response) => {
		    		console.log('Error:', response);
		  		});
			},
			setClass (info) {
				switch(info.category) {
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
			},
			toggleInfo () {
				if(this.infoActive === 'active')
					this.infoActive = 'hide';
				else (this.infoActive = 'active')
				console.log(this.eventActive);
			},
			toggleEvent () {
				if(this.eventActive === 'active')
					this.eventActive = 'hide';
				else (this.eventActive = 'active')
				console.log(this.eventActive);
			},
			toggleHelp () {
				if(this.helpActive === 'active')
					this.helpActive = 'hide';
				else (this.helpActive = 'active')
				console.log(this.helpActive);
			}
		},
		computed: {
			loading () {
				return Store.state.loading;
			}
		},
		filters: {
			localeDate (date) {
				var localeDate = new Date(date);
				var options = { 
					weekday: 'short',
					year: 'numeric',
					month: 'short',
					day: 'numeric',
					timeZoneName: 'short',
					hour12: 'false',
					hour: '2-digit',
					min: '2-digit',
					sec: '2-digit'

				};
				return (localeDate.toLocaleString(options));
			},
			TimeRemainingWith (strDateB, strDateA) {
				let dateB = new Date(strDateB).getTime();
				let dateA = new Date(strDateA).getTime();

				var timeleft =new Date(Math.abs(dateB - dateA));
				
				let x = x = Math.floor(timeleft/1000);
				let seconds = x % 60;
				if(seconds<10) seconds = '0'+seconds;
				x = Math.floor(x/60);
				let minutes = x % 60;
				if(minutes<10) minutes = '0'+minutes;
				x = Math.floor(x/60);
				let hours = x % 24;
				if(hours<10) hours= '0'+hours;
				x = Math.floor(x/24);
				let days = x;
				if(days <10) days = '0'+days;

				return days +':' +hours +':' +minutes +':' +seconds;
			}
		}
	}	
</script>

<style>
	
</style>