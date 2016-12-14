<template>
	<div id="info">
		<div class="row" v-if="infoData.length != 0">
			<div class="col-xs-12 col-sm-12">
			<!-- Display Information -->
				<div class="panel panel-success" :class="setInfoClass()">
					<div class="panel-heading">
						<span>{{infoData.title}}</span>
					</div>
					<div class="panel-body">
						<p><span class="glyphicon glyphicon-flag" aria-hidden="true"></span> : {{infoData.category}}</p>
						<p><span class="glyphicon glyphicon-comment" aria-hidden="true"></span> : {{infoData.description}}</p>
						<p>
							<span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span> : {{infoData.location}}<span v-if='infoData.addInfo'>,</span> {{infoData.addInfo}}
						</p>
						<p>
							<span v-if="infoData.category == 'Event'"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> : {{infoData.userList.length}}<span v-if="infoData.userLimit">/{{infoData.userLimit}}</span></span> <button type="button" class="btn btn-xs btn-default" v-show="!showMembers" v-on:click="toggleShowMembers()">Show members</button><button type="button" class="btn btn-xs btn-default" v-show="showMembers" v-on:click="toggleShowMembers()">Hide members</button>
						</p>
							<div class="col-centered col-xs-6 col-xs-offset-3" v-show="showMembers">
							  
							  <router-link v-for="user in infoData.userList" v-bind:to="setUserRoute(user.ID)"><button type="button" class="text-center list-group-item" style="text-align: center!important;">{{ user.username }}</button></router-link>
							</div>
							<div class="clearfix" v-if="showMembers"><br></div>
						<p><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span> {{infoData.birthdate | localeDate }}</p>
						<p><span class="glyphicon glyphicon-time" aria-hidden="true"></span> {{infoData.expirydate | localeDate }}</p>
						<p><span class="glyphicon glyphicon-hourglass" aria-hidden="true"></span> {{infoData.expirydate | TimeRemainingWith(infoData.birthdate) }}</p>
						<button type="button" class="btn btn-large btn-block btn-success" v-if="infoData.category == 'Event' && !isEventJoined" :class="isEventFull" v-on:click.prevent.stop="joinEvent(infoData, $event)">Join Event</button>
						<button type="button" class="btn btn-large btn-block btn-danger" v-if="infoData.category == 'Event' && isEventJoined" v-on:click.prevent.stop="leaveEvent(infoData, $event)" :class="disableLeave" id="leaveBtn">Leave Event</button>
						<hr>
						<footer>
							<div class="right">
								<button type="button" class="btn btn-xs btn-success" :class="setVoteClassBtnGreen()" v-on:click.prevent.stop="voteUp()">
									<span class="glyphicon glyphicon-thumbs-up" aria-hidden="true" style="color: white;"></span>
								</button>
								<span>{{updateVoteCount}}</span>
								<button type="button" class="btn btn-xs btn-danger" :class="setVoteClassBtnRed()" v-on:click.prevent.stop="voteDown()">
									<span class="glyphicon glyphicon-thumbs-down" aria-hidden="true" style="color: white;"></span>
								</button>
							</div>
						</footer>
					</div>
					<div class="clearfix"><br></div>
					<div class="alert alert-danger text-center col-xs-6 col-xs-offset-3 col-sm-6 col-sm-offset-3" v-if="errorCode">
						<strong>Error {{errorCode}}:</strong> {{errorMsg}}
					</div>
				</div>
			</div>
		</div>
		<!-- EDIT ARTICLE -->
		<div class="row" v-if="infoData.length != 0 && isMyArticle">
			<!-- Edit & Delete buttons -->
			<div class="col-xs-4 col-xs-offset-1 col-sm-4 col-sm-offset-1">
				<button type="button" class="btn btn-large btn-block btn-primary" v-on:click.prevent.stop="toggleEdit()" >Edit <span class="glyphicon glyphicon-menu-down" aria-hidden="true" v-show='!isArticleEditing'></span><span class="glyphicon glyphicon-menu-up" aria-hidden="true" v-show='isArticleEditing'></span></button>
			</div>
			<div class="col-xs-4 col-xs-offset-2 col-sm-4 col-sm-offset-2">
				<button type="button" class="btn btn-large btn-block btn-danger" v-on:click="deleteArticle()"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Delete</button>
			</div>
			<div class="clearfix"><br><br></div>

			<!-- Edit Form -->			
			<div class="col-xs-12 col-sm-12">
				<form action="" method="POST" role="form" v-show="isArticleEditing" v-on:submit.prevent.stop="updateArticle()">
					<legend>Edit my info:</legend>

					<div class="form-group">
						<label for="title">Title</label>
						<input type="text" class="form-control" id="title" v-bind:placeholder="infoData.title" v-model="editedArticle.title">
					</div>
					<div class="form-group">
						<label for="description">Description</label>
						<textarea type="text" class="form-control" id="description" v-bind:placeholder="infoData.description" v-model="editedArticle.description"></textarea>
					</div>
					<div class="form-group">
						<label for="location">Location</label>
						<input type="text" class="form-control" id="location" v-bind:placeholder="infoData.location" v-model="editedArticle.location">
						<input type="text" class="form-control" name="addInfo" v-bind:placeholder="infoData.addInfo" v-model="editedArticle.addInfo">
					</div>
					<div class="form-group" v-if="infoData.category == 'Event'">
						<div class="checkbox checkbox-inline">
							<label>
								<input type="checkbox" v-bind:value="infoData.acceptOverload" v-model="editedArticle.acceptOverload">
								Accept Overload?
							</label>
						</div>
					</div>
					<div class="form-group" v-show="!editedArticle.acceptOverload">
						<label for="userLimit">User limit</label> <em>(minimum: {{setMinUserLimit}})</em>
						<input type="text" class="form-control" id="userLimit" v-bind:placeholder="infoData.userLimit" v-model="editedArticle.userLimit">
					</div>

					<div class="form-group">
						<label for="expirydate">End Date</label>
						<em>(maximum date: {{options.maxDate | localeDate}})</em>
						<Flatpickr :options='options' :class="form-control" :message="infoData.expirydate" @update="updateExpiryDate"/>
					</div>
					<div class="alert alert-success text-center col-xs-6 col-xs-offset-3 col-sm-6 col-sm-offset-3" v-show="successMsg">
						<strong>{{successMsg}}</strong>
					</div>
					<div class="alert alert-danger text-center col-xs-6 col-xs-offset-3 col-sm-6 col-sm-offset-3" v-if="errorMsg">
						<strong>Error {{errorCode}}:</strong> {{errorMsg}}
					</div>
					<button type="submit" class="btn btn-large btn-block btn-primary">Submit</button>
				</form>
			</div>
		</div>
	</div>
</template>

<script>

//IMPORTS
//==================================

import Store from '../store';
import Cookie from '../cookie-handler';
import Config from '../config';
import Flatpickr from 'vue-flatpickr/vue-flatpickr-material_blue.vue'
var moment = require('moment');
moment().format();

// Vue 
//==================================

export default {
	name: 'info',
	sockets: {

		//Triggered when the socket connect to the server
		connect: function(){
			console.log('socket connected');
		},

		//Triggered when an info is updated on the server
		updateInfo (info) {
			console.log('socket:updateinfo');
			if(this.infoData._id == info._id) {
				this.infoData.title 		= info.title;
				this.infoData.description 	= info.description;
				this.infoData.birthdate 	= info.birthdate;
				this.infoData.expirydate    = info.expirydate;
				this.infoData.category		= info.category;
				this.infoData.location		= info.location;
				this.infoData.addInfo 		= info.addInfo;
				this.infoData.userLimit 	= info.userLimit;
				this.infoData.acceptOverload= info.acceptOverload;
			}
		},

		//Triggered when an info is deleted on the server
		deleteInfo (info) {
			console.log('socket:deleteinfo');
			if(this.infoData._id == info._id && this.infoData.userID != Cookie.getCookie('userID')) {
				alert('Sorry, this info just has beed deleted, you will be redirected');
				this.$router.push('/');
			}
		},

		//Triggered when a user join a event
		joinEvent (info) {
			console.log('socket:joinEvent');
			if(this.infoData._id == info.ID && this.infoData.category == 'Event') {
				this.infoData.userList.push({ID: info.userID, username: info.username });
			}
		},

		//Trigerred when a user leave and event
		leaveEvent (info) {
			console.log('socket:leaveEvent');
			if(this.infoData._id == info.ID && this.infoData.category == 'Event') {
				this.infoData.userList.splice(this.infoData.userList.indexOf(info.userID), 1);
			}
		},

		//Triggered when a user vote
		voteUpdated (info) {
			console.log('socket:voteUpdated');
			if(this.infoData._id == info.ID) {
				this.infoData.voteCount = info.voteCount;
			}
		}
	},
	data () {
		return {
			infoData: [],
			errorMsg: '',
			errorCode: '',
			successMsg: '',
			isArticleEditing: false,
			showMembers: false,
			editedArticle: {
				title: '',
				description: '',
				location: '',
				addInfo: '',
				acceptOverload: false,
				userLimit: '',
				expirydate: null
			},
			options: {
				enableTime: true,
				time_24hr: true,
				defaultDate: null,
				minDate: null,
				maxDate: null
			}
		}
	},
	components: {
		Flatpickr
	},
	mounted () {
		//Get info and set loading screen
		Store.commit('loadingOn');
		this.fetchInfoData();	
	},
	methods : {
		fetchInfoData () {

			//If user disconnected, redirect to the homepage
			if(!this.isConnected) {
				this.$router.push('/');
				return;
			}

			//Request options (COORS, token)
			var options = {
				headers: {
					'x-access-token': Cookie.getCookie('token')
				},
				credentials: true
			};
			//Get the info ID from the URL
			let idInfo = (document.URL.split('/'))[4];
			
			//API Get the info by ID
			this.$http.get(Config.urlAPI +'/api/infos/id/'+idInfo, options).then((response) => {

				//If success request
				Store.commit('loadingOff');

				//If error (data error)
				if(response.status != 200) {
					this.errorMsg = response.data.message;
					this.errorCode = response.status;
				}
				else {
					
					this.infoData = response.data;
					this.editedArticle.acceptOverload = this.infoData.acceptOverload;
					
					//Bind Dates to the Flatpickr object (expirydate edit info side)
					this.options.minDate = moment(this.infoData.birthdate).format();
					this.options.defaultDate = moment(this.infoData.expirydate).format();
					this.editedArticle.expirydate = moment(this.infoData.expirydate).format();
					this.options.maxDate = moment(this.infoData.birthdate).add(1, 'd').format();
				}

			}, (response) => {
				//If error (request error)
				console.log('Error:', response);
				this.errorMsg = response.data.message;
				Store.commit('loadingOff');

				//If Token invalid
				if(response.status == 403) {
					this.errorMsg = 'Unknown/Expired token, please try to login again';
					Cookie.deleteCookie('token');
					Cookie.deleteCookie('Connected');
					Cookie.deleteCookie('userID');
					Store.commit('logout');
				}
				this.errorCode = response.status;
			});
		},

		//Set CSS class of the info
		setInfoClass () {
			switch(this.infoData.category) {
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
		joinEvent (event, click) {
			//Avoid the method to be called if no click and not an event 
			if(!click || event.category != 'Event') return;
			
			//Request options (COORS, token)
			var options = {
				headers: {
					'x-access-token': Cookie.getCookie('token')
				},
				credentials: true
			};

			//Get the info ID from the URL
			let idInfo = (document.URL.split('/'))[4];

			//API request Joining event (POST)
			this.$http.post(Config.urlAPI +'/api/infos/'+this.infoData._id+'/join',{}, options).then((response) => {

				//If success
				if(response.status == 200)
					this.successMsg = response.data.message;
				
				//If error (data error)
				else {
					this.errorMsg = response.data.message;
					this.errorCode = response.status;
				}
				//this.fetchInfoData();

			}, (response) => {
				
				//If error (request error)
				this.errorMsg = response.data.message;
				this.errorCode = response.status;
				console.log('Error: ' +response);
			});
		},
		leaveEvent (event, click) {

			//Avoid the method to be called if no click and not an event 
			if(!click || event.category != 'Event') return;
			
			//Prevent Owner of the info to leave his event
			if(this.isMyArticle) {
				$('#leaveBtn').text('You can\'t leave your own event !');
				return;
			}

			//Request options (COORS, Token)
			var options = {
				headers: {
					'x-access-token': Cookie.getCookie('token')
				},
				credentials: true
			};

			//Get the info ID from the URL
			let idInfo = (document.URL.split('/'))[4];

			//API Leave event request (POST)
			this.$http.post(Config.urlAPI +'/api/infos/'+idInfo+'/leave',{}, options).then((response) => {
				
				//If success
				if(response.status == 200)
					this.successMsg = response.data.message;
				
				//If error (data error)
				else {
					this.errorMsg = response.data.message;
					this.errorCode = response.status;
				}
				
				//this.fetchInfoData();
			
			}, (response) => {

				//If error (request error)
				this.errorMsg = response.data.message;
				this.errorCode = response.status;
				console.log('Error: ' +response);
			});
		},

		//Toggle functions
		toggleEdit () {
			this.isArticleEditing = !this.isArticleEditing;
		},
		toggleShowMembers () {
			this.showMembers = !this.showMembers;
		},

		deleteArticle () {
			//Confirm the action (avoid miss click)
			var choice = confirm('/!\\ WARNING: this action is definitive, Are you sure? /!\\ ');
			
			if(choice) {
				
				//Request options (COORS, Token)
				var options = {
					headers: {
						'x-access-token': Cookie.getCookie('token')
					},
					credentials: true
				};

				//Set Vue reference for the redirection
				var vue = this;

				//API delete info Request (DELETE)
				this.$http.delete(Config.urlAPI +'/api/infos/delete/'+this.infoData._id, options).then(( response) => {
					
					//If success

					//If error (data error)
					if(response.status != 200) {
						this.errorMsg = response.data.message;
						this.errorCode = response.status;
					}
					else {
						//redirect to the home page in 3secs
						this.successMsg = response.data.message;
						window.setTimeout(function(){
							    vue.$router.push('/');
							    }, 3000);
					}
				}, (response) => {

					//If error (request error)
					this.errorMsg = response.data.message;
					this.errorCode = response.status;
				});
			}
		},
		updateExpiryDate (val) {
			this.editedArticle.expirydate = moment(val).utc().format();
		},
		updateArticle () {

			//If user disconnected: return
			if(!this.checkEditedInfo() ) return;

			//Request options (COORS, token)
			var options = {
				headers: {
					'x-access-token': Cookie.getCookie('token')
				},
				credentials: true
			};

			//Payload to send
			var payload = {
				title:  		(this.editedArticle.title 			|| this.infoData.title),
				description: 	(this.editedArticle.description 	|| this.infoData.description),
				location: 		(this.editedArticle.location 		|| this.infoData.location),
				addInfo: 		(this.editedArticle.addInfo			|| this.infoData.addInfo),
				acceptOverload:  this.editedArticle.acceptOverload,
				userLimit: 		(this.editedArticle.userLimit 		|| this.infoData.userLimit),
				birthdate: 		this.infoData.birthdate,
				expirydate: 	(this.editedArticle.expirydate 		|| this.infoData.expirydate)
			};
			payload.acceptOverload ? payload.userLimit = '' : '';
			
			//API request to update information (POST)
			this.$http.post(Config.urlAPI +'/api/infos/update/'+this.infoData._id, payload, options).then((response) => {

				//If success

				//If data error
				if(response.status != 200) {
					this.errorMsg = response.data.message;
					this.errorCode = response.status;
					this.successMsg = '';
				}
				else {
					this.successMsg = response.data.message;
					this.errorMsg = '';
				}
			}, (response) => {

				//If Request error
				console.log('Error:', response);
				this.successMsg = '';
				this.errorMsg = response.data.message;
				if(response.status == 403)
					this.errorMsg = 'Unknown token, please try to login again';
				this.errorCode = response.status;
			});
		},
		voteUp () {

			//If user disconnected, return
			if(!this.isConnected) return;
			
			//Request options (COORS, Token)
			var options = {
				headers: {
					'x-access-token': Cookie.getCookie('token')
				},
				credentials: true
			};

			//API Request to upvote (POST)
			this.$http.post(Config.urlAPI +'/api/infos/'+this.infoData._id+'/upvote', {}, options).then((response) => {
			}, (response) => {

				//If Error
				console.log('Error:', response);
			});

			//Update vote locally, waiting socket update
			var info = this.infoData;
			var hadVoted = false;
			this.infoData.votes.every(function(element, index, array) {
				if(element.userID == Cookie.getCookie('userID')) {
					hadVoted = true;
					//The user already voted +1 so we negate to 0
					if(element.value == 1) {
						info.voteCount--;
						element.value = 0;	
					}
					//The user already voted -1 so we put +1 
					else if(element.value == -1) {
						info.voteCount +=2;
						element.value = 1;	
					}
					//The user already voted 0 so we put +1
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
				this.infoData.voteCount ++;
				this.infoData.votes.push({userID: Cookie.getCookie('userID'), value: 1});	
			}
		},
		voteDown () {

			//If the user is disconnected, return
			if(!this.isConnected) return;
			
			//Request options (COORS, token)
			var options = {
				headers: {
					'x-access-token': Cookie.getCookie('token')
				},
				credentials: true
			};

			//API Request to downvote (POST)
			this.$http.post(Config.urlAPI +'/api/infos/'+this.infoData._id+'/downvote', {}, options).then((response) => {
			}, (response) => {

				//If error
				console.log('Error:', response);
			});

			//Update locally the vote waiting the socket update
			var info = this.infoData;
			var hadVoted = false;
			this.infoData.votes.every(function(element, index, array) {
				if(element.userID == Cookie.getCookie('userID')) {
					hadVoted = true;
					//The user already voted 1 so we put -1
					if(element.value == 1) {
						info.voteCount-=2;
						element.value = -1;	
					} 
					//The user already voted -1 so we negate to 0
					else if(element.value == -1) {
						info.voteCount ++;
						element.value = 0;	
					}
					//The user already vored 0, so we put -1
					else {
						info.voteCount--;
						element.value = -1
					}
					return false;
				}
				return true;
			});
			//The user never voted, so -1
			if(!hadVoted) {
				this.infoData.voteCount --;
				this.infoData.votes.push({userID: Cookie.getCookie('userID'), value: -1});
			}
		},

		//Set CSS class for vote buttons
		setVoteClassBtnGreen () {
			return {
				'disabled': !this.isConnected,
				'green': this.getVoteStatus() == 1
			};
		},
		setVoteClassBtnRed () {
			return {
				'disabled': !this.isConnected,
				'red': this.getVoteStatus() == -1
			};
		},

		//Get the vote status of the user for the current info
		getVoteStatus() {
			var status;
			this.infoData.votes.every(function(element, index, array) {
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

		//Set the route to the user profile
		setUserRoute (userID) {
			return '/user/' + userID;
		},

		//Check the edited info (especially the overload)
		checkEditedInfo () {

			//If we don't accept Overload, check the userLimit (we can't set limit under the current members size)
			if(this.editedArticle.acceptOverload == false) {
				if(this.editedArticle.userLimit < this.setMinUserLimit) {
					this.errorMsg = 'You can\'t set this limit.'
					return false;
				}
			}
			//If we accept Overload, set the limit to 0
			else {
				this.editedArticle.userLimit = 0;
			}

			//Check the expiry date (null, undefined, '', before birthdate, after birthdate +1d)
			if(this.editedArticle.expirydate == null || this.editedArticle.expirydate == undefined || this.editedArticle.expirydate == '' || moment(this.editedArticle.expirydate).isBefore(moment(this.infoData.birthdate)) || moment(this.editedArticle.expirydate, "MM/DD/YYYY HH:mm").isAfter(moment(this.infoData.birthdate).add(1,'d') ) ) {
				this.errorMsg = 'Expiry date is incorrect.';
				return false;
			}
			return true;
		}
	},
	computed: {
		isConnected () {
			return Cookie.getCookie('Connected') == 'true';
		},
		updateVoteCount () {
			return this.infoData.voteCount;
		},
		isEventJoined () {
			var userID = Cookie.getCookie('userID');
			for (var i = this.infoData.userList.length - 1; i >= 0; i--) {
				if(this.infoData.userList[i].ID == userID)
					return true;
			}
			return false;
		},

		isEventFull () {
			return {
				'disabled': (this.infoData.userList.length >= this.infoData.userLimit && !this.infoData.acceptOverload)
			}
		},

		isMyArticle () {
			return this.infoData.userID == Cookie.getCookie('userID');
		},
		disableLeave() {
			return {
				'disabled': this.infoData.userID == Cookie.getCookie('userID')
			}
		},
		setMinUserLimit() {
			if(this.infoData.userList.length > this.infoData.userLimit)
				return this.infoData.userList.length > 2 ? this.infoData.userList.length : 2;
			return 2;

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
	.info {
		background.color: #31B0D5;
	}
	.green>span {
		color: green!important;
	}
	.red>span {
		color: red!important;
	}
</style>