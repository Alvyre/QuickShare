<template>
	<div id="home">
		<div class="container" v-if="!loading">
			<div class="row row-centered">
				<div class="col-xs-12 col-sm-12 col-centered">
					<h3>Active Information:</h3>
				</div> 		
			</div>

			<!-- Filter System -->
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
								<span class="glyphicon glyphicon-calendar"></span> Event
							</button>
						</div>
						<div class="btn-group" role="group">
							<button type="button" id="btnHelp" class="btn btn-warning" v-on:click="toggleHelp">
								<span class="glyphicon glyphicon-question-sign"></span> Help
							</button>
						</div>
					</div>
				</div>

				<!-- Sort system -->
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
			<!-- Add Info Button -->
			<div class="row row-centered" v-if="isConnected">
				<div class="col-xs-6 col-xs-offset-3 col-sm-4 col-sm-offset-4">
					<router-link to="/newInfo">
						<button type="button" class="btn btn-large btn-block btn-primary"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add Info</button>
					</router-link>
					<br>
				</div>
			</div>

			<!-- Current info -->
			<div class="row row-centered">
				<div class="col-xs-12 col-sm-12 col-centered">
					<div class="panel-info" v-for="info in infos">
						
						<!-- INFO -->
						<div class="panel panel-info" :class="infoActive" v-if='info.category == "Info"'>
							<div class="panel-heading">
								<span v-html="info.title"></span>
							</div>
							<div class="panel-body">
								<div class="row">
									<div v-if="info.description" class="col-xs-3 col-sm-1 col-md-1 col-lg-1"><span class="glyphicon glyphicon-console" aria-hidden="true"></span> :</div>
									<div class="col-xs-9 col-sm-11 col-md-11 col-lg-11" v-html="info.description"></div> 
								</div>
								<div class="row">
									<div class="col-xs-3 col-sm-1 col-md-1 col-lg-1"><span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span> :</div>
									<div class="col-xs-9 col-sm-11 col-md-11 col-lg-11"><span v-html="info.location"></span><span v-show="info.addInfo">, </span><span v-html="info.addInfo"></span></div>
								</div>
								<div class="row">
									<div class="col-xs-3 col-sm-1 col-md-1 col-lg-1"><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span> :</div>
									<div class="col-xs-9 col-sm-11 col-md-11 col-lg-11">{{info.birthdate | localeDate }}</div>
								</div>
								<div class="row">
									<div class="col-xs-3 col-sm-1 col-md-1 col-lg-1"><span class="glyphicon glyphicon-time" aria-hidden="true"></span> :</div>
									<div class="col-xs-9 col-sm-11 col-md-11 col-lg-11">{{info.expirydate | localeDate }}</div>
								</div>	
								<div class="row">
									<div class="col-xs-3 col-sm-1 col-md-1 col-lg-1"><span class="glyphicon glyphicon-hourglass" aria-hidden="true"></span> :</div>
									<div class="col-xs-9 col-sm-11 col-md-11 col-lg-11">{{info.expirydate | TimeRemainingWith(info.birthdate) }}</div>
								</div>
								<br/>
								<router-link v-bind:to="getRoute(info._id)" tag="a" v-if="isConnected"><p>Read more..</p></router-link>
								<hr>
							
								<footer>
									<router-link v-bind:to="getRoute(info._id)" class="pull-left" tag="a" v-if="info.acceptComments && isConnected"> {{info.comments.length}} <span class="glyphicon glyphicon-comment" aria-hidden="true"></span></router-link>
									<div class="pull-right">
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

						<!-- HELP -->
						<div class="panel panel-warning" :class="helpActive" v-if='info.category == "Help"'>

							<div class="panel-heading">
								<span v-html="info.title"></span>
							</div>
							<div class="panel-body">
								<div class="row">
									<div v-if="info.description" class="col-xs-3 col-sm-1 col-md-1 col-lg-1"><span class="glyphicon glyphicon-console" aria-hidden="true"></span> :</div>
									<div class="col-xs-9 col-sm-11 col-md-11 col-lg-11 col-centered text-center" v-html="info.description"></div> 
								</div>
								<div class="row">
									<div class="col-xs-3 col-sm-1 col-md-1 col-lg-1"><span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span> :</div>
									<div class="col-xs-9 col-sm-11 col-md-11 col-lg-11"><span v-html="info.location"></span><span v-show="info.addInfo">, </span><span v-html="info.addInfo"></span></div>
								</div>
								<div class="row">
									<div class="col-xs-3 col-sm-1 col-md-1 col-lg-1"><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span> :</div>
									<div class="col-xs-9 col-sm-11 col-md-11 col-lg-11">{{info.birthdate | localeDate }}</div>
								</div>
								<div class="row">
									<div class="col-xs-3 col-sm-1 col-md-1 col-lg-1"><span class="glyphicon glyphicon-time" aria-hidden="true"></span> :</div>
									<div class="col-xs-9 col-sm-11 col-md-11 col-lg-11">{{info.expirydate | localeDate }}</div>
								</div>	
								<div class="row">
									<div class="col-xs-3 col-sm-1 col-md-1 col-lg-1"><span class="glyphicon glyphicon-hourglass" aria-hidden="true"></span> :</div>
									<div class="col-xs-9 col-sm-11 col-md-11 col-lg-11">{{info.expirydate | TimeRemainingWith(info.birthdate) }}</div>
								</div>
								<br/>
								<router-link v-bind:to="getRoute(info._id)" tag="a" v-if="isConnected"><p>Read more..</p></router-link>
								<hr>
							
								<footer>
									<router-link v-bind:to="getRoute(info._id)" class="pull-left" tag="a" v-if="info.acceptComments && isConnected"> {{info.comments.length}} <span class="glyphicon glyphicon-comment" aria-hidden="true"></span></router-link>
									<div class="pull-right">
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

						<!-- EVENT -->
						<div class="panel panel-success" :class="eventActive" v-if='info.category == "Event"'>

							<div class="panel-heading">
								<span v-html="info.title"></span>
							</div>
							<div class="panel-body">
								<div class="row">
									<div v-if="info.description" class="col-xs-3 col-sm-1 col-md-1 col-lg-1"><span class="glyphicon glyphicon-console" aria-hidden="true"></span> :</div>
									<div class="col-xs-9 col-sm-11 col-md-11 col-lg-11 col-centered text-center" v-html="info.description"></div> 
								</div>
								<div class="row">
									<div class="col-xs-3 col-sm-1 col-md-1 col-lg-1"><span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span> :</div>
									<div class="col-xs-9 col-sm-11 col-md-11 col-lg-11"><span v-html="info.location"></span><span v-show="info.addInfo">, </span><span v-html="info.addInfo"></span></div>
								</div>
								<div class="row">
									<div class="col-xs-3 col-sm-1 col-md-1 col-lg-1"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> :</div>
									<div class="col-xs-9 col-sm-11 col-md-11 col-lg-11">{{info.userList.length}}<span v-if="info.userLimit">/{{info.userLimit}}</span></div>
								</div>
								<div class="row">
									<div class="col-xs-3 col-sm-1 col-md-1 col-lg-1"><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span> :</div>
									<div class="col-xs-9 col-sm-11 col-md-11 col-lg-11">{{info.birthdate | localeDate }}</div>
								</div>
								<div class="row">
									<div class="col-xs-3 col-sm-1 col-md-1 col-lg-1"><span class="glyphicon glyphicon-time" aria-hidden="true"></span> :</div>
									<div class="col-xs-9 col-sm-11 col-md-11 col-lg-11">{{info.expirydate | localeDate }}</div>
								</div>	
								<div class="row">
									<div class="col-xs-3 col-sm-1 col-md-1 col-lg-1"><span class="glyphicon glyphicon-hourglass" aria-hidden="true"></span> :</div>
									<div class="col-xs-9 col-sm-11 col-md-11 col-lg-11">{{info.expirydate | TimeRemainingWith(info.birthdate) }}</div>
								</div>
								<br/>
								<router-link v-bind:to="getRoute(info._id)" tag="a" v-if="isConnected"><p>Read more..</p></router-link>
								<hr>

								<footer>
									<router-link v-bind:to="getRoute(info._id)" class="pull-left" tag="a" v-if="info.acceptComments && isConnected"> {{info.comments.length}} <span class="glyphicon glyphicon-comment" aria-hidden="true"></span></router-link>
									<div class="pull-right">
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

// IMPORT
//=======================================

	import Store from '../store';
	import Cookie from '../cookie-handler';
	import Config from '../config';

// VUE
//=======================================

	export default {
		name: 'home',
		sockets:{

			//Triggered when the socket connect to the server
    		connect: function(){
      			console.log('socket connected')
    		},

    		//Triggered when a user update an info
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

    		//Triggered when a new info is added on the server
    		newInfo (info) {
    			console.log('socket:newinfo');
    			this.infos.push(info);
    		},

    		//Triggered when a user delete an info
    		deleteInfo (info) {
    			console.log('socket:deleteinfo');
    			for (var i = this.infos.length - 1; i >= 0; i--) {
    				if(this.infos[i]._id == info._id) {
    					this.infos.splice(i,1);
    				}
    			}
    		},

    		//Triggered when a user join an event
    		joinEvent (info) {
    			console.log('socket:joinEvent');
    			for (var i = this.infos.length - 1; i >= 0; i--) {
    				if(this.infos[i]._id == info.ID) {

    					this.infos[i].userList.push(info.userID);
    				}
    			}
    		},

    		//Triggered when a user leave an event
    		leaveEvent (info) {
    			console.log('socket:leaveEvent');
    			for (var i = this.infos.length - 1; i >= 0; i--) {
    				if(this.infos[i]._id == info.ID) {
    					this.infos[i].userList.splice(this.infos[i].userList.indexOf(info.userID), 1);
    					console.log('leave');
    				}
    			}
    		},

    		//Triggered when a user vote
    		voteUpdated (info) {
    			console.log('socket:voteUpdated');
    			for (var i = this.infos.length - 1; i >= 0; i--) {
    				if(this.infos[i]._id == info.ID) {
    					this.infos[i].voteCount = info.voteCount;
    				}
    			}
    		},
    		commentDeleted (comment) {
    			console.log('socket:commentDeleted');
    			for (var i = this.infos.length - 1; i >= 0; i--) {
    				if(this.infos[i]._id == comment.infoID) {
    					for (var j = this.infos[i].comments.length - 1; i >= 0; i--) {
    						if(this.infos[i].comments[j]._id == comment.ID) {
    							this.infos[i].comments.splice(j,1);
    						}
    					}
    				}
    			}
    		},
    		newComment (comment) {
    			console.log('socket:commentAdded');
    			for (var i = this.infos.length - 1; i >= 0; i--) {
    				if(this.infos[i]._id == comment.infoID) {
    					this.infos[i].comments.push(comment.content);
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
			// Get info and set loading display
			this.fetchInfos();
			Store.commit('loadingOn');
		},
		components: {
			isConnected () {
		        return Store.state.isConnected;
		    },
		    loading () {
		        return Store.state.loading;
		    }
		},
		methods: {
			fetchInfos () {

				//Request Options (CORS, Token etc..)
				var options = {
					credentials: true
				};

				// GET All info Request
				this.$http.get(Config.urlAPI +'/api/infos', options).then((response) => {

					//If Success
					this.infos = response.data;
					Store.commit('loadingOff');

				}, (response) => {
					//If Error
					console.log('Error:', response);
				});
			},
			//Filtering info (Show Only)
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
			//Set the route link for an info
			getRoute(infoID) {
				return '/info/'+infoID;
			},
			voteUp (info) {

				//If user disconnected stop the function
				if(!this.isConnected) return;
				
				//Request options (COORS, Token)
				var options = {
					headers: {
						'x-access-token': Cookie.getCookie('token')
					},
					credentials: true
				};

				// API Request Up Vote
				this.$http.post(Config.urlAPI +'/api/infos/'+info._id+'/upvote', {}, options).then((response) => {
				}, (response) => {

					//If Error
					console.log('Error:', response);
				});

				// We perform a locale update of the vote (changed or confirmed by the socket function)
				// In order to show quick response to the user
				var hadVoted = false;
				info.votes.every(function(element, index, array) {
					if(element.userID == Cookie.getCookie('userID')) {
						hadVoted = true;
						//The user already vote +1 so we negate his previous vote
						if(element.value == 1) {
							info.voteCount--;
							element.value = 0;	
						}
						//The user already vote -1 so we negate his previous vote and add the new one
						else if(element.value == -1) {
							info.voteCount +=2;
							element.value = 1;	
						}
						//The user already vote but also negated his vote (actual value 0) so +1
						else {
							info.voteCount++;
							element.value = 1;
						}
						return false;
					}
					return true;
				});
				//The user never voted, so +1
				if(!hadVoted) {
					info.voteCount ++;
					info.votes.push({userID: Cookie.getCookie('userID'), value: 1});	
				}
			},
			voteDown (info) {
				//If user disconnected stop the function
				if(!this.isConnected) return;

				//Request options (COORS, Token)
				var options = {
					headers: {
						'x-access-token': Cookie.getCookie('token')
					},
					credentials: true
				};

				// API Request Up Vote
				this.$http.post(Config.urlAPI +'/api/infos/'+info._id+'/downvote', {}, options).then((response) => {
				}, (response) => {
					
					//If error
					console.log('Error:', response);
				});

				// We perform a locale update of the vote (changed or confirmed by the socket function)
				// In order to show quick response to the user
				var hadVoted = false;
				info.votes.every(function(element, index, array) {
					if(element.userID == Cookie.getCookie('userID')) {
						hadVoted = true;

						//The user already vote +1 so we negate the vote, then add -1
						if(element.value == 1) {
							info.voteCount-=2;
							element.value = -1;	
						}
						//The user already vote -1 so we negate the vote
						else if(element.value == -1) {
							info.voteCount ++;
							element.value = 0;	
						}
						//The user already vote but negated and now value is 0, so -1
						else {
							info.voteCount--;
							element.value = -1;
						}
						return false;
					}
					return true;
				});
				//The user never voted, so -1
				if(!hadVoted) {
					info.voteCount ++;
					info.votes.push({userID: Cookie.getCookie('userID'), value: 1});	
				}
			},

			//Set CSS class for vote buttons
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

			//Get the current value for the user vote 
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

			//Sort Functions
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

				//Reset CSS Classes 'active' and order
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

				//Reset CSS Classes 'active' and order
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

				//Reset CSS Classes 'active' and order
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
				return Store.state.isConnected;
				//return Cookie.getCookie('Connected') == 'true';
			},

			//Toggle sort states
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