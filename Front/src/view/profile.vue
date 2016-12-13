<template>
	<div id="profile">
			<div id="user" v-if="!loading">
				<div class="alert alert-danger" v-if="errorCode">
					<strong>Error {{errorCode}}:</strong> {{errorMsg}}
				</div>
				<div class="userInfos" v-if="!errorCode">
					<div class="row row-centered">
						<div class="col-xs-12 col-sm-12">
							<div class="jumbotron">
								<div class="container">
									<h1>Hello {{userData.username}},</h1>
									<p>Welcome on your profile page.</p>
								</div>
							</div>
								<div id="update-info">
								<!-- UPDATE INFO -->
									<h4 class=""><strong>Update my infos:</strong></h4>
									<div class="alert alert-success text-center" v-show="successMsg">
										<strong>{{successMsg}}</strong>
									</div>
									<form action="" method="POST" role="form" v-on:submit.prevent.stop="updateInfo()">
										<div class="alert alert-danger" v-show="errorMsgForm">
											<strong>Error {{errorCodeForm}}:</strong> {{errorMsgForm}}
										</div>
										<div class="form-group" :class="classEmail">
											<label for="mail" class="">E-mail:</label>
											<input type="email" class="form-control" id="mail" name="mail" v-bind:placeholder="userData.mail" v-model="inputMail">
											<div id="infoEmail" class="help-block" v-show="checkEmail">Please type a correct email address.</div>
										</div>
										<div class="form-group" :class="classPwd">
											<label for="pwd" class="">Password:</label>
											<input type="password" name="pwd" class="form-control" id="pwd" v-model="inputPas">
											<div id="infoPas" class="help-block" v-show="checkPwd">Please type a password with at least 6 characters.</div>
										</div>
										<div class="form-group">
											<div class="checkbox checkbox-inline">
												<label>
													<input type="checkbox" value="false" v-model="checkboxMail">
													My email is visible to other members
												</label>
											</div>
										</div>
									
										<button type="submit" class="btn btn-primary">Update</button>
									</form>
								</div>
								<div class="clearfix"><hr></div>
								<div id="my-posts">
								<!-- My Posts -->
									<div class="myInfos">
										<h4 v-if="userInfos.length != 0" ><strong>My active information:</strong></h4>
										<div class="row">
										  <div class="col-xs-6 col-md-3 info panel-success" v-for="info in userInfos">
										  <router-link v-bind:to="getRoute(info._id)">
											      <button type="button" class="btn btn-block" :class="setClass(info)"><strong>{{info.category}}</strong><br>{{info.title}}<br><em>read more..</em></button>
										  </router-link>
										  </div>
										</div>
									</div>
								</div>
								<div class="clearfix"><hr v-if="userInfos.length != 0"></div>
								<!-- DELETE ACCOUNT -->
								<div id="account">
									<h4><strong>Account Settings:</strong></h4>
									<form action="" method="POST" role="form" v-on:submit.prevent.stop="deleteAccount()">
										<button type="submit" class="btn btn-danger">DELETE MY ACCOUNT</button>
									</form>
								</div>
						</div>
					</div>
				</div>
			</div>			
	</div>
</template>

<script>
	import Cookie from '../cookie-handler';
	import Store  from '../store';
	import Config from '../config';

	export default {
		name: 'profile',
		data () {
			return {
				userData: [],
				userInfos: [],
				errorMsg: '',
				errorCode: '',
				errorMsgForm: '',
				errorCodeForm: '',
				successMsg: '',
				inputPas: '',
				inputMail: '',
				checkboxMail: ''
			}
		},
		mounted () {
			Store.commit('loadingOn');
			this.getUserInfos();
		},
		methods: {
			getUserInfos () {

				var options = {
					headers: {
						'x-access-token': Cookie.getCookie('token')
					},
					credentials: true
				};
					// get user infos
				this.$http.get(Config.urlAPI +'/api/user/myprofile', options).then((response) => {
		    		this.userData = response.data;
		    		this.checkboxMail = this.userData.isEmailVisible;

		    		if(response.status != 200) {
		    			this.errorMsg = response.message;
		    			this.errorCode = response.status;
		    		}
		    		// get the posts
		    		this.$http.get(Config.urlAPI +'/api/infos/user/'+this.userData._id, options).then((response) => {
		    			this.userInfos = response.data;
		    			Store.commit('loadingOff');
		    			if(response.status != 200) {
		    				this.errorMsg = response.message;
		    				this.errorCode = response.status;
		    			}
		    		}, (response) => {
		    			console.log('Error:', response);
		    			this.errorMsg = response.message;
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

		  		}, (response) => {
		    		console.log('Error:', response);
		    		this.errorMsg = response.message;
		    		Store.commit('loadingOff');
		    		if(response.status == 403)
		    			this.errorMsg = 'Unknown token, please try to login again'
		    		this.errorCode = response.status;
		  		});
			},
			updateInfo () {

				var body = {
						password: 		this.inputPas,
						mail: 	  		this.inputMail,
						isEmailVisible: this.checkboxMail,
						isNewPwd:       this.inputPas.length != 0,
						isNewEmail:		this.inputMail.length != 0,
						isNewVisible:   this.checkboxMail != this.userData.isEmailVisible
				};
				var options = {
					headers: {
						'x-access-token': Cookie.getCookie('token')
					},
					credentials: true
				};
				// POST /someUrl
			  	this.$http.post(Config.urlAPI +'/api/user/update', body, options).then((response) => {

			    	// get status
				    if(response.status === 200) {
				    	this.successMsg = response.data.message;
				    	this.errorMsgForm = '';
				    	this.errorCodeForm = '';
				    }
				    else {
				    	this.errorMsgForm = response.data.message;
				    	this.successMsg = '';
				    }
			  	}, (response) => {
				    // error callback
				    this.successMsg = '';
				    this.errorCodeForm = response.status;
				    this.errorMsgForm = response.data.message;
		  		});
			},
			getRoute(infoID) {
				return '/info/'+infoID;
			},
			setClass (info) {
				switch(info.category) {
					case 'Info':
						return 'btn-info';
					break;
					case 'Event':
						return 'btn-success';
					break;
					case 'Help':
						return 'btn-warning';
					break;
					default:
					return '';
					break;
				}
			},
			deleteAccount () {
				var choice = confirm('/!\\ WARNING: this action is definitive, Are you sure? /!\\ ');
				if(choice) {

					var options = {
					headers: {
						'x-access-token': Cookie.getCookie('token')
					},
					credentials: true
					};
					var vue = this;

					this.$http.delete(Config.urlAPI +'/api/user/delete', options).then(( response) => {
						if(response.status != 200) {
		    				this.errorMsg = response.data.message;
		    				this.errorCode = response.status;
		    			}
		    			else {
		    				this.successMsg = response.data.message;
		    				Store.commit('logout');
		    				Cookie.deleteCookie('token');
          					Cookie.deleteCookie('Connected');

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
			}
		},
		computed: {
			loading () {
				return Store.state.loading;
			},
			checkPwd () {
				return ( this.inputPas.length > 0 &&
						 this.inputPas.length < 6);
			},
			checkEmail () {
				var regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  				if(this.inputMail.length > 0) {
  					return !regexp.test(this.inputMail);
  				}
  				else {
  					return false;
  				}
			},
			classPwd () {
				return {
					'has-success': 	this.inputPas.length >= 6,
					'has-error': 	this.checkPwd
				};
			},
			classEmail () {
				return {
					'has-success': 	!this.checkEmail && this.inputMail.length > 0,
					'has-error': 	(this.checkEmail && this.inputMail.length > 0)
				};
			}
		}
	}
</script>

<style>
 #my-posts, #update-info, .info {
 	margin-bottom: 10px; 
 }
</style>