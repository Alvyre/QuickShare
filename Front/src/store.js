'use strict';

import Vue from 'vue';
import VueX from 'vuex';

Vue.use(VueX);

const store = new VueX.Store({
  	state: {
    	isConnected: false,
    	loading: false
  	},
  	mutations: {
		  login: 		state => state.isConnected 	= true,
    	logout: 	state => state.isConnected 	= false,
    	loadingOn: 	state => state.loading 		= true,
    	loadingOff: state => state.loading 		= false
    }
});

export default store;