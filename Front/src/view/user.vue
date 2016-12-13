<template>
	<div id="userProfile" v-if="!loading">
		<div class="userInfos">
			<div class="row row-centered">
				<div class="col-xs-12 col-sm-12">
					<div class="jumbotron">
						<div class="container">
							<h1>{{userData.username}}'s profile</h1>
						</div>
					</div>
					<!-- General info -->
					<div id="personal-contact" v-if="userData.isEmailVisible">
						<div class="row row-centered">
							<div class="col-xs-6 col-xs-offset-3 col-sm-4 col-sm-offset-4">
								<a class="btn btn-primary" v-bind:href="mailto" role="">Contact</a>
							</div>
						</div>
					</div>
					<div id="active-posts">
						<!-- Posts -->
						<div class="infos">
						<h4 v-if="infos.length != 0" ><strong>Active information:</strong></h4>
							<div class="row">
								<div class="col-xs-6 col-md-3 info panel-success" v-for="info in infos">
									<router-link v-bind:to="getRoute(info._id)">
										<button type="button" class="btn btn-block" :class="setClass(info)"><strong>{{info.category}}</strong><br>{{info.title}}<br><em>read more..</em></button>
									</router-link>
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
				infos: {},
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
					// get the posts
			    		this.$http.get(Config.urlAPI +'/api/infos/user/'+idUser, options).then((response) => {
			    			this.infos = response.data;
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
					}
					else {
						this.errorMsg = response.data.message;
						this.errorCode = response.status;
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
			},
			mailto (){
				return 'mailto:'+ this.userData.mail + '?subject=[Contact QuickShare]';
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
			}
		},
		computed: {
			isConnected () {
				return Cookie.getCookie('Connected') == 'true';
			},
			loading () {
				return Store.state.loading;
			}
		}
	}
</script>

<style></style>