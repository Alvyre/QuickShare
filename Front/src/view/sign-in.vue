<template>
	<div id="signIn">
		<div class="container">
			<div class="row row-centered">
				<div class="col-xs-12 col-sm-12 col-centered">
					<div class="alert alert-success text-center" v-show="successMsg">
						<strong>{{successMsg}}</strong>
						<p class="text-center"><em><small>You will be redirected in 5 secs...<br> Click <router-link to="/">here</router-link> to go to the home page.</small></em></p>
					</div>
					<form action="" method="POST" role="form" v-on:submit.prevent.stop="signIn()" v-show="!successMsg">
						<legend>Sign-in</legend>
					
						<div class="alert alert-danger" v-show="errorMsg">
							<strong>Error {{errorCode}}:</strong> {{errorMsg}}
						</div>

						<div class="form-group" :class="className">
							<label for="name">Name</label>
							<input type="text" class="form-control" id="inputName" required='required' aria-describedby="infoName" v-model="inputName">
							<div id="infoName" class="help-block" v-show="checkName">Please type a name in a range from 3 to 6 characters.</div>
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
	</div>
</template>

<script>
	import Store from '../store';
	import Cookie from '../cookie-handler';

	export default {
		name: 'signIn',
		data () {
			return {
				errorMsg: '',
				errorCode: '',
				successMsg: '',
				inputName: '',
				inputPas: '',
			}
		},
		methods: {
			signIn () {

					var gResponse = grecaptcha.getResponse();
					if(gResponse.length == 0) {
						this.errorMsg = 'G-recaptcha is not verified !';
					}
					else {
						
						var body = {
						username: 		this.inputName,
						password: 		this.inputPas,
						gRecaptchaResponse: gResponse
						};

						// self reference for the routing
						var vue = this;

					  	// POST /someUrl
					  	this.$http.post('http://www.sharinfo.api.romainfrancois.fr/api/user/login', body).then((response) => {

					    // get status
					    if(response.status === 200) {
					    	this.successMsg = response.data.message;
					    	//Change the isConnected state
					    	
					    	Cookie.setCookie('token', response.data.JWT, 1);
					    	Cookie.setCookie('Connected', 'true');
					    	Store.commit('login');
					    	//Redirection to homepage
					    	window.setTimeout(function(){
							    // Move to login page
							    vue.$router.go('/');
							    }, 5000); // 5 secs
					    }
					    else {
					    	this.errorMsg = response.data.message;
					    }

					  	}, (response) => {
					    // error callback
					    this.errorCode = response.status;
					    this.errorMsg = response.data.message;

					   	grecaptcha.reset();
				  		});
				  	}
			}
		},
		computed: {
			checkName () {
				return ( this.inputName.length > 0 &&
					 	 this.inputName.length < 3 ||
					 	 this.inputName.length > 6);
			},
			checkPwd () {
				return ( this.inputPas.length > 0 &&
						 this.inputPas.length < 6);
			},
			className () {
				return {
					'has-success': 	this.inputName.length >= 3 && this.inputName.length <= 6,
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