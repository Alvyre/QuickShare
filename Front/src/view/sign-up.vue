<template>
	<div id="signup">
		<div class="container">
			<div class="row row-centered">
				<div class="col-xs-12 col-sm-12 col-centered">
					<div class="alert alert-success text-center" v-show="successMsg">
						<strong>{{successMsg}}</strong><br>
						<p class="text-center"><em><small>You will be redirected in 3 secs...<br> Click <router-link to="/sign-in" v-on:click.native="clearTimeout()">here</router-link> to go to the login page.</small></em></p>
					</div>
					<form action="" method="POST" role="form" v-on:submit.prevent.stop="signUp()" v-show="!successMsg">
						<legend>Sign Up</legend>
						
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
						<div class="form-group" :class="classEmail">
							<label for="mail">Email</label>
							<input type="email" name="mail" id="inputMail" class="form-control" value="" required="required" title="" v-model="inputMail">
							<div id="infoEmail" class="help-block" v-show="checkEmail">Please type a correct email address.</div>
						</div>
						<div class="form-group">
							<div class="checkbox checkbox-inline">
								<label>
									<input type="checkbox" value="false" v-model="checkboxMail">
									My email is visible to other members
								</label>
							</div>
						</div>
						<div class="form-group">
							<div class="g-recaptcha" data-sitekey="6LeKFAwUAAAAAL1miQAbHCzWG9eM1dS6JpjRovmN"></div>
						</div>
						
						<button type="submit" class="btn btn-primary center-block" >Sign-up</button>
						<br>				

					</form>
				</div>
			</div>
		</div>
	</div>

</template>

<script>

// Imports 
//==================================

	import Config from '../config';

// Vue 
//==================================

	export default {
		name: 'signup',
		data () {
			return {
				errorMsg: '',
				errorCode: '',
				successMsg: '',
				inputName: '',
				inputPas: '',
				inputMail: '',
				checkboxMail: false,
				grecaptcha: {},
				timeoutID: ''
			}
		},
		mounted () {
			//Render g-recaptcha  explicitly
			this.grecaptcha = grecaptcha.render($('.g-recaptcha')[0], {sitekey: Config.recaptchaPublicKey, theme: 'dark'});
		},
		methods: {
			signUp () {

				var gResponse = grecaptcha.getResponse(this.grecaptcha);
				if(gResponse.length == 0) {
					this.errorMsg = 'G-recaptcha is not verified !';
				}
				else {
					
					//Set the payload
					var payload = {
					username: 		this.inputName,
					password: 		this.inputPas,
					mail: 	  		this.inputMail,
					isEmailVisile: 	this.checkboxMail,
					gRecaptchaResponse: gResponse
					};

					//Vue reference for the routing redirection
					var vue = this;
					
					//Request options (CORS)
					var options = {
						headers: {
						},
						credentials: true
					};

				  	//API request  to register (POST)
				  	this.$http.post(Config.urlAPI +'/api/user/register', payload, options).then((response) => {

				    //If success
				    if(response.status === 200) {
				    	this.successMsg = response.data.message;

				    	//redirect to homepage
				    	this.timeoutID = window.setTimeout(function(){
						    vue.$router.push('/sign-in');
						    }, 3000); // 3 secs
				    	this.$store.commit('setTimer', this.timeoutID);
				    }
				    //If data error
				    else {
				    	this.errorMsg = response.data.message;
				    }

				  	}, (response) => {
				    
				    //If Request error
				    this.errorCode = response.status;
				    this.errorMsg = response.data.message;

				    //Reset the captcha
				   	grecaptcha.reset(this.grecaptcha);
			  		});
			  	}
			},
			clearTimeout() {
				window.clearTimeout(this.timeoutID);
			}
		},
		computed: {
			isConnected () {
		        return this.$store.state.isConnected;
		    },
		    loading () {
		        return this.$store.state.loading;
		    },
			//Check the name (between 3 - 20 char)
			checkName () {
				return ( this.inputName.length > 0 &&
					 	 this.inputName.length < 3 ||
					 	 this.inputName.length > 20);
			},
			//Check the PWD (more than 6 char)
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

			//Set CSS Classes
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
	.g-recaptcha{
		width: 304px;>
		height: 78px;
		margin: 0 auto;
	}
</style>