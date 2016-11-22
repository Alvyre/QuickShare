<template>
	<div id="profile">
		<div class="container">
			<div class="alert alert-danger" v-if="errorCode">
				<strong>Error {{errorCode}}:</strong> {{errorMsg}}
			</div>
			<div class="userInfos" v-if="!errorCode">
				<div class="row row-centered">
					<div class="col-xs-12 col-sm-12">
						<div class="jumbotron">
							<div class="container">
								<h1>Hello, {{userData.username}}</h1>
								<p>Contents ...</p>
								<p>
									<a class="btn btn-primary btn-lg">Learn more</a>
								</p>
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
			
	</div>
</template>

<script>
	import Cookie from '../cookie-handler';
	export default {
		name: 'profile',
		data () {
			return {
				userData: [],
				errorMsg: '',
				errorCode: ''
			}
		},
		mounted () {
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

				this.$http.get('http://www.sharinfo.api.romainfrancois.fr/api/user/myprofile', options).then((response) => {
		    		this.userData = response.data;
		    		if(response.status != 200) {
		    			this.errorMsg = response.message;
		    			this.errorCode = response.status;
		    		}
		  		}, (response) => {
		    		console.log('Error:', response);
		    		this.errorMsg = response.message;
		    		if(response.status == 403)
		    			this.errorMsg = 'Unknown token, please try to login again'
		    		this.errorCode = response.status;
		  		});
			}
		}
	}
</script>