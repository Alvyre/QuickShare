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
											      <button type="button" class="btn btn-block" :class="setClass(info)"><strong v-html="info.category"></strong><br><span v-html="info.title"></span><br><em>read more..</em></button>
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

// Imports 
//==================================

	import Cookie from '../cookie-handler';
	import Config from '../config';

// Vue 
//==================================

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
			//Get the user infos and set the loading animation
			this.$store.commit('loadingOn');
			this.getUserInfos();
		},
		methods: {
			getUserInfos () {

				//Request options (COORS)
				var options = {
					credentials: true
				};
				
				//API Request to get user data
				this.$http.get(Config.urlAPI +'/api/user/myprofile', options).then((response) => {
		    		
					//If success
		    		this.userData = response.data;
		    		this.checkboxMail = this.userData.isEmailVisible;

		    		//If data error
		    		if(response.status != 200) {
		    			this.errorMsg = response.message;
		    			this.errorCode = response.status;
		    		}
		    		
		    		//API Request to get the active infos of the user
		    		this.$http.get(Config.urlAPI +'/api/infos/user/'+this.userData._id, options).then((response) => {
		    			
		    			//If success
		    			this.userInfos = response.data;
		    			this.$store.commit('loadingOff');
		    			
		    			//If data error
		    			if(response.status != 200) {
		    				this.errorMsg = response.message;
		    				this.errorCode = response.status;
		    			}
		    		}, (response) => {

		    			//If request error
		    			console.log('Error:', response);
		    			this.errorMsg = response.message;
		    			this.$store.commit('loadingOff');

		    			//Token invalid
		    			if(response.status == 403) {
		    				this.errorMsg = 'Unknown/Expired token, please try to login again';
							Cookie.deleteCookie('x-access-token');
          					Cookie.deleteCookie('Connected');
          					Cookie.deleteCookie('userID');
          					this.$store.commit('logout');
		    			}
		    			this.errorCode = response.status;
		    		});
		    		// END ACTIVE INFO REQUEST

		  		}, (response) => {

		  			//If request error
		    		console.log('Error:', response);
		    		this.errorMsg = response.message;
		    		this.$store.commit('loadingOff');

		    		//Token invalid
		    			if(response.status == 403) {
		    				this.errorMsg = 'Unknown/Expired token, please try to login again';
							Cookie.deleteCookie('x-access-token');
          					Cookie.deleteCookie('Connected');
          					Cookie.deleteCookie('userID');
          					this.$store.commit('logout');
		    			}
		    		this.errorCode = response.status;
		  		});
			},
			updateInfo () {

				//Set the payload to send
				var payload = {
						password: 		this.inputPas,
						mail: 	  		this.inputMail,
						isEmailVisible: this.checkboxMail,
						isNewPwd:       this.inputPas.length != 0,
						isNewEmail:		this.inputMail.length != 0,
						isNewVisible:   this.checkboxMail != this.userData.isEmailVisible
				};

				//Request options (COORS)
				var options = {
					credentials: true
				};
				
				//API Request to update the user profile
			  	this.$http.post(Config.urlAPI +'/api/user/update', payload, options).then((response) => {

			    	//If success
				    if(response.status === 200) {
				    	this.successMsg = response.data.message;
				    	this.errorMsgForm = '';
				    	this.errorCodeForm = '';
				    }
				    //If data error
				    else {
				    	this.errorMsgForm = response.data.message;
				    	this.successMsg = '';
				    }
			  	}, (response) => {
				    
				    //If request error
				    this.successMsg = '';
				    this.errorCodeForm = response.status;
				    this.errorMsgForm = response.data.message;
		  		});
			},

			//Get the route of an info with the ID
			getRoute(infoID) {
				return '/info/'+infoID;
			},

			//Set CSS class to the info
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

			//Delete user account
			deleteAccount () {
				var choice = confirm('/!\\ WARNING: this action is definitive, Are you sure? /!\\ ');
				if(choice) {

					//Request options (CORS)
					var options = {
					credentials: true
					};

					//Set Vue reference for the redirection
					var vue = this;

					//API Request to delete user account
					this.$http.delete(Config.urlAPI +'/api/user/delete', options).then(( response) => {
						
						//If success

						//If data error
						if(response.status != 200) {
		    				this.errorMsg = response.data.message;
		    				this.errorCode = response.status;
		    			}
		    			else {
		    				this.successMsg = response.data.message;
		    				//logout
		    				this.$store.commit('logout');
          					Cookie.deleteCookie('Connected');

          					//redirect to homepage
					    	window.setTimeout(function(){
							    vue.$router.push('/');
							    }, 3000); // 3 secs
		    			}
					}, (response) => {

						//If request error
						this.errorMsg = response.data.message;
						this.errorCode = response.status;
					});
				}
			}
		},
		computed: {
			isConnected () {
		        return this.$store.state.isConnected;
		    },
		    loading () {
		        return this.$store.state.loading;
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