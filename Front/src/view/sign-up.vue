<template>
	<div id="signup">
		<div class="container">
			<div class="row row-centered">
				<div class="col-xs-12 col-sm-12 col-centered">
					<div class="alert alert-success text-center" v-show="successMsg">
						<strong>{{successMsg}}</strong><br>
						<p class="text-center"><em><small>You will be redirected in 5 secs...<br> Click <a href="/sign-in">here</a> to go to the login page.</small></em></p>
					</div>
					<form action="" method="POST" role="form" v-on:submit.prevent.stop="signUp()" v-show="!successMsg">
						<legend>Sign Up</legend>
						
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
				checkboxMail: false
			}
		},
		methods: {
			signUp () {

					var gResponse = grecaptcha.getResponse();
					if(gResponse.length == 0) {
						this.errorMsg = 'G-recaptcha is not verified !';
					}
					else {
						
						var body = {
						username: 		this.inputName,
						password: 		this.inputPas,
						mail: 	  		this.inputMail,
						isEmailVisile: 	this.checkboxMail,
						gRecaptchaResponse: gResponse
						};

						//self reference for the routing
						var vue = this;
					
					  	// POST /someUrl
					  	this.$http.post('http://www.sharinfo.api.romainfrancois.fr/api/user/register', body).then((response) => {

					    // get status
					    if(response.status === 200) {
					    	this.successMsg = response.data.message;
					    	window.setTimeout(function(){
							    // Move to login page
							    vue.$router.push('/sign-in');
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
			checkEmail () {
				var regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  				if(this.inputMail.length > 0) {
  					return !regexp.test(this.inputMail);
  				}
  				else {
  					return false;
  				}
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