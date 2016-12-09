<template>
	<div id="home">
		<div class="container" v-if="!loading">
			<div class="row row-centered">
				<div class="col-xs-12 col-sm-12 col-centered">
					<h3>Active Information:</h3>
				</div> 		
			</div>
			<div class="row row-centered" id="filter">
				<div class="col-xs-12 col-sm-12 col-centered">
					<h3><span class="glyphicon glyphicon-filter"></span>Info Filters:</h3>
					<div class="clearfix"></div>
					<h4 style="text-align:left!important;">Show only:</h4>
					<div class="btn-group btn-group-justified" role="group" aria-label="...">
						<div class="btn-group" role="group">
							<button type="button" id="btnInfo" class="btn btn-info" v-on:click="toggleInfo">
								<span class="glyphicon glyphicon-info-sign"></span> General
							</button>
						</div>
						<div class="btn-group" role="group">
							<button type="button" id="btnEvent" class="btn btn-success" v-on:click="toggleEvent">
								<span class="glyphicon glyphicon-calendar"></span> Events
							</button>
						</div>
						<div class="btn-group" role="group">
							<button type="button" id="btnHelp" class="btn btn-warning" v-on:click="toggleHelp">
								<span class="glyphicon glyphicon-question-sign"></span> Help
							</button>
						</div>
					</div>
				</div>
				<div class="col-xs-12 col-sm-12">
					<h4 class="text-left">Sort by:</h4>
					<div class="btn-group btn-group-justified" role="group" aria-label="...">
						<div class="btn-group" role="group">
							<button type="button" id="btnVote" class="btn btn-default active" v-on:click="sortByVotes(infos)">
								Votes 
								<span class="glyphicon glyphicon-sort-by-attributes-alt" aria-hidden="true" v-show="setStateSortVote == -1"></span>
								<span class="glyphicon glyphicon-sort-by-attributes" aria-hidden="true" v-show="setStateSortVote == 1"></span>
								<span class="glyphicon glyphicon-unchecked" aria-hidden="true" v-show="setStateSortVote == 0"></span>
							</button>
						</div>
						<div class="btn-group" role="group">
							<button type="button" id="btnEndDate" class="btn btn-default" v-on:click="sortByExpiryDate(infos)">
								End date 
								<span class="glyphicon glyphicon-sort-by-attributes-alt" aria-hidden="true" v-show="setStateSortExpiryDate == -1"></span>
								<span class="glyphicon glyphicon-sort-by-attributes" aria-hidden="true" v-show="setStateSortExpiryDate == 1"></span>
								<span class="glyphicon glyphicon-unchecked" aria-hidden="true" v-show="setStateSortExpiryDate == 0"></span>
							</button>
						</div>
						<div class="btn-group" role="group">
							<button type="button" id="btnStartDate" class="btn btn-default" v-on:click="sortByBirthDate(infos)">
								Start date 
								<span class="glyphicon glyphicon-sort-by-attributes-alt" aria-hidden="true" v-show="setStateSortBirthDate == -1"></span>
								<span class="glyphicon glyphicon-sort-by-attributes" aria-hidden="true" v-show="setStateSortBirthDate == 1"></span>
								<span class="glyphicon glyphicon-unchecked" aria-hidden="true" v-show="setStateSortBirthDate == 0"></span>
							</button>
						</div>
					</div>

					

					<br>
				</div>
			</div>
			<div class="clearfix"></div>
			<div class="row row-centered" v-if="isConnected">
				<div class="col-xs-6 col-xs-offset-3 col-sm-4 col-sm-offset-4">
					<router-link to="/newInfo">
						<button type="button" class="btn btn-large btn-block btn-primary"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add Info</button>
					</router-link>
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
									<p><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span> {{info.birthdate | localeDate }}</p>
									<p><span class="glyphicon glyphicon-time" aria-hidden="true"></span> {{info.expirydate | localeDate }}</p>
									<p><span class="glyphicon glyphicon-hourglass" aria-hidden="true"></span> {{info.expirydate | TimeRemainingWith(info.birthdate) }}</p>
									<router-link v-bind:to="getRoute(info._id)" tag="a"><p>Read more..</p></router-link>
									<hr>
								<footer>
									<div class="right">
										<button type="button" class="btn btn-xs btn-success" :class="setVoteClassBtnGreen(info)" v-on:click.stop.prevent="voteUp(info)">
											<span class="glyphicon glyphicon-thumbs-up" aria-hidden="true" style="color: white;"></span>
										</button>
										<span>{{info.voteCount}}</span>
										<button type="button" class="btn btn-xs btn-danger" :class="setVoteClassBtnRed(info)" v-on:click.stop.prevent="voteDown(info)">
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
									<p><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span> {{info.birthdate | localeDate }}</p>
									<p><span class="glyphicon glyphicon-time" aria-hidden="true"></span> {{info.expirydate | localeDate }}</p>
									<p><span class="glyphicon glyphicon-hourglass" aria-hidden="true"></span> {{info.expirydate | TimeRemainingWith(info.birthdate) }}</p>
									<router-link v-bind:to="getRoute(info._id)" tag="a"><p>Read more..</p></router-link>
									<hr>
							
								<footer>
									<div class="right">
										<button type="button" class="btn btn-xs btn-success" :class="setVoteClassBtnGreen(info)" v-on:click.stop.prevent="voteUp(info)">
											<span class="glyphicon glyphicon-thumbs-up" aria-hidden="true" style="color: white;"></span>
										</button>
										<span>{{info.voteCount}}</span>
										<button type="button" class="btn btn-xs btn-danger" :class="setVoteClassBtnRed(info)" v-on:click.stop.prevent="voteDown(info)">
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
										<span class="glyphicon glyphicon-user" aria-hidden="true"></span> : {{info.userList.length}}<span v-if="info.userLimit">/{{info.userLimit}}</span>
									</p>
									<p><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span> {{info.birthdate | localeDate }}</p>
									<p><span class="glyphicon glyphicon-time" aria-hidden="true"></span> {{info.expirydate | localeDate }}</p>
									<p><span class="glyphicon glyphicon-hourglass" aria-hidden="true"></span> {{info.expirydate | TimeRemainingWith(info.birthdate) }}</p>
									<router-link v-bind:to="getRoute(info._id)" tag="a"><p>Read more..</p></router-link>
									<hr>
								
								<footer>
									<div class="right">
										<button type="button" class="btn btn-xs btn-success" :class="setVoteClassBtnGreen(info)" v-on:click.stop.prevent="voteUp(info)">
											<span class="glyphicon glyphicon-thumbs-up" aria-hidden="true" style="color: white;"></span>
										</button>
										<span>{{info.voteCount}}</span>
										<button type="button" class="btn btn-xs btn-danger" :class="setVoteClassBtnRed(info)" v-on:click.stop.prevent="voteDown(info)">
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
	import Cookie from '../cookie-handler';
	import Config from '../config';

	export default {
		name: 'home',
		sockets:{
    		connect: function(){
      			console.log('socket connected')
    		},
    		updateInfo (info) {
    			console.log('socket:updateinfo');

    			for (var i = this.infos.length - 1; i >= 0; i--) {

    				if(this.infos[i]._id == info._id) {
    					this.infos[i].title 		= info.title;
    					this.infos[i].description 	= info.description;
    					this.infos[i].birthdate 	= info.birthdate;
    					this.infos[i].expirydate    = info.expirydate;
    					this.infos[i].category		= info.category;
    					this.infos[i].location		= info.location;
    					this.infos[i].addInfo 		= info.addInfo;
    					this.infos[i].userLimit 	= info.userLimit;
    					this.infos[i].acceptOverload= info.acceptOverload;
    					return;
    				}
    			}
    		},
    		newInfo (info) {
    			console.log('socket:newinfo');
    			this.infos.push(info);
    		},
    		deleteInfo (info) {
    			console.log('socket:deleteinfo');
    			for (var i = this.infos.length - 1; i >= 0; i--) {
    				if(this.infos[i]._id == info._id) {
    					this.infos.splice(i,1);
    				}
    			}
    		},
    		joinEvent (info) {
    			console.log('socket:joinEvent');
    			for (var i = this.infos.length - 1; i >= 0; i--) {
    				if(this.infos[i]._id == info.ID) {

    					this.infos[i].userList.push(info.userID);
    				}
    			}
    		},
    		leaveEvent (info) {
    			console.log('socket:leaveEvent');
    			for (var i = this.infos.length - 1; i >= 0; i--) {
    				if(this.infos[i]._id == info.ID) {
    					this.infos[i].userList.splice(this.infos[i].userList.indexOf(info.userID), 1);
    					console.log('leave');
    				}
    			}
    		},
    		voteUpdated (info) {
    			console.log('socket:voteUpdated');
    			for (var i = this.infos.length - 1; i >= 0; i--) {
    				if(this.infos[i]._id == info.ID) {
    					this.infos[i].voteCount = info.voteCount;
    				}
    			}
    		}
    	},
		data () {
			return {
				infoActive: 'active',
				eventActive: 'active',
				helpActive: 'active',
				infos: [],
				isSortedByVotes: {
					state: true,
					order: -1
				},
				isSortedByEnd: {
					state: false,
					order: 1
				},
				isSortedByStart: {
					state: false,
					order: 1
				}
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

				this.$http.get(Config.urlAPI +'/api/infos').then((response) => {
					this.infos = response.data;
					Store.commit('loadingOff');
				}, (response) => {
					console.log('Error:', response);
				});
			},
			toggleInfo () {
				if(this.infoActive === 'active') {
					this.infoActive = 'hide';
					$('#btnInfo').removeClass('btn-info');
					$('#btnInfo').addClass('btn-grey');
				}
				else {
					(this.infoActive = 'active')
					$('#btnInfo').removeClass('btn-grey');
					$('#btnInfo').addClass('btn-info');	
				} 
			},
			toggleEvent () {
				if(this.eventActive === 'active') {
					this.eventActive = 'hide';
					$('#btnEvent').removeClass('btn-success');
					$('#btnEvent').addClass('btn-grey');
				}
				else {
					(this.eventActive = 'active');
					$('#btnEvent').removeClass('btn-grey');
					$('#btnEvent').addClass('btn-success');
				}
			},
			toggleHelp () {
				if(this.helpActive === 'active') {
					this.helpActive = 'hide';
					$('#btnHelp').removeClass('btn-warning');
					$('#btnHelp').addClass('btn-grey');
				}
				else {
					(this.helpActive = 'active');
					$('#btnHelp').removeClass('btn-grey');
					$('#btnHelp').addClass('btn-warning');
				}
			},
			getRoute(infoID) {
				return '/info/'+infoID;
			},
			voteUp (info) {
				if(!this.isConnected) return;
				var options = {
					headers: {
						'x-access-token': Cookie.getCookie('token')
					},
					credentials: true
				};

				this.$http.post(Config.urlAPI +'/api/infos/'+info._id+'/upvote', {}, options).then((response) => {
				}, (response) => {
					console.log('Error:', response);
				});
				var hadVoted = false;
				info.votes.every(function(element, index, array) {
					if(element.userID == Cookie.getCookie('userID')) {
						hadVoted = true;
						if(element.value == 1) {
							info.voteCount--;
							element.value = 0;	
						} 
						else if(element.value == -1) {
							info.voteCount +=2;
							element.value = 1;	
						}
						else {
							info.voteCount++;
							element.value = 1;
						}
						return false;
					}
					return true;
				});
				if(!hadVoted) {
					info.voteCount ++;
					info.votes.push({userID: Cookie.getCookie('userID'), value: 1});	
				}
			},
			voteDown (info) {
				if(!this.isConnected) return;
				var options = {
					headers: {
						'x-access-token': Cookie.getCookie('token')
					},
					credentials: true
				};

				this.$http.post(Config.urlAPI +'/api/infos/'+info._id+'/downvote', {}, options).then((response) => {
				}, (response) => {
					console.log('Error:', response);
				});
				var hadVoted = false;
				info.votes.every(function(element, index, array) {
					if(element.userID == Cookie.getCookie('userID')) {
						hadVoted = true;
						if(element.value == 1) {
							info.voteCount-=2;
							element.value = -1;	
						} 
						else if(element.value == -1) {
							info.voteCount ++;
							element.value = 0;	
						}
						else {
							info.voteCount--;
							element.value = -1;
						}
						return false;
					}
					return true;
				});
				if(!hadVoted) {
					info.voteCount ++;
					info.votes.push({userID: Cookie.getCookie('userID'), value: 1});	
				}
			},
			setVoteClassBtnGreen (info) {
				return {
					'disabled': !this.isConnected,
					'green': this.getVoteStatus(info) == 1
				};
			},
			setVoteClassBtnRed (info) {
				return {
					'disabled': !this.isConnected,
					'red': this.getVoteStatus(info) == -1
				};
			},
			getVoteStatus(info) {
				var status;
				info.votes.every(function(element, index, array) {
					if(element.userID == Cookie.getCookie('userID')) {
						if(element.value == 1) status = 1;
						else if(element.value == 0) status = 0;
						else status = -1;
						return false; 
					}
					return true;
				});
				return status;
			},
			sortByBirthDate (array) {
				if(this.isSortedByStart.order === -1) {
					this.isSortedByStart.order = 1;
					array.sort(function(a,b) { 
    					return new Date(a.birthdate).getTime() - new Date(b.birthdate).getTime() 
					});	
				}
				else {
					this.isSortedByStart.order = -1;
					array.sort(function(a,b) { 
    					return new Date(b.birthdate).getTime() - new Date(a.birthdate).getTime() 
					});
				}
				$('#btnVote').removeClass('active');
				$('#btnEndDate').removeClass('active');
				$('#btnStartDate').addClass('active');
				this.isSortedByStart.state 	= true;
				this.isSortedByEnd.state   	= false;
				this.isSortedByEnd.order 	= -1;		// we reinit to have ascend order by default
				this.isSortedByVotes.state	= false;
				this.isSortedByVotes.order  = -1;
			},
			sortByExpiryDate (array) {
				if(this.isSortedByEnd.order === -1) {
					this.isSortedByEnd.order = 1;
					array.sort(function(a,b) { 
    					return new Date(a.expirydate).getTime() - new Date(b.expirydate).getTime() 
					});	
				}
				else {
					this.isSortedByEnd.order = -1;
					array.sort(function(a,b) { 
    					return new Date(b.expirydate).getTime() - new Date(a.expirydate).getTime() 
					});
				}
				$('#btnVote').removeClass('active');
				$('#btnStartDate').removeClass('active');
				$('#btnEndDate').addClass('active');
				this.isSortedByEnd.state 	= true;
				this.isSortedByStart.state 	= false;
				this.isSortedByStart.order  = -1;
				this.isSortedByVotes.state 	= false;
				this.isSortedByVotes.order  = -1;
			},
			sortByVotes (array) {
				if(this.isSortedByVotes.order === -1) {
					this.isSortedByVotes.order = 1;
					array.sort(function(a,b) { 
    					return a.voteCount - b.voteCount 
					});	
				}
				else {
					this.isSortedByVotes.order = -1;
					array.sort(function(a,b) { 
    					return b.voteCount - a.voteCount 
					});
				}
				$('#btnStartDate').removeClass('active');
				$('#btnEndDate').removeClass('active');
				$('#btnVote').addClass('active');
				this.isSortedByEnd.state 	= false;
				this.isSortedByEnd.order 	= -1;
				this.isSortedByStart.state 	= false;
				this.isSortedByStart.order 	= -1;
				this.isSortedByVotes.state 	= true;
			}
		},
		computed: {
			loading () {
				return Store.state.loading;
			},
			isConnected() {
				return Cookie.getCookie('Connected') == 'true';
			},
			setStateSortVote () {
				if(this.isSortedByVotes.state && this.isSortedByVotes.order == 1) return 1;
				if(this.isSortedByVotes.state && this.isSortedByVotes.order == -1) return -1;

				return 0;
			},
			setStateSortBirthDate () {
				if(this.isSortedByStart.state && this.isSortedByStart.order == 1) return 1;
				if(this.isSortedByStart.state && this.isSortedByStart.order == -1) return -1;

				return 0;
			},
			setStateSortExpiryDate () {
				if(this.isSortedByEnd.state && this.isSortedByEnd.order == 1) return 1;
				if(this.isSortedByEnd.state && this.isSortedByEnd.order == -1) return -1;

				return 0;
			}


		},
		filters: {
			localeDate (date) {
				var localeDate = new Date(date);
				return (localeDate.toLocaleString('en-US', {'hour12':false}));
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
.green>span {
	color: green!important;
}
.red>span {
	color: red!important;
}
</style>