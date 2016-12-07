<template>
	<div id="info">
		<div class="row" v-if="infoData.length != 0">
			<div class="col-xs-12 col-sm-12">
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
							<span class="glyphicon glyphicon-user" aria-hidden="true"></span> : {{infoData.userList.length}}<span v-if="infoData.userLimit">/{{infoData.userLimit}}</span>
						</p> 
						<p><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span> {{infoData.birthdate | localeDate }}</p>
						<p><span class="glyphicon glyphicon-time" aria-hidden="true"></span> {{infoData.expirydate | localeDate }}</p>
						<p><span class="glyphicon glyphicon-hourglass" aria-hidden="true"></span> {{infoData.expirydate | TimeRemainingWith(infoData.birthdate) }}</p>
						<button type="button" class="btn btn-large btn-block btn-success" v-if="infoData.category == 'Event' && isEventJoined == -1" :class="isEventFull" v-on:click.prevent.stop="joinEvent(infoData, $event)">Join Event</button>
						<button type="button" class="btn btn-large btn-block btn-danger" v-if="infoData.category == 'Event' && isEventJoined != -1" v-on:click.prevent.stop="leaveEvent(infoData, $event)" :class="disableJoinl" id="leaveBtn">Leave Event</button>
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
				</div>
			</div>
		</div>
		<div class="row" v-if="infoData.length != 0 && isMyArticle">
			<!-- EDIT ARTICLE -->
			<div class="col-xs-4 col-xs-offset-1 col-sm-4 col-sm-offset-1">
				<button type="button" class="btn btn-large btn-block btn-primary" v-on:click.prevent.stop="toggleEdit()" >Edit <span class="glyphicon glyphicon-menu-down" aria-hidden="true" v-show='!isArticleEditing'></span><span class="glyphicon glyphicon-menu-up" aria-hidden="true" v-show='isArticleEditing'></span></button>
			</div>
			<div class="col-xs-4 col-xs-offset-2 col-sm-4 col-sm-offset-2">
				<button type="button" class="btn btn-large btn-block btn-danger" v-on:click="deleteArticle()"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Delete</button>
			</div>
			<div class="clearfix"><br><br></div>			
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
						<label for="userLimit">User limit</label>
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
					<div class="alert alert-danger text-center col-xs-6 col-xs-offset-3 col-sm-6 col-sm-offset-3" v-if="errorCode">
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
//==========================

import Store from '../store';
import Cookie from '../cookie-handler';
import Config from '../config';
import Flatpickr from 'vue-flatpickr/vue-flatpickr-material_blue.vue'
var moment = require('moment');
moment().format();

// Vue 
//=========================

export default {
	name: 'info',
	data () {
		return {
			infoData: [],
			errorMsg: '',
			errorCode: '',
			successMsg: '',
			isArticleEditing: false,
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
		Store.commit('loadingOn');
		this.fetchInfoData();	
	},
	methods : {
		fetchInfoData () {
			if(!this.isConnected) {
				this.$router.push('/');
				return;
			}
			var options = {
				headers: {
					'x-access-token': Cookie.getCookie('token')
				},
				credentials: true
			};
			let idInfo = (document.URL.split('/'))[4];
			this.$http.get(Config.urlAPI +'/api/infos/id/'+idInfo, options).then((response) => {

				Store.commit('loadingOff');
				if(response.status != 200) {
					this.errorMsg = response.data.message;
					this.errorCode = response.status;
				}
				else {
					this.infoData = response.data;
					// bind dates to the options var (flatpickr)
					this.options.minDate = moment(this.infoData.birthdate).format();
					this.options.defaultDate = moment(this.infoData.expirydate).format();
					this.options.maxDate = moment(this.infoData.birthdate).add(1, 'd').format();
				}

			}, (response) => {
				console.log('Error:', response);
				this.errorMsg = response.data.message;
				Store.commit('loadingOff');
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
			if(!click) return;
			if(event.category != 'Event') return;
			var options = {
				headers: {
					'x-access-token': Cookie.getCookie('token')
				},
				credentials: true
			};

			let idInfo = (document.URL.split('/'))[4];

			this.$http.post(Config.urlAPI +'/api/infos/'+this.infoData._id+'/join',{}, options).then((response) => {
				if(response.status == 200)
					this.successMsg = response.data.message;
				else {
					this.errorMsg = response.data.message;
					this.errorCode = response.status;
				}
				this.fetchInfoData();
			}, (response) => {
				this.errorMsg = response.data.message;
				this.errorCode = response.status;
				console.log('Error: ' +response);
			});
		},
		leaveEvent (event, click) {
			if(!click || event.category != 'Event') return;
			if(this.isMyArticle) {
				$('#leaveBtn').text('You can\'t leave your own event !');
				return;
			}
			var options = {
				headers: {
					'x-access-token': Cookie.getCookie('token')
				},
				credentials: true
			};

			let idInfo = (document.URL.split('/'))[4];

			this.$http.post(Config.urlAPI +'/api/infos/'+idInfo+'/leave',{}, options).then((response) => {
				if(response.status == 200)
					this.successMsg = response.data.message;
				else {
					this.errorMsg = response.data.message;
					this.errorCode = response.status;
				}
				this.fetchInfoData();
			}, (response) => {
				this.errorMsg = response.data.message;
				this.errorCode = response.status;
				console.log('Error: ' +response);
			});
		},
		toggleEdit () {
			this.isArticleEditing = !this.isArticleEditing;
		},
		deleteArticle () {
			var choice = confirm('/!\\ WARNING: this action is definitive, Are you sure? /!\\ ');
			if(choice) {
				var options = {
					headers: {
						'x-access-token': Cookie.getCookie('token')
					},
					credentials: true
				};
				var vue = this;

				this.$http.delete(Config.urlAPI +'/api/infos/delete/'+this.infoData._id, options).then(( response) => {
					if(response.status != 200) {
						this.errorMsg = response.data.message;
						this.errorCode = response.status;
					}
					else {
						this.successMsg = response.data.message;
						window.setTimeout(function(){
							    // Move to login page
							    vue.$router.push('/');
							    }, 3000); // 3 secs
					}
				}, (response) => {
					this.errorMsg = response.data.message;
					this.errorCode = response.status;
				});
			}
		},
		updateExpiryDate (val) {
			this.editedArticle.expirydate = moment(val).utc().format();
		},
		updateArticle () {
			var options = {
				headers: {
					'x-access-token': Cookie.getCookie('token')
				},
				credentials: true
			};
			var payload = {
				title:  		(this.editedArticle.title 			|| this.infoData.title),
				description: 	(this.editedArticle.description 	|| this.infoData.description),
				location: 		(this.editedArticle.location 		|| this.infoData.location),
				addInfo: 		(this.editedArticle.addInfo			|| this.infoData.addInfo),
				acceptOverload: (this.editedArticle.acceptOverload 	|| this.infoData.acceptOverload),
				userLimit: 		(this.editedArticle.userLimit 		|| this.infoData.userLimit),
				birthdate: 		this.infoData.birthdate,
				expirydate: 	(this.editedArticle.expirydate 		|| this.infoData.expirydate)
			};
			payload.acceptOverload ? payload.userLimit = '' : '';
			this.$http.post(Config.urlAPI +'/api/infos/update/'+this.infoData._id, payload, options).then((response) => {
	
				if(response.status != 200) {
					this.errorMsg = response.data.message;
					this.errorCode = response.status;
				}
				else {
					this.successMsg = response.data.message;
					this.fetchInfoData();
				}
			}, (response) => {
				console.log('Error:', response);
				this.errorMsg = response.data.message;
				if(response.status == 403)
					this.errorMsg = 'Unknown token, please try to login again';
				this.errorCode = response.status;
			});
		},
		voteUp () {
			if(!this.isConnected) return;
			var options = {
				headers: {
					'x-access-token': Cookie.getCookie('token')
				},
				credentials: true
			};
			this.$http.post(Config.urlAPI +'/api/infos/'+this.infoData._id+'/upvote', {}, options).then((response) => {
			}, (response) => {
				console.log('Error:', response);
			});
			var info = this.infoData;
			var hadVoted = false;
			this.infoData.votes.every(function(element, index, array) {
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
				this.infoData.voteCount ++;
				this.infoData.votes.push({userID: Cookie.getCookie('userID'), value: 1});	
			}
		},
		voteDown () {
			if(!this.isConnected) return;
			var options = {
				headers: {
					'x-access-token': Cookie.getCookie('token')
				},
				credentials: true
			};
			this.$http.post(Config.urlAPI +'/api/infos/'+this.infoData._id+'/downvote', {}, options).then((response) => {
			}, (response) => {
				console.log('Error:', response);
			});
			var info = this.infoData;
			var hadVoted = false;
			this.infoData.votes.every(function(element, index, array) {
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
						element.value = -1
					}
					return false;
				}
				return true;
			});
			if(!hadVoted) {
				this.infoData.voteCount --;
				this.infoData.votes.push({userID: Cookie.getCookie('userID'), value: -1});
			}
		},
		setVoteClassBtnGreen () {
				console.log(this.getVoteStatus());
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
			return this.infoData.userList.indexOf(Cookie.getCookie('userID'));
		},

		isEventFull () {
			return {
				'disabled': (this.infoData.userList.length >= this.infoData.userLimit && !this.infoData.acceptOverload)
			}
		},

		isMyArticle () {
			return this.infoData.userID == Cookie.getCookie('userID');
		},
		disableJoin() {
			return {
				'disabled': this.infoData.userID == Cookie.getCookie('userID')
			}
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