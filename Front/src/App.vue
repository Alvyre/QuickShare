<template>
  <div id="app">
    <navigation :isConnected="false"></navigation>

    <router-view></router-view>

    <footerVue></footerVue>
    <br>
  </div>
</template>

<script>
  import navigation from './components/navigation.vue'
  import footerVue from './components/footer.vue'

  export default {
    name: 'app',
    data () {
      return {
      }
    },
    components: {
      navigation,
      footerVue
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
