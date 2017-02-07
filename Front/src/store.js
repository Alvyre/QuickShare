'use strict';

import Vue from 'vue';
import VueX from 'vuex';

Vue.use(VueX);

const debug = process.env.NODE_ENV !== 'production';


export default new VueX.Store({
  	strict: debug,
    state: {
    	isConnected: false,
    	loading: false,
      timer: null,
  	},
  	mutations: {
		  login: 		state => state.isConnected 	= true,
    	logout: 	state => state.isConnected 	= false,
    	loadingOn: 	state => state.loading 		= true,
    	loadingOff: state => state.loading 		= false,
      setTimer (state, ref) {
        state.timer = ref;
      },
      clearTimer (state) {
        window.clearTimeout(state.timer);
        state.timer = null;
        
      }
    }
});