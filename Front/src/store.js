import Vue from 'vue'
import VueX from 'vuex'

Vue.use(VueX);

const store = new VueX.Store({
  	state: {
    	isConnected: false
  	},
  	mutations: {
		login: state => state.isConnected = true,
    	logout: state => state.isConnected = false,
    }
})

export default store;