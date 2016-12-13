<template>
	<div id="addInfo">
		<div class="well">
			<div class="row row-centered">
				<div class="col-xs-12 col-sm-12 col-centered">
					<h3 class="text-center"><strong>Add an information:</strong></h3>
					<h5><em>Fields with * are required</em></h5>
				</div>
			</div>
			<div class="row row-centered">
				<div class="col-xs-12 col-sm-12 col-centered">
					<form action="" method="POST" role="form" v-on:submit.stop.prevent="submitInfo()">

						<!-- Title -->				
						<div class="form-group" :class="classTitle">
							<label for="title">Title*</label>
							<input type="text" class="form-control" v-model="newInfo.title" id="title" placeholder="Input title of the information" required="required" ariadescribed-by="infoTitle">
							<div id="infoTitle" class="help-block" v-show="!displayHelpTitle">Please type a title with at least 3 characters.</div>
						</div>

						<!-- Description -->
						<div class="form-group" :class="classDescription">
							<label for='description'>Description*</label>
							<input type="text" name="description" class="form-control" v-model="newInfo.description" placeholder="Input a description" required="required" ariadescribed-by="infoDescription">
							<div id="infoDescription" class="help-block" v-show="!displayHelpDescription">Please type a description with at least 3 characters.</div>
						</div>

						<!-- Start Date -->
						<div class="form-group">
							<label for='startdate'>Start Date*</label> <em>(Maximum 7 days from now)</em><br>
							<Flatpickr :options='optionsBegin' :class="form-control" @update="updateStartDate"/>
						</div>

						<!-- End Date -->
						<div class="form-group">
							<label for='enddate'>End Date*</label> <em>(Maximum 24h hours from the start date)</em><br>
							<Flatpickr :options='optionsEnd' :message="defaultEndDate" :class="form-control" @update="updateEndDate" @FlatpickrRef="setEndFlatpickrRef"/>
						</div>

						<!-- Category -->
						<div class="form-group">
							<label for="category">Category*</label>
							<select name="" id="input" class="form-control" required="required" v-model="newInfo.category">
								<option value="Info">General Info</option>
								<option value="Event">Event, Exhibition, Party</option>
								<option value="Help">Help request</option>
							</select>
						</div>

						<!-- Location -->
						<div class="form-group" :class="classLocation">
							<label for="location">Location*</label>
							<input type="text" name="location" class="form-control" v-model="newInfo.location" placeholder="Input a location" ariadescribed-by="infoLocation" required="required">
							<div id="infoLocation" class="help-block" v-show="!displayHelpLocation">Please type a location with at least 3 characters.</div>
						</div>

						<!-- Location Additional -->
						<div class="form-group">
							<label for="addinfo">Additional information for location <small><em>(optional)</em></small></label>
							<input type="text" name="addInfo" class="form-control" v-model="newInfo.addInfo" placeholder="Input additional information about location">
						</div>

						<!-- Overload -->
						<div class="form-group" v-if="newInfo.category == 'Event'">
							<div class="checkbox checkbox-inline">
								<label>
									<input type="checkbox" v-model="newInfo.acceptOverload">
									Accept Overload?*
								</label>
							</div>
						</div>

						<!-- User Limit -->
						<div class="form-group" v-if="(!newInfo.acceptOverload) && newInfo.category == 'Event'" :class="classMaxNumber">
							<label>Maximum people*</label>
							<input type="number" name="maxPeople" class="form-control" v-model="newInfo.userLimit"  placeholder="input a number" ariadescribed-by="infoUserLimit" required="required">
							<div id="infoUserLimit" class="help-block" v-show="!displayHelpMaxNumber">Please type a number superior to 1.</div>
						</div>

						<!-- Success/Error messages -->
						<div class="alert alert-success text-center" v-show="successMsg">
							<strong>{{successMsg}}</strong>
							<p class="text-center"><em><small>You will be redirected in 3 secs...<br> Click <router-link to="/">here</router-link> to go to the home page.</small></em></p>
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

// Import
//=======================================

import Store from '../store';
import Cookie from '../cookie-handler';
import Flatpickr from 'vue-flatpickr/vue-flatpickr-material_blue.vue';
import Config from '../config';

var moment = require('moment');
moment().format();


// VUE
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
				alInputClass: 'form-control',
				dateFormat: 'm/d/Y H:i',
				enableTime: true,
				time_24hr: true,
				defaultDate: moment().format("MM/DD/YYYY HH:mm"),
				minDate: moment().format("MM/DD/YYYY HH:mm"),
				maxDate: moment().add(Config.infoTTL, 'd').format("MM/DD/YYYY HH:mm")
			},
			optionsEnd: {
				alInputClass: 'form-control',
				dateFormat: 'm/d/Y H:i',
				enableTime: true,
				time_24hr: true
			},
			endFlatpickr: '',
			defaultEndDate: ''
		}
	},
	mounted() {
		//Redirect to the homepage if not connected
		if(Cookie.getCookie('Connected') != 'true') {
			this.$router.push('/');
		}
	},
	components: {
		Flatpickr
	},
	methods: {
		setEndFlatpickrRef (ref) {
			this.endFlatpickr = ref;
		},
		updateStartDate (val) {
			//Get the input value
			let inputDate = moment(val, "MM/DD/YYYY HH:mm");
			
			//Update the end date Flatpickr component
			this.endFlatpickr.set('minDate', inputDate.format("MM/DD/YYYY 00:00"));
			this.defaultEndDate = inputDate.format("MM/DD/YYYY HH:mm");
			this.endFlatpickr.set('maxDate', inputDate.add(1, 'd').format("MM/DD/YYYY HH:mm"));

			//Set the birthdate & expirydate
			this.newInfo.birthdate = moment(val, "MM/DD/YYYY HH:mm").utc().format();
			this.newInfo.expirydate = this.newInfo.birthdate;
		},
		updateEndDate (val) {
			this.newInfo.expirydate = moment(val, "MM/DD/YYYY HH:mm").utc().format();	
		},
		submitInfo () {
			if(this.isInfoCorrect() != 0) return;
			

			//Request Options (COORS, Token etc..)
			var options = {
				headers: {
					'x-access-token': Cookie.getCookie('token')
				},
				credentials: true
			};

			//Vue reference to redirect if success()
			var vue = this;

			//Add info POST request
			this.$http.post(Config.urlAPI +'/api/infos/', this.newInfo, options).then((response) => {

				//If success()
				if(response.status == 200) {
					this.successMsg = response.data.message;
					
					//Set timeout to redirect to homepage (3secs)
					window.setTimeout(function(){
						vue.$router.push('/');
					}, 3000);
				}
				//If error (bad data)
				else {
					this.errorCode = response.status;
					this.errorMsg  = response.data.message;
				}
				//If error (bad request)
			}, (response) => {
				console.log('Error:', response);
				this.errorCode = response.status;
				this.errorMsg = response.data.message;
			});
		},
		isInfoCorrect () {

			/*******Check the title******/
			/*	Title == null ? 		*/
			/*	Title == undefined ?	*/
			/*  Title == '' ?			*/
			/*	Title length < 3		*/
			/****************************/
			if(this.newInfo.title == null || this.newInfo.title == undefined || this.newInfo.title == '' || this.newInfo.title.length < 3) {
				this.errorMsg = 'Title is incorrect.';
				return -1;
			}
			
			/*******Check the description**********/
			/*	Description == null ? 			  */
			/*	Description == undefined ?		  */
			/*  Description == '' ?				  */
			/*	Description length < 3			  */
			/**************************************/
			else if(this.newInfo.description == null || this.newInfo.description == undefined || this.newInfo.description == '' || this.newInfo.description.length < 3) {
				this.errorMsg = 'Description is incorrect.';
				return -1;
			}

			/*******Check the birthdate******/
			/*	Birthdate == null ? 		*/
			/*	Birthdate == undefined ?	*/
			/*	Birthdate == ''				*/
			/*  Birthdate < Now ?			*/
			/*  Birthdate > Now + x days ?	*/
			/********************************/
			else if(this.newInfo.birthdate == null || this.newInfo.birthdate == undefined || this.newInfo.birthdate == '' || moment(this.newInfo.birthdate).isBefore(moment()) || moment(this.newInfo.birthdate).isAfter(moment().add(7,'d') ) ) {
				this.errorMsg = 'Start date is incorrect.';
				return -1
			}

			/*******Check the Expirydate*********/
			/*	Expirydate == null ? 			*/
			/*	Expirydate == undefined ?		*/
			/*	Expirydate == ''				*/
			/*  Expirydate < Birthdate ?		*/
			/*  Expirydate > Birthdate + 1 day ?*/
			/************************************/
			else if(this.newInfo.expirydate == null || this.newInfo.expirydate == undefined || this.newInfo.expirydate == '' || moment(this.newInfo.expirydate).isBefore(moment(this.newInfo.birthdate, "MM/DD/YYYY HH:mm")) || moment(this.newInfo.expirydate, "MM/DD/YYYY HH:mm").isAfter(moment(this.newInfo.birthdate).add(1,'d') ) ) {
				this.errorMsg = 'End date is incorrect.';
				return -1;
			}

			/*******Check the Category*************/
			/*	Category == null ? 			  	  */
			/*	Category == undefined ?		  	  */
			/*  Category == '' ?				  */
			/**************************************/
			else if(this.newInfo.category == null || this.newInfo.category == undefined || this.newInfo.category == '') {
				this.errorMsg = 'Category is incorrect.';
				return -1;
			}

			/*******Check the Location*********/
			/*	Location == null ? 			  */
			/*	Location == undefined ?		  */
			/*  Location == '' ?			  */
			/*	Location length < 3			  */
			/**********************************/			
			else if(this.newInfo.location == null || this.newInfo.location == undefined || this.newInfo.location == '' || this.newInfo.location.length < 3) {
				this.errorMsg = 'Location is incorrect.';
				return -1;
			}
			
			/* If Event */
			/* Check overload 	*/
			/* Check UserLimit 	*/
			if(this.newInfo.category == 'Event') {
				if(this.newInfo.acceptOverload == false) {
					if(this.newInfo.userLimit == null || this.newInfo.userLimit == undefined || this.newInfo.userLimit < 2) {
						this.errorMsg = 'Maximum user is incorrect.';
						return -1;
					} 
				}
			}

			// Info checked and valid
			return 0;
		}
	},
	computed: {

		//Set the CSS class for the title
		classTitle () {
			return {
				'has-success': this.newInfo.title.length >= 3,
				'has-error':   this.newInfo.title.length > 0 && this.newInfo.title.length < 3
			}
		},
		//Display tips panel for the title
		displayHelpTitle() {
			return this.newInfo.title.length >= 3 || this.newInfo.title.length == 0;
		},

		//Set the CSS class for the Description
		classDescription () {
			return {
				'has-success': this.newInfo.description.length >= 3,
				'has-error':   this.newInfo.description.length > 0 && this.newInfo.description.length < 3
			}	
		},
		//Display tips panel for the description
		displayHelpDescription () {
			return this.newInfo.description.length >= 3 || this.newInfo.description.length == 0;
		},

		//Set the CSS class for the Location
		classLocation () {
			return {
				'has-success': this.newInfo.location.length >= 3,
				'has-error':   this.newInfo.location.length > 0 && this.newInfo.location.length < 3
			}
		},
		//Display tips panel for the description
		displayHelpLocation () {
			return this.newInfo.location.length >= 3 || this.newInfo.location.length == 0;
		},

		//Set the CSS class for the user limit
		classMaxNumber () {
			return {
				'has-success': this.newInfo.userLimit >= 2,
				'has-error'  : this.newInfo.userLimit < 2 && this.newInfo.userLimit != ''
			}
		},
		//Display tips panel for the user limit
		displayHelpMaxNumber () {
			return this.newInfo.userLimit >= 2 || this.newInfo.userLimit.length == 0;
		}
	}
}
</script>