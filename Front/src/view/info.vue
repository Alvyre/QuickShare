<template>
	<div id="info">
		<div class="row" v-if="infoData.length != 0">
			<div class="col-xs-12 col-sm-12">
				<div class="panel panel-success" :class="setClass(infoData)">
					<div class="panel-heading">
						<span>{{infoData.title}}</span>
					</div>
					<div class="panel-body">
						<p><span class="glyphicon glyphicon-flag" aria-hidden="true"></span> : {{infoData.category}}</p>
						<p><span class="glyphicon glyphicon-comment" aria-hidden="true"></span> : {{infoData.description}}</p>
						<p>
							<span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span> : {{infoData.location}}<span v-if='infoData.addInfo'>,</span> {{infoData.addInfo}}
						</p>
						<p>
							<span class="glyphicon glyphicon-user" aria-hidden="true"></span> : {{infoData.userList.length}}/{{infoData.userLimit}}
						</p> 
						<p><span class="glyphicon glyphicon-time" aria-hidden="true"></span> {{infoData.birthdate | localeDate }}</p>
						<p><span class="glyphicon glyphicon-hourglass" aria-hidden="true"></span> {{infoData.expirydate | TimeRemainingWith(infoData.birthdate) }}</p>
						<button type="button" class="btn btn-large btn-block btn-success" v-if="infoData.category == 'Event' && isEventJoined == -1" :class="isEventFull" v-on:click.prevent.stop="joinEvent(infoData, $event)">Join Event</button>
						<button type="button" class="btn btn-large btn-block btn-danger" v-if="infoData.category == 'Event' && isEventJoined == 1" v-on:click.prevent.stop="leaveEvent(infoData, $event)">Leave Event</button>
						<hr>
						<footer>
							<div class="right">
								<button type="button" class="btn btn-xs btn-success">
									<span class="glyphicon glyphicon-thumbs-up" aria-hidden="true" style="color: white;"></span>
								</button>
								<span>{{infoData.voteCount}}</span>
								<button type="button" class="btn btn-xs btn-danger">
									<span class="glyphicon glyphicon-thumbs-down" aria-hidden="true" style="color: white;"></span>
								</button>
							</div>
						</footer>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Store from '../store';
	import Cookie from '../cookie-handler';

	export default {
		name: 'info',
		data () {
			return {
				infoData: [],
				errorMsg: '',
				errorCode: '',
				successMsg: ''
			}
		},
		mounted () {

			Store.commit('loadingOn');
			this.fetchInfoData();	
		},
		methods : {
			fetchInfoData () {
				var options = {
					headers: {
						'x-access-token': Cookie.getCookie('token')
					},
					credentials: true
				};
				let idInfo = (document.URL.split('/'))[4];
				this.$http.get('http://www.sharinfo.api.romainfrancois.fr/api/infos/id/'+idInfo, options).then((response) => {

					Store.commit('loadingOff');
					if(response.status != 200) {
						this.errorMsg = response.data.message;
						this.errorCode = response.status;
					}
					else {
						this.infoData = response.data;
					}

				}, (response) => {
					console.log('Error:', response);
					this.errorMsg = response.data.message;
					Store.commit('loadingOff');
					if(response.status == 403)
						this.errorMsg = 'Unknown token, please try to login again';
					this.errorCode = response.status;
				});
			},
			setClass (info) {
				switch(info.category) {
					case 'Info':
						return 'panel-info';
					break;
					case 'Event':
						return 'panel-success';
					break;
					case 'Help':
						return 'panel-warning';
					break;
					default:
					return '';
					break;
				}
			},
			joinEvent (event, click) {
				console.log(click);
				if(!click) return;
				if(event.category != 'Event') return;
				var options = {
					headers: {
						'x-access-token': Cookie.getCookie('token')
					},
					credentials: true
				};
				
				let idInfo = (document.URL.split('/'))[4];
				
				this.$http.post('http://www.sharinfo.api.romainfrancois.fr/api/infos/'+idInfo+'/join',{}, options).then((response) => {
					if(response.status == 200)
						this.successMsg = response.data.message;
					else {
						this.errorMsg = response.data.message;
						this.errorCode = response.status;
					}
					this.fetchInfoData();
				}, (response) => {
					this.errorMsg = response.data.message;
					this.errorCode = response.status;
					console.log('Error: ' +response);
				});
			},
			leaveEvent (event, click) {
				console.log(click);
				if(!click) return;
				if(event.category != 'Event') return;
				var options = {
					headers: {
						'x-access-token': Cookie.getCookie('token')
					},
					credentials: true
				};
				
				let idInfo = (document.URL.split('/'))[4];
				
				this.$http.post('http://www.sharinfo.api.romainfrancois.fr/api/infos/'+idInfo+'/leave',{}, options).then((response) => {
					if(response.status == 200)
						this.successMsg = response.data.message;
					else {
						this.errorMsg = response.data.message;
						this.errorCode = response.status;
					}
					this.fetchInfoData();
				}, (response) => {
					this.errorMsg = response.data.message;
					this.errorCode = response.status;
					console.log('Error: ' +response);
				});
			}
		},
		computed: {
			isEventJoined () {
				console.log(Cookie.getCookie('userID'));
				console.log(this.infoData.userList.indexOf(Cookie.getCookie('userID')));
				return this.infoData.userList.indexOf(Cookie.getCookie('userID'));
			},
			isEventFull () {
				return this.infoData.userList.length >= this.infoData.userLimit && this.infoData.acceptOverload;
			}
		},
		filters: {
			localeDate (date) {
				var localeDate = new Date(date);
				return (localeDate.toLocaleString());
			},
			TimeRemainingWith (strDateB, strDateA) {
				let dateB = new Date(strDateB).getTime();
				let dateA = new Date(strDateA).getTime();
				var timeleft =new Date(Math.abs(dateB - dateA));
				
				let x = x = Math.floor(timeleft/1000);
				let seconds = x % 60;
				if(seconds<10) seconds = '0'+seconds;
				x = Math.floor(x/60);
				let minutes = x % 60;
				if(minutes<10) minutes = '0'+minutes;
				x = Math.floor(x/60);
				let hours = x % 24;
				if(hours<10) hours= '0'+hours;
				x = Math.floor(x/24);
				let days = x;
				if(days <10) days = '0'+days;

				return days +':' +hours +':' +minutes +':' +seconds;
			}
		}

	}
</script>

<style>
	.info {
		background.color: #31B0D5;

	}
</style>