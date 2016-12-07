<template>
	<div id="addInfo">
	<div class="well">
		
	
		<div class="row row-centered">
			<div class="col-xs-12 col-sm-12 col-centered">
				<h3 class="text-center">Add an information:</h3>
			</div>
		</div>
		<div class="row row-centered">
			<div class="col-xs-12 col-sm-12 col-centered">
				<form action="" method="POST" role="form" v-on:submit.stop.prevent="submitInfo()">					
					<div class="form-group" :class="classTitle">
						<label for="title">Title</label>
						<input type="text" class="form-control" v-model="newInfo.title" id="title" placeholder="Input title of the information" required="required" ariadescribed-by="infoTitle">
						<div id="infoTitle" class="help-block" v-show="!displayHelpTitle">Please type a title with at least 3 characters.</div>
					</div>
					<div class="form-group" :class="classDescription">
						<label for='description'>Description</label>
						<input type="text" name="description" class="form-control" v-model="newInfo.description" placeholder="Input a description" required="required" ariadescribed-by="infoDescription">
						<div id="infoDescription" class="help-block" v-show="!displayHelpDescription">Please type a description with at least 3 characters.</div>
					</div>
					<div class="form-group">
						<label for='startdate'>Start Date</label> <em>(Maximum 24h from now)</em><br>
						<Flatpickr :options='optionsBegin' :class="form-control" @update="updateStartDate"/>
					</div>
					<div class="form-group">
						<label for='enddate'>End Date</label> <em>(Maximum 24h from the start date)</em><br>
						<Flatpickr :options='optionsEnd' :class="form-control" @update="updateEndDate"/>
					</div>
					<div class="form-group">
						<label for="category">Category</label>
						<select name="" id="input" class="form-control" required="required" v-model="newInfo.category">
							<option value="Info">General Info</option>
							<option value="Event">Event, Exhibition, Party</option>
							<option value="Help">Help request</option>
						</select>
					</div>
					<div class="form-group" :class="classLocation">
						<label for="location">Location</label>
						<input type="text" name="location" class="form-control" v-model="newInfo.location" placeholder="Input a location" ariadescribed-by="infoLocation">
						<div id="infoLocation" class="help-block" v-show="!displayHelpLocation">Please type a location with at least 3 characters.</div>
					</div>
					<div class="form-group">
						<label for="addinfo">Additional information for location</label>
						<input type="text" name="addInfo" class="form-control" v-model="newInfo.addInfo" placeholder="Input additional information about location">
					</div>
					<div class="form-group" v-if="newInfo.category == 'Event'">
						<div class="checkbox checkbox-inline">
							<label>
								<input type="checkbox" v-model="newInfo.acceptOverload">
								Accept Overload?
							</label>
						</div>
					</div>
					<div class="form-group" v-if="(!newInfo.acceptOverload) && newInfo.category == 'Event'" :class="classMaxNumber">
						<label>Maximum people</label>
						<input type="number" name="maxPeople" class="form-control" v-model="newInfo.userLimit"  placeholder="input a number" ariadescribed-by="infoUserLimit">
						<div id="infoUserLimit" class="help-block" v-show="!displayHelpMaxNumber">Please type a number superior to 1.</div>
					</div>
					<!-- Response -->
					<div class="alert alert-success text-center" v-show="successMsg">
						<strong>{{successMsg}}</strong>
						<p class="text-center"><em><small>You will be redirected in 5 secs...<br> Click <router-link to="/">here</router-link> to go to the home page.</small></em></p>
					</div>
					<div class="alert alert-danger" v-show="errorMsg">
							<strong>Error {{errorCode}}:</strong> {{errorMsg}}
					</div>

					<button type="submit" class="btn btn-primary">Submit</button>
				</form>
			</div>
		</div> 
		</div>	
	</div>
</template>

<script>

//Import
//=======================================

import Store from '../store';
import Cookie from '../cookie-handler';
import Flatpickr from 'vue-flatpickr/vue-flatpickr-material_blue.vue';
import Config from '../config';

var moment = require('moment');
moment().format();


//VUE
//=======================================

export default {
	name: 'addInfo',
	data () {
		return {
			errorMsg: '',
			errorCode: '',
			successMsg: '',
			newInfo: {
				title: '',
				description: '',
				birthdate: '',
				expirydate: '',
				category: '',
				location: '',
				addInfo: '',
				userLimit: '',
				acceptOverload: false
			},
			optionsBegin: {
				enableTime: true,
				time_24hr: true,
				defaultDate: moment().format(),
				minDate: moment().format(),
				maxDate: moment().add(1, 'd').format()
			},
			optionsEnd: {
				enableTime: true,
				time_24hr: true,
				defaultDate: moment().format(),
				minDate: moment().format(),
				maxDate: null
			}
		}
	},
	mounted() {
		if(Cookie.getCookie('Connected') != 'true') {
			this.$router.push('/');
		}
	},
	components: {
		Flatpickr
	},
	methods: {
		updateStartDate (val) {
			this.newInfo.birthdate = moment(val).utc().format();
		},
		updateEndDate (val) {
			this.newInfo.expirydate = moment(val).utc().format();	
		},
		submitInfo () {
			var options = {
				headers: {
					'x-access-token': Cookie.getCookie('token')
				},
				credentials: true
			};
			var vue = this;
			this.$http.post(Config.urlAPI +'/api/infos/', this.newInfo, options).then((response) => {
				if(response.status == 200) {
					this.successMsg = response.data.message;
					//Redirection to homepage
					window.setTimeout(function(){
						// Move to login page
						vue.$router.push('/');
					}, 5000); // 5 secs
				}
				else {
					this.errorCode = response.status;
					this.errorMsg  = response.data.message;
				}
			}, (response) => {
				console.log('Error:', response);
				this.errorCode = response.status;
				this.errorMsg = response.data.message;
			});
		}
	},
	computed: {
		classTitle () {
			return {
				'has-success': this.newInfo.title.length >= 3,
				'has-error':   this.newInfo.title.length > 0 && this.newInfo.title.length < 3
			}
		},
		displayHelpTitle() {
			return this.newInfo.title.length >= 3 || this.newInfo.title.length == 0;
		},
		classDescription () {
			return {
				'has-success': this.newInfo.description.length >= 3,
				'has-error':   this.newInfo.description.length > 0 && this.newInfo.description.length < 3
			}	
		},
		displayHelpDescription () {
			return this.newInfo.description.length >= 3 || this.newInfo.description.length == 0;
		},
		classLocation () {
			return {
				'has-success': this.newInfo.location.length >= 3,
				'has-error':   this.newInfo.location.length > 0 && this.newInfo.location.length < 3
			}
		},
		displayHelpLocation () {
			return this.newInfo.location.length >= 3 || this.newInfo.location.length == 0;
		},
		classMaxNumber () {
			return {
				'has-success': this.newInfo.userLimit >= 2,
				'has-error'  : this.newInfo.userLimit < 2 && this.newInfo.userLimit != ''
			}
		},
		displayHelpMaxNumber () {
			return this.newInfo.userLimit >= 2 || this.newInfo.userLimit.length == 0;
		}
	}
}
</script>

<style>
</style>