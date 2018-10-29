<template>
  <div>
    <header class="app-header navbar">
      <!-- 로고 -->
      <b-link class="logo" to="/">
        <img src="/src/assets/images/logo.png" alt="">
        <img src="/src/assets/images/logo02.png" alt="">
      </b-link>

      <!-- 마이페이지, 로그아웃 -->
      <div class="util" v-if="isLoginOK && isGroupOK">
        <ul>
          <li v-on:click="commonRouterLink('/mypage')" class="setting">{{$t("Menu.myPage")}}</li>
          <li v-on:click="commonRouterLink('/logout')" class="logout">{{$t("Menu.logout")}}</li>
        </ul>
      </div>      

      <div class="info" v-if="isLoginOK && isGroupOK">
        <p class="pic"><img src="/src/assets/images/temp/01.jpg" alt=""></p>
        <ul>
          <li class="">{{getUserName}} {{this.getBelongToName}}</li>
          <li>{{this.commonGetGroupName()}}</li>
        </ul>
      </div>

      <b-navbar-nav v-if="isLoginOK && !isGroupOK">
        <span style="color: #ff3a38; font-weight: bold; font-size: 11pt;"><i class="fa fa-warning "></i>&nbsp;&nbsp;{{$t("InfoText.no_group_info_confirm_id")}}</span>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <b-link v-on:click="commonRouterLink('/logout')" style="color: grey;"><i class="fa fa-sign-out"></i> {{$t("Menu.logout")}}</b-link>
      </b-navbar-nav>
      <b-navbar-nav v-if="isLoginOK && isGroupOK" class="headerMenu">
        <!-- 대시보드(교사인 경우에만 링크를 걸어줌) -->
        <b-nav-item v-if="commonIsLoginAuthGroupOK([5])" class="px-3" v-on:click="commonRouterLink('/dashboard')">{{$t("Menu.dashboard")}}</b-nav-item>
        <!-- 지사/학원/반관리 -->
        <b-nav-item-dropdown v-if="commonIsLoginAuthGroupOK([1,2,3,4])" class="px-3 headerMenuDetail" left no-caret>
          <template slot="button-content"><span class="nav-link" :class="getActiveClassMain('menu1', 'sub0')">{{$t("Menu.header_academy_management")}}</span></template>
          <b-dropdown-item v-if="commonIsLoginAuthGroupOK([1,2])" v-on:click="commonRouterLink('/admin/branchList')" :class="getActiveClassMain('menu1', 'branch')"><i class="fa fa-sitemap"></i> {{$t("Menu.branch_management")}}</b-dropdown-item>
          <b-dropdown-item v-if="commonIsLoginAuthGroupOK([1,2,3])" v-on:click="commonRouterLink('/admin/academyList')" :class="getActiveClassMain('menu1', 'academy')"><i class="fa fa-graduation-cap"></i> {{$t("Menu.academy_management")}}</b-dropdown-item>
          <b-dropdown-item v-if="commonIsLoginAuthGroupOK([1,2,3,4])" v-on:click="commonRouterLink('/admin/academyClassList')" :class="getActiveClassMain('menu1', 'academyClass')"><i class="fa fa-columns"></i> {{$t("Menu.class_management")}}</b-dropdown-item>
        </b-nav-item-dropdown>
        <!-- 사용자 관리 -->
        <b-nav-item-dropdown v-if="commonIsLoginAuthGroupOK([1,2,3,4,5])" class="px-3 headerMenuDetail" left no-caret>
          <template slot="button-content"><span class="nav-link" :class="getActiveClassMain('menu2', 'sub0')">{{$t("Menu.user_management")}}</span></template>
          <b-dropdown-item v-if="commonIsLoginAuthGroupOK([1,2])" v-on:click="commonRouterLink('/admin/mainAdminList')" :class="getActiveClassMain('menu2', 'mainAdmin')"><i class="fa fa-user-plus"></i> {{$t("Menu.main_admin")}}</b-dropdown-item>
          <b-dropdown-item v-if="commonIsLoginAuthGroupOK([1,2])" v-on:click="commonRouterLink('/admin/branchAdminList')" :class="getActiveClassMain('menu2', 'branchAdmin')"><i class="fa fa-user-plus"></i> {{$t("Menu.branch_admin")}}</b-dropdown-item>
          <b-dropdown-item v-if="commonIsLoginAuthGroupOK([1,2,3])" v-on:click="commonRouterLink('/admin/academyAdminList')" :class="getActiveClassMain('menu2', 'academyAdmin')"><i class="fa fa-user-plus"></i> {{$t("Menu.academy_admin")}}</b-dropdown-item>
          <b-dropdown-item v-if="commonIsLoginAuthGroupOK([1,2,4])" v-on:click="commonRouterLink('/admin/teacherList')" :class="getActiveClassMain('menu2', 'teacher')"><i class="fa fa-id-badge"></i> {{$t("Menu.teacher_management")}}</b-dropdown-item>
          <b-dropdown-item v-if="commonIsLoginAuthGroupOK([1,2,4,5])" v-on:click="commonRouterLink('/admin/studentList')" :class="getActiveClassMain('menu2', 'student')"><i class="fa fa-address-card-o"></i> {{$t("Menu.student_management")}}</b-dropdown-item>
        </b-nav-item-dropdown>
        <!-- 수업관리 -->
        <b-nav-item-dropdown v-if="commonIsLoginAuthGroupOK([1,2,4,5])" class="px-3 headerMenuDetail" left no-caret>
          <template slot="button-content">
            <span class="nav-link" :class="getActiveClassMain('menu3', 'sub0')">{{$t("Menu.lesson_management")}}</span>
            <b-badge v-if="getDataCountMenu3Sum > 0" pill variant="danger" style="left: 80%">{{getDataCountMenu3Sum}}</b-badge>
          </template>
          <b-dropdown-item v-if="commonIsLoginAuthGroupOK([1,2,4,5])" v-on:click="commonRouterLink('/admin/subjectList')" :class="getActiveClassMain('menu3', 'subject')"><i class="fa fa-book"></i> {{$t("Menu.subject_management")}}</b-dropdown-item>
          <b-dropdown-item v-if="commonIsLoginAuthGroupOK([1,2,4,5])" v-on:click="commonRouterLink('/admin/subjectSignUpList')" :class="getActiveClassMain('menu3', 'signup')">
            <i class="fa fa-list-alt"></i> {{$t("Menu.course_apply_management")}}
            <b-badge v-if="data_count.subject_signup > 0" pill variant="danger" style="position: static !important;">{{data_count.subject_signup}}</b-badge>
          </b-dropdown-item>
          <b-dropdown-item v-if="commonIsLoginAuthGroupOK([1,2,4,5])" v-on:click="commonRouterLink('/admin/studyDataList')" :class="getActiveClassMain('menu3', 'study')">
            <i class="fa fa-code"></i> {{$t("Menu.submit_code_eval")}}
            <b-badge v-if="data_count.evaldata > 0" pill variant="danger" style="position: static !important;">{{data_count.evaldata}}</b-badge>
          </b-dropdown-item>
          <b-dropdown-item v-if="commonIsLoginAuthGroupOK([1,2,4,5])" v-on:click="commonRouterLink('/admin/lessonQnaList')" :class="getActiveClassMain('menu3', 'lesson')">
            <i class="fa fa-question-circle-o"></i> {{$t("Menu.qna_management")}}
            <b-badge v-if="data_count.lesson_qna > 0" pill variant="danger" style="position: static !important;">{{data_count.lesson_qna}}</b-badge>
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <!-- 기타관리 -->
        <b-nav-item-dropdown v-if="commonIsLoginAuthGroupOK([1,2,3,4])" class="px-3 headerMenuDetail" left no-caret>
          <template slot="button-content"><span class="nav-link" :class="getActiveClassMain('menu4', 'sub0')">{{$t("Menu.operation_management")}}</span></template>
          <b-dropdown-item v-if="commonIsLoginAuthGroupOK([1,2,3,4])" v-on:click="commonRouterLink('/admin/mainNoticeBoardList')" :class="getActiveClassMain('menu4', 'notice')"><i class="fa fa-book"></i> {{$t("Menu.main_admin_notice")}}</b-dropdown-item>
          <b-dropdown-item v-if="commonIsLoginAuthGroupOK([1,2,3,4])" v-on:click="commonRouterLink('/admin/academyNoticeBoardList')" :class="getActiveClassMain('menu4', 'academyNotice')"><i class="fa fa-book"></i> {{$t("Menu.academy_admin_notice")}}</b-dropdown-item>
          <b-dropdown-item v-if="commonIsLoginAuthGroupOK([1,2])" v-on:click="commonRouterLink('/admin/agreementReg')" :class="getActiveClassMain('menu4', 'agreement')"><i class="fa fa-file-text-o"></i> {{$t("Menu.reg_TOS")}}</b-dropdown-item>
        </b-nav-item-dropdown>
        <!-- 공통코드관리 -->
        <b-nav-item v-if="commonIsLoginAuthGroupOK([1])" class="px-3 headerMenuDetail" v-on:click="commonRouterLink('/admin/commonCodeMgmtList')">
          <span class="nav-link" :class="getActiveClassMain('menu5', 'commoncodemgmt')">{{$t("Menu.common_code_management")}}</span>
        </b-nav-item>
        <!-- 교사/학생 메뉴 -->
        <b-nav-item v-if="commonIsLoginAuthGroupOK([5, 6])" class="item01" v-on:click="commonRouterLink('/front/mySubjectInfo')">
          <span class="nav-link" :class="getActiveClassMain('front1', 'mysubject')">{{$t("Menu.my_course_info")}}</span>
        </b-nav-item>
        <!-- 학생 메뉴 -->
        <b-nav-item v-if="commonIsLoginAuthGroupOK([6])" class="item02" v-on:click="commonRouterLink('/front/myStudyDataEvalList')">
          <span class="nav-link" :class="getActiveClassMain('front2', 'mystudy')">{{$t("Menu.my_course_eval")}}</span>
          <b-badge v-if="getDataCountEvalData > 0" pill variant="danger" style="left: 85%">{{getDataCountEvalData}}</b-badge>
        </b-nav-item>
        <b-nav-item v-if="commonIsLoginAuthGroupOK([6])" class="item03" v-on:click="commonRouterLink('/front/myLessonQnaList')">
          <span class="nav-link" :class="getActiveClassMain('front3', 'myqna')">{{$t("Menu.my_qna_list")}}</span>
          <b-badge v-if="getDataCountMyLessonQna > 0" pill variant="danger" style="left: 85%">{{getDataCountMyLessonQna}}</b-badge>
        </b-nav-item>
        <!-- 교사/학생 메뉴 -->
        <b-nav-item v-if="commonIsLoginAuthGroupOK([5, 6])" class="item04" v-on:click="commonRouterLink('/front/noticeBoardList')">
          <span class="nav-link" :class="getActiveClassMain('front4', 'notice')">{{$t("Menu.notice")}}</span>
          <b-badge v-if="getDataCountNotice > 0" pill variant="danger">N</b-badge>
        </b-nav-item>

        <!-- 검색 -->
        <!--
        <b-container class="nav-search">
          <b-input-group>
            <b-form-input id="searchInput" name="search" v-model="param.searchWord" v-on:keyup.enter.native="getSearch" :placeholder="$t('SearchText.subject')"></b-form-input>
            <b-input-group-append>
              <b-btn text="Button" variant="outline-primary" v-on:click="getSearch">검색</b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-container>
        -->
        
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto headerRight">
        <!-- 학생인 경우 수강기간 만료시 안내 메세지 -->
        <b-nav-item v-if="this.commonGetStoreUser('group_id')===6 && this.commonIsUserDayOK()===false" class="px-3 headerMenu" right>
          <b-alert show variant="light" class="headerAlertType1">
            <i class="fa fa-warning "></i>&nbsp;&nbsp;{{$t("Menu.expire_course_date")}}
          </b-alert>
        </b-nav-item>

        <b-nav-item v-if="!isLoginOK" class="px-3 headerMenu" right v-on:click="commonRouterLink('/login')">
          <i class="fa fa-sign-in"></i>&nbsp;&nbsp;{{$t("Menu.login")}}
        </b-nav-item>
      </b-navbar-nav>

      <div class="lang-type">
        <div class="inner">
          <c-switch type="text" v-bind:class="{ active: langType.isActive }" />
        </div>
      </div>

    </header>
  </div>
</template>
<script>
import commonMixin from '@/components/mixin/commonMixin'
import cSwitch from '../AsideSwitch'
export default {
  mixins: [commonMixin],
  components: {
    cSwitch
  },
  data () {
    return {
      data_count: {
        subject_signup: 0,
        evaldata: 0,
        lesson_qna: 0,
        notice: 0
      },
      langType: {
        isActive: false
      }
    }
  },
  methods: {
    sidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-hidden')
    },
    sidebarMinimize (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-minimized')
    },
    mobileSidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-mobile-show')
    },
    asideToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('aside-menu-hidden')
    },
    getActiveClassMain (menu, sub) {
      // 이동할 페이지에 따른 메뉴 active 표시
      let activeClass = null
      // 현재 route의 name(name rule: menu0_sub0_list)
      let routeName = null
      let nameList = []
      try {
        routeName = this.$route.name
        nameList = routeName.split('_')
      } catch (e) {
        routeName = null
        nameList = []
      }
      // active 설정
      if (sub === 'sub0') {
        // 메인메뉴 active
        for (let i = 0; i < nameList.length; i++) {
          if (nameList[i] === menu) {
            activeClass = 'active'
            break
          }
        }
      } else {
        // 서브메뉴 active
        let isMainOK = false
        let isSubOK = false
        for (let i = 0; i < nameList.length; i++) {
          if (nameList[i] === menu) {
            isMainOK = true
          }
          if (nameList[i] === sub) {
            isSubOK = true
          }
        }
        if (isMainOK && isSubOK) {
          activeClass = 'active'
        }
      }
      return activeClass
    },
    dataCountSubjectSignup () {
      // 수강신청 갯수
      // 학원 검색
      let searchAcademy = '&academy=' + this.commonGetStoreUser('academy_id')
      // 반 검색
      let searchAcademyClass = '&academy_class=' + this.commonGetStoreUser('academy_class_id')
      const baseURI = this.$store.state.baseUrl + '/course/subjectSignUpList/?status=01' + searchAcademy + searchAcademyClass
      this.axios.get(baseURI)
      .then((response) => {
        this.data_count.subject_signup = response.data.count
      })
      .catch(e => {
        this.data_count.subject_signup = 0
      })
    },
    dataCountEvalData () {
      // 제출코드 평가정보 갯수
      // 진행 상태 검색
      let searchStatus = '&status=01'
      // 조회할 학원 세팅
      let searchAcademy = '&academy=' + this.commonGetStoreUser('academy_id')
      // 조회할 클래스 세팅
      let searchClassList = '&class_list=' + this.commonGetStoreUser('academy_class_id')
      // 학생인 경우 검색 세팅
      let searchUser = ''
      let searchIsRead = ''
      if (this.commonIsLoginAuthGroupOK([6])) {
        // list_type=simple&user=3&is_read=false&status=02
        searchClassList = ''
        searchStatus = '&status=02'
        searchUser = '&user=' + this.commonGetStoreUser('id')
        searchIsRead = '&is_read=false'
      }
      const baseURI = this.$store.state.baseUrl + '/course/evalDataList/?list_type=simple' + searchStatus + searchAcademy + searchClassList + searchUser + searchIsRead
      this.axios.get(baseURI)
      .then((response) => {
        this.data_count.evaldata = response.data.count
      })
      .catch(e => {
        this.data_count.evaldata = 0
      })
    },
    dataCountLessonQna () {
      // 질문답변 리스트
      let searchAcademy = ''
      let searchAcademyClass = ''
      let searchIsAnswer = ''
      let searchUser = ''
      let searchIsRead = ''
      if (this.commonIsLoginAuthGroupOK([4, 5])) {
        // 학원관리자, 교사인 경우
        // 학원 검색
        searchAcademy = '&academy=' + this.commonGetStoreUser('academy_id')
        // 반 검색
        searchAcademyClass = '&academy_class=' + this.commonGetStoreUser('academy_class_id')
        // 답변여부 검색
        searchIsAnswer = '&is_answer=false'
      } else if (this.commonIsLoginAuthGroupOK([6])) {
        //  list_type=simple&user=3&is_answer=true&is_read=false
        // 사용자 검색
        searchUser = '&user=' + this.commonGetStoreUser('id')
        // 답변여부 검색
        searchIsAnswer = '&is_answer=true'
        // 읽었는지 여부 검색
        searchIsRead = '&is_read=false'
      }
      const baseURI = this.$store.state.baseUrl + '/course/lessonQnaList/?list_type=simple' + searchAcademy + searchAcademyClass + searchIsAnswer + searchUser + searchIsRead
      this.axios.get(baseURI)
      .then((response) => {
        this.data_count.lesson_qna = response.data.count
      })
      .catch(e => {
        this.data_count.lesson_qna = 0
      })
    },
    dataCountNoticeList () {
      // 공지사항 전체 리스트 조회(본사 + 학원)(최근꺼만)
      // 소속학원
      let searchAcademy = '&academy=' + this.commonGetStoreUser('academy_id')
      const baseURI = this.$store.state.baseUrl + '/control/noticeList/?is_active=true&boardType=all' + searchAcademy + '&new_day=7'
      this.axios.get(baseURI)
      .then((response) => {
        let responseData = response.data
        this.data_count.notice = responseData.count
      })
      .catch(e => {
        this.data_count.notice = 0
      })
    },
    changeLanguage () {
      // local storage에 language 값 저장
      // this.$store.dispatch('changeLanguage', lang)
      // 언어 변경
      // window.location.reload()
    }
  },
  computed: {
    isLoginOK () {
      // 로그인 여부
      if (this.commonGetStoreUser('jwt')) {
        return true
      } else {
        return false
      }
    },
    isGroupOK () {
      // 그룹에 속해있는지 확인
      if (this.commonGetStoreUser('group_id')) {
        return true
      } else {
        return false
      }
    },
    getUserName () {
      // 사용자의 이름
      if (this.commonGetStoreUser('fullname')) {
        return this.commonGetStoreUser('fullname')
      } else {
        return this.$t('InfoText.no_name')
      }
    },
    getBelongToName () {
      // 아이디가 소속된 지사 or 학원 이름
      // 본사 관리자 - 소속명 필요없음
      if (this.commonIsLoginAuthGroupOK([1, 2])) {
        return ''
      }
      // 지사 관리자 - 해당 지사 이름 리턴
      if (this.commonIsLoginAuthGroupOK([3])) {
        return this.getBranchName
      }
      // 학원 관리자, 교사, 학생 - 해당 학원 이름 리턴
      if (this.commonIsLoginAuthGroupOK([4, 5, 6])) {
        return this.getAcademyName
      }
    },
    getBranchName () {
      // 소속 지사 이름
      let branchName = this.commonGetBranchName()
      if (!this.commonIsValueNull(branchName)) {
        return '(' + branchName + ')'
      } else {
        return ''
      }
    },
    getAcademyName () {
      // 소속 학원 이름
      let academyName = this.commonGetAcademyName()
      if (!this.commonIsValueNull(academyName)) {
        return '(' + academyName + ')'
      } else {
        return ''
      }
    },
    getDataCountMenu3Sum () {
      // (교사)데이터 갯수 합계
      let sum = 0
      if (this.commonIsLoginAuthGroupOK([4, 5])) {
        // 1-1. 수강신청 카운트
        this.dataCountSubjectSignup()
        sum += this.data_count.subject_signup
        // 1-2. 제출코드 평가 카운트
        this.dataCountEvalData()
        sum += this.data_count.evaldata
        // 1-3. 질문답변 카운트
        this.dataCountLessonQna()
        sum += this.data_count.lesson_qna
      }
      return sum
    },
    getDataCountEvalData () {
      // (학생)나의 코드 평가 갯수 카운트
      if (this.commonIsLoginAuthGroupOK([6])) {
        this.dataCountEvalData()
      }
      return this.data_count.evaldata
    },
    getDataCountNotice () {
      // (교사/학생)최근 공지사항 갯수 카운트
      if (this.commonIsLoginAuthGroupOK([5, 6])) {
        this.dataCountNoticeList()
      }
      return this.data_count.notice
    },
    getDataCountMyLessonQna () {
      // (학생)나의 질문내역
      if (this.commonIsLoginAuthGroupOK([6])) {
        this.dataCountLessonQna()
      }
      return this.data_count.lesson_qna
    }
  },
  created () {
  }
}
</script>
<style>
</style>