<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import {EventEnums} from "./configs/event";
import {StoreEnums} from "./configs/store";

export default {
  async created(){
    this.$store.commit(StoreEnums.InitToken);
    this.$listener.$on(EventEnums.DoLogin,async token=>{
      await this.$store.dispatch(StoreEnums.UpdateToken,token);
      if (this.$route.path === '/login') {
        this.checkLastRoute();
      }
    });
    this.$listener.$on(EventEnums.AuthExpire,()=>{
      this.$store.commit(StoreEnums.CleanToken);
      this.login();
    })

    this.$nextTick(()=>{
      if (!this.$store.token)
        return this.login();
      if (!this.$route.name)
        this.$router.push({name:'Index'});
    })
  },
  data () {
    return {
      validPath: ['/login']
    }
  },
  methods: {
    setLastRoute() {
      this.$route.name && !this.validPath.includes(this.$route.path) && localStorage.setItem('lastRoute',JSON.stringify(Object.assign({},{name:this.$route.name,query:this.$route.query,params:this.$route.params})));
    },
    checkLastRoute () {
      let lastRoute = localStorage.getItem('lastRoute');
      if (lastRoute) {
        lastRoute = JSON.parse(lastRoute);
        localStorage.removeItem('lastRoute');
        if (lastRoute.name !== 'Login') {
          this.$router.replace(lastRoute);
          return null;
        }
      }
      this.$router.replace({name:'Index'})
    },
    login () {
      this.setLastRoute();
      if (this.validPath.includes(this.$route.path))
        return null
      this.$router.replace({name: 'Login'});
    }
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}
</style>
