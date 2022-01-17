import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/Login";
import NProgress from 'nprogress'
import '../theme/nprogress/nprogress.css'
import Index from "../views/Index";

Vue.use(VueRouter)
NProgress.inc(0.2);
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false });

const initRoutes = (routes) => {
  const _tree = []
  const tree = []
  const items = []
  routes.forEach(v => {
    if (!_tree[v.name]) {
      const temp = v
      temp.children = []
      _tree[v.name] = temp
      items.push(temp)
    }
  })

  items.forEach(v => {
    // eslint-disable-next-line no-mixed-operators
    _tree[v.parent] && _tree[v.parent].children.push(_tree[v.name]) || tree.push(_tree[v.name])
  })
  return tree
};

const routes = [];
routes.push({ path: '/login', name: 'Login',component: Login});
routes.push({ path: '/index', name: 'Index', component: Index});

const router = new VueRouter({
  routes:initRoutes(routes),
  base: process.env.BASE_URL
})
router.beforeEach((to, from, next) => {
  NProgress.start();
  to.meta.keepAlive = !(to.meta && to.meta.skipCache);
  next()
});

router.afterEach(() => {
  NProgress.done()
});
export default router
