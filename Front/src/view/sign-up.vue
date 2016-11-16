<template>
	<div id="signup">
		<div class="container">
			<div class="row row-centered">
		    	<div class="col-xs-12 col-sm-12 col-centered">
		    		<h3>Sign up:</h3>
		   		</div> 		
		   	</div>
			<div class="row row-centered">
				<div class="col-xs-12 col-sm-12 col-centered">
					<form action="" method="POST" role="form" v-on:submit.prevent.stop="signUp()">
						<legend>Sign Up</legend>
						
						<div class="alert alert-danger" v-show="errorMsg">
							<strong>Error {{errorCode}}:</strong> {{errorMsg}}
						</div>
						<div class="alert alert-success" v-show="successMsg">
							<strong>{{successMsg}}</strong>
						</div>

						<div class="form-group">
							<label for="name">Name</label>
							<input type="text" class="form-control" id="inputName" required='required' v-model="inputName">
						</div>
						<div class="form-group">
							<label for="password">Password</label>
							<input type="password" name="password" id="inputPas" class="form-control" required="required" title="" v-model="inputPas">
						</div>
						<div class="form-group">
							<label for="mail">Email</label>
							<input type="email" name="mail" id="inputMail" class="form-control" value="" required="required" title="" v-model="inputMail">
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
					
					  	// POST /someUrl
					  	this.$http.post('http://localhost:8080/api/user/register', body).then((response) => {

					    // get status
					    if(response.status === 200) {
					    	this.successMsg = response.data.message;
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
		}
	}
</script>

<style>
	.g-recaptcha{
		width: 304px;
		height: 78px;
		margin: 0 auto;
	}
</style>