import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
Vue.use(VueRouter)
Vue.use(VueResource)
require('./api.js');

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            name: 'home',
            path: '/',
            component: require('./pages/home/home.vue')
        },
        {
            name: 'video',
            path: '/video/:id',
            component: require('./pages/video/video.vue')
        },
        {
            name: 'search',
            path: '/search/:query',
            component: require('./pages/search/search.vue'),
            children: [
                {
                    name: 'searchVideo',
                    path: 'videos',
                    component: require('./pages/search/search-video.vue')
                },
                {
                    name: 'searchSong',
                    path: 'songs',
                    component: require('./pages/search/search-song.vue')
                },
                {
                    name: 'searchArtist',
                    path: 'artists',
                    component: require('./pages/search/search-artist.vue')
                }
            ]
        },
        {
            name: 'signIn',
            path: '/sign-in',
            component: require('./pages/signIn/sign-in.vue')
        },
        {
            name: 'signUp',
            path: '/sign-up',
            component: require('./pages/signUp/sign-up.vue')
        }
    ]
})

/* eslint-disable no-new */
new Vue({
        el: '#app',
        router: router,
        render: h => h(require('./App.vue'))
})