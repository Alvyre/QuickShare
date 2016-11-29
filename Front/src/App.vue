<template>
  <div id="app">
    <nav class="navbar navbar-default navbar-fixed-top navbar-inverse">
      <!-- Brand and toggle get grouped for better mobile display -->
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <router-link to="/" class="navbar-brand">Shar'Info.io</router-link>
      </div>
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav navbar-right">
          <li><router-link to="/"><span class="glyphicon glyphicon-home" aria-hidden="true"></span>  Home</router-link></li>
          <li v-if="isConnected"><router-link to="/profile"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> My profile</router-link></li>
          <li><router-link to="/about"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>  About</router-link></li>
          <li><router-link to="/contact"><span class="glyphicon glyphicon-send" aria-hidden="true"></span>  Contact</router-link></li>
          <li v-show="isConnected"><a href="" v-on:click.stop.prevent.self="logout($event)"><span class="glyphicon glyphicon-log-out" aria-hidden="true"></span>  Logout</a></li>
          <li v-show="!isConnected"><router-link to="/sign-in"><span class="glyphicon glyphicon-log-in" aria-hidden="true"></span>  Login</router-link></li>
          <li v-show='!isConnected'><router-link to="/sign-up"><span class="glyphicon glyphicon-user" aria-hidden="true"></span>  Sign up</router-link></li>
        </ul>
      </div><!-- /.navbar-collapse -->
    </nav>
    <div id="loading" class="" v-if="loading">
      <i class="fa fa-spinner fa-pulse fa-3x fa-fw "></i>
    </div>
    <transition name="component-fade" mode="out-in">
     <router-view></router-view>
   </transition>
   <footerVue></footerVue>
   <br>
 </div>
</template>

<script>

  // Close the Collapsed menu of Bootsrap
  //==========================================================
  $(document).on('click','.navbar-collapse.in', function(e) {
    if( $(e.target).is('a') || $(e.target).is('span') ) {
      $(this).collapse('hide');
    }
  });

  $(document).on('click','body', function(e) {
    $('.navbar-collapse.in').collapse('hide');
  });
  //==========================================================

  import footerVue from './components/footer.vue'
  import Store from './store'
  import Cookie from './cookie-handler';

  export default {
    name: 'app',
    data () {
      return {
      }
    },
    components: {
      footerVue
    },
    computed: {
      isConnected () {
        return Store.state.isConnected;
        //return  (Cookie.getCookie('Connected') == 'true');
      },
      loading () {
        return Store.state.loading;
      }
    },
    methods: {
    	logout (event) {
        if(event){
          Cookie.deleteCookie('token');
          Cookie.deleteCookie('Connected');
          this.$router.push('/');
          Store.commit('logout');
        }
      }
    },
    mounted () {
      if(Cookie.getCookie('Connected') == 'true') {
        Store.commit('login');
      }
    }
  }
</script>

<style>
  html, body, #app {
    height: 100%;
  }
  body { 
    padding-top: 70px;
  }
  /* centered columns styles */
  .row-centered {
    text-align:center;
  }
  .col-centered {
    display:inline-block;
    float:none;
    /* reset the text-align */
    text-align:left;
    /* inline-block space fix */
    margin-right:-4px;
  }
  .right {
    float:right;
  }
  /* Transitions */
  .component-fade-enter-active, .component-fade-leave-active {
  	transition: opacity .3s ease;
  }
  .component-fade-enter, .component-fade-leave-active {
  	opacity: 0;
  }
  .center-block {
    float: none;
  }
  #loading {
    margin: 0 0 0 -27px;
    position: absolute;
    top: 50%;
    left: 50%;
  }
</style>
