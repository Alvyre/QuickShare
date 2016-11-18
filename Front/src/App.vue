<template>
  <div id="app">
    <div class="container">
      <nav class="navbar navbar-default navbar-fixed-top navbar-inverse">
        <div class="container-fluid">
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
              <li><router-link to="/about"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>  About</router-link></li>
              <li><router-link to="/contact"><span class="glyphicon glyphicon-send" aria-hidden="true"></span>  Contact</router-link></li>
              <li v-if="isConnected"><a href=""><span class="glyphicon glyphicon-log-out" aria-hidden="true"></span>  Logout</a></li>
              <li v-if="!isConnected"><a href="/sign-in"><span class="glyphicon glyphicon-log-in" aria-hidden="true"></span>  Login</a></li>
              <li v-if='!isConnected'><a href="/sign-up"><span class="glyphicon glyphicon-user" aria-hidden="true"></span>  Sign up</a></li>
            </ul>
          </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
      </nav>
    </div>

    <router-view></router-view>

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
        console.log('Im trigered!');
        console.log(Store.state.isConnected);
        return Store.state.isConnected;
      }
    }
  }
</script>

<style>
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
</style>
