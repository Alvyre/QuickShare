<template>
	<div id="userProfile">
		<div class="userInfos">
			<div class="row row-centered">
				<div class="col-xs-12 col-sm-12">
					<div class="jumbotron">
						<div class="container">
							<h1>USERNAME PROFILE</h1>
						</div>
					</div>
					<div id="posts">
						<div class="myInfos">
							<h4><strong>My active information:</strong></h4>
							<div class="row">
								<div class="col-xs-6 col-md-3 info panel-success">

									<button type="button" class="btn btn-block"><strong>CATEGORY</strong><br>TITLE<br><em>read more..</em></button>
								</div>
							</div>
						</div>
					</div>
				</div>
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

	// Vue.js
	//==========================

	export default {
		name: 'userProfile',
		data() {
			return {
				userData: {},
				errorMsg: '',
				errorCode: '',

			}
		},
		mounted () {
			Store.commit('loadingOn');
			this.fetchUserProfile();
		},
		methods: {
			fetchUserProfile () {
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
				let idUser = (document.URL.split('/'))[4];
				this.$http.get(Config.urlAPI +'/api/user/id/' +idUser, options).then((response) => {
					if(response.status == 200) {
						this.userData = response.data;
					}
					else {

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
					this.errorCode = response.status
				});


			}
		},
		computed: {
			isConnected () {
				return Cookie.getCookie('Connected') == 'true';
			}
		}
	}
</script>

<style></style>