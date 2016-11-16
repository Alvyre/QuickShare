import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
Vue.use(VueRouter);
Vue.use(VueResource);

const router = new VueRouter({
	mode: 'history',
	routes: [
	{
		name: 'home',
		path: '/',
		component: require('./view/home.vue')
	},
	{
		name: 'info',
		path: '/info/:id',
		component: require('./view/info.vue')
	},
	{
		name: 'signIn',
		path: '/sign-in',
		component: require('./view/sign-in.vue')
	},
	{
		name: 'signUp',
		path: '/sign-up',
		component: require('./view/sign-up.vue')
	}]
})

new Vue({
  el: '#app',
  router: router,
  render: h => h(require('./App.vue'))
})

/*Vue.config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
});*/