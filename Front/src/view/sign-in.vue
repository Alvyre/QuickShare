<template>
	<div id="signIn">
			<div class="row row-centered" v-if="!loading">
				<div class="col-xs-12 col-sm-12 col-centered">
					<div class="alert alert-success text-center" v-show="successMsg">
						<strong>{{successMsg}}</strong>
						<p class="text-center"><em><small>You will be redirected in 3 secs...<br> Click <router-link to="/">here</router-link> to go to the home page.</small></em></p>
					</div>
					<form action="" method="POST" role="form" v-on:submit.prevent.stop="signIn()" v-show="!successMsg">
						<legend>Sign-in</legend>
					
						<div class="alert alert-danger" v-show="errorMsg">
							<strong>Error {{errorCode}}:</strong> {{errorMsg}}
						</div>

						<div class="form-group" :class="className">
							<label for="name">Name</label>
							<input type="text" class="form-control" id="inputName" required='required' aria-describedby="infoName" v-model="inputName">
							<div id="infoName" class="help-block" v-show="checkName">Please type a name in a range from 3 to 20 characters.</div>
						</div>
						<div class="form-group" :class="classPwd">
							<label for="password">Password</label>
							<input type="password" name="password" id="inputPas" class="form-control" required="required" aria-describedby="infoPas" v-model="inputPas">
							<div id="infoPas" class="help-block" v-show="checkPwd">Please type a password with at least 6 characters.</div>
						</div>
						
						<div class="form-group">
							<div class="g-recaptcha" data-sitekey="6LeKFAwUAAAAAL1miQAbHCzWG9eM1dS6JpjRovmN"></div>
						</div>
						
						<button type="submit" class="btn btn-primary center-block">Sign-in</button><br>
					</form>
				</div>
			</div>
	</div>
</template>

<script>

// Imports 
//==================================

	import Store from '../store';
	import Cookie from '../cookie-handler';
	import Config from '../config';

// Vue 
//==================================

	export default {
		name: 'signIn',
		data () {
			return {
				errorMsg: '',
				errorCode: '',
				successMsg: '',
				inputName: '',
				inputPas: '',
				grecaptcha: {}
			}
		},
		mounted () {

			//Render explicitly the g-recaptcha to avoid bug when auto refresh or navigation
			this.grecaptcha = grecaptcha.render($('.g-recaptcha')[0], {sitekey: '6LeKFAwUAAAAAL1miQAbHCzWG9eM1dS6JpjRovmN', theme: 'dark'});
		},
		methods: {
			signIn () {

				//Get the response of the g-recaptcha
				var gResponse = grecaptcha.getResponse(this.grecaptcha);
				if(gResponse.length == 0) {
					this.errorMsg = 'G-recaptcha is not verified !';
				}
				else {
					
				//Request options (CORS)
				var options = {
					headers: {
					},
					credentials: true
				};

					//Set the payload to set
					var payload = {
					username: 		this.inputName,
					password: 		this.inputPas,
					gRecaptchaResponse: gResponse
					};

					// self reference for the routing redirection
					var vue = this;

				  	//API request to login (POST)
				  	this.$http.post(Config.urlAPI +'/api/user/login', payload, options).then((response) => {

					    //If success
					    if(response.status === 200) {
					    	this.successMsg = response.data.message;
					    	
					    	//Set cookies and logged state
					    	Cookie.setCookie('Connected', 'true');
					    	Cookie.setCookie('userID', response.data.idUser);
					    	Store.commit('login');

					    	//Redirection to homepage in 3secs
					    	window.setTimeout(function(){
							    vue.$router.push('/');
							    }, 3000);
					    }

					    //If data error
					    else {
					    	this.errorMsg = response.data.message;
					    }
				  	}, (response) => {
				    
				    //If request error
				    this.errorCode = response.status;
				    this.errorMsg = response.data.message;

				    //reset the recaptcha for new entry
				   	grecaptcha.reset(this.grecaptcha);
			  		});
				}
			}
		},
		computed: {
			isConnected () {
		        return Store.state.isConnected;
		    },
		    loading () {
		        return Store.state.loading;
		    },
		    
			//Check the name (between 3 & 20 characters, no color detection for 0 char)
			checkName () {
				return ( this.inputName.length > 0 &&
					 	 this.inputName.length < 3 ||
					 	 this.inputName.length > 20);
			},

			//Check the password (more than 6 characters, no color detection for 0 char)
			checkPwd () {
				return ( this.inputPas.length > 0 &&
						 this.inputPas.length < 6);
			},

			//Set CSS classes for inputs
			className () {
				return {
					'has-success': 	this.inputName.length >= 3 && this.inputName.length <= 20,
					'has-error': 	this.checkName
				};
			},
			classPwd () {
				return {
					'has-success': 	this.inputPas.length >= 6,
					'has-error': 	this.checkPwd
				};
			}
		}
	}
</script>

<style>
	.g-recaptcha{
		width: 304px;>
		height: 78px;
		margin: 0 auto;
	}
</style>