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
        <router-link to="/" class="navbar-brand">QuickShare.info</router-link>
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
   <div id="footer-vue">
    <footer v-if="!loading">
      <div class="row row-centered">
        <div class="col-xs-12 col-sm-12">
          QuickShare ©2016-2017
        </div>
      </div>    
    </footer>
  </div>
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

  //Imports
  //==========================================================
  
    import Store  from './store'
    import Cookie from './cookie-handler';
    import Config from './config';

  //Vue.js
  //==========================================================
    
  export default {
    name: 'app',
    data () {
      return {
      }
    },
    components: {
    },
    computed: {
      isConnected () {
        return Store.state.isConnected;
      },
      loading () {
        return Store.state.loading;
      }
    },
    methods: {
    	logout (event) {
        if(event){
          Cookie.deleteCookie('x-access-token');
          Cookie.deleteCookie('Connected');
          Cookie.deleteCookie('userID');
          Store.commit('logout');
          this.$router.push('/');
        }
      },
    },
    mounted () {
      if(Cookie.getCookie('Connected') == 'true') {
        Store.commit('login');
      }

      var Onesignal = window.Onesignal || [];
      OneSignal.push(["init", {
        appId: Config.notifAppId,
        autoRegister: false,
          notifyButton: {
            enable: false
        }
      }]);

      OneSignal.push(function() {
        OneSignal.isPushNotificationsEnabled().then(function(isEnabled) {
          if (!isEnabled){
            OneSignal.push(function() {
              OneSignal.registerForPushNotifications({
                modalPrompt: true
              });
            });
          }
        });
      });
    }
  }
</script>

<style>
  /* JAPANESE STYLE */

  .alert, .badge, .breadcrumb, .btn, .form-control, .input-gruop, .label, .lead, .list-group, .nav-pills, .nav-tabs, .navbar, .no-thank-yu, .pager, .pagination, .panel-heading, .panel-title, .popover, .tooltip {
      font-family: "Open Sans","Helvetica Neue",Helvetica,Arial,"ヒラギノ角ゴ ProN W3","Hiragino Kaku Gothic ProN","メイリオ",Meiryo,sans-serif;
  }


  body {
      font-family: "Open Sans","Helvetica Neue",Helvetica,Arial,"游ゴシック",YuGothic,"ヒラギノ角ゴ ProN W3","Hiragino Kaku Gothic ProN","メイリオ",Meiryo,sans-serif;
      font-size: 16px;
      line-height: 1.42857;
  }
  p {
      margin: 0 0 11px;
  }

  .h2, h2 {
      font-size: 28px;
  }
  .h1, .h2, .h3, h1, h2, h3 {
      margin-top: 22px;
      margin-bottom: 11px;
  }
  .h1, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 {
      font-family: "Open Sans","Helvetica Neue",Helvetica,Arial,"ヒラギノ角ゴ ProN W3","Hiragino Kaku Gothic ProN","メイリオ",Meiryo,sans-serif;
      font-weight: 300;
      line-height: 1.2;
      color: inherit;
  }

  /* END JAPANESE STYLE */

  html, body, #app {
    height: 100%;
  }
  body { 
    padding-top: 70px;
  }
  ::-webkit-scrollbar { 
    display: none; 
  }

  /* centered columns styles */
  .row-centered {
    text-align:center;
  }
  .col-centered {
    display:inline-block;
    float:none;
    /* inline-block space fix */
    margin-right:-4px;
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
  #footer-vue{
  margin-top: 20px;
  }

  /* fix nav bug */

  @media (min-width: 768px){
    .navbar-right {
      margin-right: 0!important;
    }  
  }
  
</style>
