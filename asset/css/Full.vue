<template>
  <div class="app htmlHeight admin" v-if="commonIsLoginAuthGroupOK([1,2,3,4])">
    <AppHeader/>
    <div class="app-body">
      <router-view></router-view>
    </div>
    <AppFooter/>
  </div>
  
   <div class="app htmlHeight" v-else>
    <AppHeader/>
    <div class="app-body">
      <router-view></router-view>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import commonMixin from '@/components/mixin/commonMixin'
import AppHeader from '@/components/Header/Header'
// import Breadcrumb from '@/components/Breadcrumb'
// import Sidebar from '@/components/Sidebar/Sidebar'
// import SidebarNav from '@/components/Sidebar/_nav'
// import AppAside from '@/components/Aside'
import AppFooter from '@/components/Footer'

export default {
  mixins: [commonMixin],
  components: {
    AppHeader,
    // Breadcrumb,
    // Sidebar,
    // AppAside,
    AppFooter
  },
  data () {
    return {
      // Sidebar를 사용하기 위한 좌측메뉴 아이템 목록
      // sidebar_nav: SidebarNav.items
    }
  },
  computed: {
    // name () {
    //   // 이건 어디에 쓰는건지 모르겠네
    //   return this.$route.name
    // },
    // list () {
    //   // breadcrumb를 사용하기 위한 $route.matched 추출
    //   return this.$route.matched
    // }
  },
  created () {

  },
  beforeCreate () {

  }
}
</script>

<style scoped>

</style>
