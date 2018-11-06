<template>
  <div class="lesson animated fadeIn" @contextmenu.prevent="ctxStop">
    <!-- 타이틀 -->
      <h2>{{this.formData.title}}</h2>
    <!-- 상세정보 폼 -->
    <div v-show="dataShow">

        <multipane class="custom-resizer" layout="vertical">
          <div id="pane_left" class="pane" :style="{ minWidth: this.paneProp.left.minWidth, width: this.paneProp.left.width, maxWidth: this.paneProp.left.maxWidth }">
            <div class="row" align="left" style="margin-bottom: 10px; minwidth: 100px;">
              <div class="col-md-10">
                <b-button-group>
                  <b-button variant="light" size="sm" style="border: 1px solid #ccc" :style="{ width: getBtnResize }" @click="getPreviousPage()" v-bind:class="{'disabled' : this.isFirst}" v-b-popover.hover.top="$t('Tooltip.previous')"><i class="fa fa-chevron-left"></i></b-button>
                  <b-button variant="light" size="sm" style="border: 1px solid #ccc" :style="{ width: getBtnResize }" @click="getNextPage()" v-bind:class="{'disabled' : this.isLast}" v-b-popover.hover.top="$t('Tooltip.next')"><i class="fa fa-chevron-right"></i></b-button>
                </b-button-group>
              </div>
              <div class="col-md-2">
                <!-- 내용 상세보기 팝업 (실습 or 문제인 경우) -->
                <span class="pull-right" style="margin-right: 20px;">
                  <b-button v-if="showBtnPageContentPopup()" v-on:click="openPageContent(pageContentMini.id)" class="text-right" size="sm" variant="warning" v-b-popover.hover.top="$t('Tooltip.lesson_contents_detail_view')"><i class="fa fa-external-link" style="font-size: 12pt; line-height: 0.75em; vertical-align: -15%;"></i></b-button>
                </span>
              </div>
            </div>
            <!-- 실습 컨텐츠 자리 -->
            <div>
              <b-collapse v-model="show_page_content_mini" id="vle_content">
                <div style="width: 95%; min-width: 80%; height: 300px; overflow: auto; margin-bottom: 10px;">
                  <div>
                    <!-- 동영상 -->
                    <span v-if="pageContentMini.type==='video'">
                      <iframe frameborder="0" height="292" width="100%" scrolling="no" :src="pageContentMini.src" allowfullscreen></iframe>
                    </span>
                    <!-- 이미지 -->
                    <span v-if="pageContentMini.type==='image'">
                      <img v-on:click="openPageContent(pageContentMini.id)" width="100%" :src="pageContentMini.src" style="cursor: pointer;">
                    </span>
                    <!-- 텍스트 -->
                    <span v-if="pageContentMini.type==='text'" v-html="pageContentMini.src">
                    </span>
                  </div>
                </div>
              </b-collapse>
            </div>
            <!-- 수업 리스트 -->
            <div class="subjectDetailBoxShadow" style="width: 95%; min-width: 80%;">
              <div style="overflow-y: auto; overflow-x: hidden; height:760px; max-height:760px;">
                <b-list-group flush button class="btn-sm" v-for="(chapter, chapterIdx) in formData.chapters" :key="chapter.id" style="padding: 0px; border-bottom: 1px solid #b9b9b9; ">
                  <div no-body class="lessonBoxTitle" align="left" style="border-bottom: 1px solid #b9b9b9;">
                    <i class="fa fa-book" aria-hidden="true"></i>&nbsp;&nbsp;{{chapter.title}}&nbsp;&nbsp;
                    <span v-show='chapter.lessons.length == 0' class="pull-right"></span>
                    <span class="pull-right">
                      <b-button v-b-toggle="'collapseDetail_'+chapterIdx" variant="light" class="lessonBtnType6" style="margin-right: 10px;" size="sm">
                        <span class="when-opened"><i class="fa fa-chevron-up"></i></span><span class="when-closed"><i class="fa fa-chevron-down"></i></span>
                      </b-button>
                    </span>
                  </div>
                  <div>
                    <b-collapse visible :id="'collapseDetail_'+chapterIdx">
                      <b-list-group-item
                        name="chapterGroupItem"
                        v-bind:id="'lesson-'+lesson.id"
                        v-bind:lessonId="lesson.id"
                        v-bind:idx="lessIdx"
                        v-bind:class="{'active' : isSelected('lesson'+lesson.id)}"
                        button class="btn-sm mainCardScale lessonBoxSubTitle"
                        v-for="(lesson,lessIdx) in chapter.lessons"
                        :key="lesson.id"
                        @click="getLessonPage(formData.id,lesson)">
                          <div class="subjectDetailType2" align="left">
                            <i class="fa fa-file-code-o" v-if="lesson.lesson_type== '02'" aria-hidden="true">&nbsp;</i>
                            <i class="fa fa-question" v-else-if="lesson.lesson_type== '03'" aria-hidden="true">&nbsp;</i>
                            <i class="fa fa-wrench" v-else  aria-hidden="true">&nbsp;</i>
                            <span>{{ lesson.title }}</span>
                            <span class="pull-right">
                              <i class="fa fa-check" v-if="checkFinish(lesson.id)" aria-hidden="true">&nbsp;{{$t("InfoText.complete")}}</i>
                            </span>
                          </div>
                      </b-list-group-item>
                    </b-collapse>
                  </div>
                </b-list-group>
              </div>
            </div>
            <!-- 데이터 수신중/실패 메세지 -->
            <div>
              <!--<loading-message :dataState="getDataState" :dataCount="dataCount"></loading-message>-->
            </div>
          </div>
          <!--resizer를 넣으면 iframe에 넣은 스크래치때문에 크기 줄일때 작동 안함-->
          <!--<multipane-resizer></multipane-resizer>-->
          <div id="pane_body" class="pane" :style="{ flexGrow: 1 }" style="width: 100%">
            <div>
              <b-button v-if="this.paneProp.resizeState !== 2" v-on:click="paneResize(2)" size="sm" variant="info"><i class="fa fa-step-backward"></i>&nbsp;{{$t("Button.screen_expansion")}}</b-button>
              <!-- <b-button v-if="this.paneProp.resizeState === 0" v-on:click="paneResize(1)" size="sm" style="width: 70px" variant="outline-secondary"><i class="fa fa-angle-double-left"></i> 80%</b-button> -->
              <b-button-group v-if="this.paneProp.resizeState !== 0" size="sm" style="margin-top: 1px">
                <b-button variant="light" style="border: 1px solid #ccc" :style="{ width: getBtnResize }" @click="getPreviousPage()" v-bind:class="{'disabled' : this.isFirst}" v-b-popover.hover.top="$t('Tooltip.previous')"><i class="fa fa-chevron-left"></i></b-button>
                <b-button variant="light" style="border: 1px solid #ccc" :style="{ width: getBtnResize }" @click="getNextPage()" v-bind:class="{'disabled' : this.isLast}" v-b-popover.hover.top="$t('Tooltip.next')"><i class="fa fa-chevron-right"></i></b-button>
              </b-button-group>
              <b-button v-if="this.paneProp.resizeState !== 0" v-on:click="paneResize(0)" size="sm" style="width: 100px; font-size: 10pt;" variant="info"><i class="fa fa-step-forward"></i>&nbsp;{{$t("Button.Screen_recovery")}}</b-button>
              <!-- VLE 관련 메뉴 -->
              <coding-menu v-if="!commonIsValueNull(this.pageContent)" :mode="this.vle_mode" :lessonType="this.lessonType" targetId="ifrmVLE" :category="this.selectedInfo.lessonInfo.category" :subjectId="this.getSubjectIdString" :lessonId="this.getSelectedLessonIdString" v-on:submit_success="this.getLessonHistory" :userId="this.getUserIdString"></coding-menu>
              <!-- 질문하기 버튼 - 학생만 질문 가능 -->
              <div v-if="commonIsLoginAuthGroupOK([6])" class="pull-right">
                <b-button v-on:click="popLessonQnA()" size="sm" variant="light" v-b-popover.hover.top="$t('Tooltip.ask_a_question')">
                  {{$t("Button.qna")}} <b-badge v-if="lessonQna.badgeCnt > 0" pill variant="danger">{{lessonQna.badgeCnt}}</b-badge>
                </b-button>
              </div>
            </div>
            <!-- 수업 내용 없는 경우 -->
            <div v-if="!this.isPageContentOK" style="margin-top: 13px;">
              <nodata-message :message="$t('AlertMsg.lesson_no_data')"/>
            </div>
            <!-- 수업 내용 -->
            <div v-if="this.isPageContentOK" style="margin-top: 13px;">
              <!-- 수업내용 -->
              <!-- 1) 이론인 경우 -->
              <div v-if="this.selectedInfo.lessonInfo.lesson_type === '02'">
                <!-- 이론인 경우 카테고리와 상관없이 동일함 -->
                <p style="padding: 10px; overflow-y: scroll; width: 100%; margin-top: 10px; height:900px; border: 1px solid #a4b7c1;"><span v-html="this.pageContent"></span></p>
              </div>
              <!-- 2) 실습 or 문제인 경우 -->
              <div v-if="['01', '03'].includes(this.selectedInfo.lessonInfo.lesson_type)">
                <!-- 실습 or 문제인 경우 카테고리에 따라 VLE가 달라짐 -->
                <!-- 1-1) 아두이노 -->
                <span v-if="this.selectedInfo.lessonInfo.category === '01'">
                  <p style="padding: 10px; overflow-y: scroll; width: 100%; margin-top: 10px; height:900px; border: 1px solid #a4b7c1;"><span v-html="this.pageContent"></span></p>
                </span>
                <!-- 1-2) 엔트리 -->
                <span v-if="this.selectedInfo.lessonInfo.category === '02'">
                  <iframe id="ifrmVLE" class="vle_loader" style="height: 760px; width: 100%; margin: 0px 0 10px; border: 1px solid #a4b7c1;" allowTransparency="true" :src="this.vle_url" frameborder="0"></iframe>
                </span>
                <!-- 1-3) 스크래치 -->
                <span v-if="this.selectedInfo.lessonInfo.category === '03'">
                  <iframe id="ifrmVLE" class="vle_loader" style="height: 760px; width: 100%; margin: 0px 0 10px; border: 1px solid #a4b7c1;" allowTransparency="true" :src="this.vle_url" frameborder="0" allow="microphone; camera"></iframe>
                </span>
                <!-- 1-4) 파이썬 -->
                <span v-if="this.selectedInfo.lessonInfo.category === '04'">
                  <iframe id="ifrmVLE" class="vle_loader" style="height: 760px; width: 100%; margin: 0px 0 10px; border: 1px solid #a4b7c1;" allowTransparency="true" :src="this.vle_url" frameborder="0" allow="microphone; camera"></iframe>
                </span>
                <!-- 1-5) 언플러그드 -->
                <span v-if="this.selectedInfo.lessonInfo.category === '05'">
                  <p style="padding: 10px; overflow-y: scroll; width: 100%; margin-top: 10px; height:900px; border: 1px solid #a4b7c1;"><span v-html="this.pageContent"></span></p>
                </span>
              </div>
            </div>
          </div>
        </multipane>

    </div>
    <!-- 데이터 없을 때 메세지 -->
    <div v-show="!dataShow">
      <nodata-message/>
    </div>
  </div>
</template>

<script>
import commonMixin from '@/components/mixin/commonMixin'
import noDataMessage from '@/components/NoDataMessage'
import codingMenu from '@/components/CodingMenu'
import { Multipane, MultipaneResizer } from 'vue-multipane'

export default{
  mixins: [commonMixin],
  components: {
    'nodata-message': noDataMessage,
    'coding-menu': codingMenu,
    Multipane,
    MultipaneResizer
  },
  data () {
    return {
      dataShow: true,
      formData: {},
      selected: '',
      isPageContentOK: true,
      pageContent: '',
      pageContentMini: {
        id: null,
        type: null,
        src: null
      },
      pageInfo: {},
      // 실습(01),이론(02)
      lessonType: '',
      lessonList: [],
      // 이전 다음 버튼 활성화 비활성화를 위한 변수
      isFirst: false,
      isLast: false,
      // 이전 다음 lessonId
      nextLesson: '',
      previousLesson: '',
      selectedLessonId: '',
      paneProp: {
        resizeState: 0,   // 0: resize안함, 1: 80% 리사이징, 2: 100%리사이징
        left: {
          orgMinWidth: '170px',
          minWidth: '0px',
          width: '30%',
          oriWidth: '30%',
          maxWidth: '30%'
        }
      },
      aduinoSample: false,
      selectedInfo: {
        lessonInfo: {}
      },
      vle_url: 'about:blank',
      vle_mode: 'study',
      show_page_content_mini: false,
      lessonQna: {
        list: [],
        badgeCnt: 0
      },
      lesson_history: {
        dataShow: true,
        count: 0,
        list: []
      },
      userId: null,
      lessonSource: null,
      param: {
        view_mode: ''
      }
    }
  },
  created () {
    // 페이지 로딩 시 파라미터 세팅
    this.param.view_mode = this.commonSetDefault(this.$route.query.view_mode, this.param.view_mode)

    // 로그인 권한별 체크

    // 지사 관리자인 경우 튕겨냄
    if (!this.commonIsLoginAuthGroupOK([1, 2, 4, 5, 6])) {
      this.commonNoPermission()
      return
    }

    // 수강기간 체크(학생인 경우에만 체크함)
    if (this.commonIsLoginAuthGroupOK([6]) && !this.commonIsUserDayOK()) {
      // '수강기간이 만료되었습니다.'
      this.commonNotify('warning', this.$t('NotifyMsg.309'))
      this.commonRouterLink('/')
      return
    }

    // 수업 내용 조회
    this.getSubjectInfo()
  },
  methods: {
    getSubjectInfo: function () {
      // 교사/학생인 경우 수강신청이 된 과목만 조회하도록 user값 세팅
      let searchUserId = ''
      if (this.commonIsLoginAuthGroupOK([5, 6])) {
        searchUserId = '?userId=' + this.commonGetStoreUser('id')
      }

      const baseURI = this.$store.state.baseUrl + '/course/subjectInfo/' + this.$route.params.id + '/' + searchUserId
      this.axios.get(baseURI)
      .then((response) => {
        // 조회 권한 확인
        let responseData = response.data

        // 학생인 경우 수강신청이 된 과목만 조회 가능
        if (this.commonIsLoginAuthGroupOK([6])) {
          if (responseData.avaible_signup !== 'Y') {
            this.commonNoPermission()
            return
          }
        }

        // response데이터 입력
        this.formData = responseData

        // 첫 페이지 조회

        // 페이지 navigation용 lesson list 생성
        response.data.chapters.forEach(chapter => {
          chapter.lessons.forEach(lesson => {
            this.lessonList.push(lesson)
          })
        })

        // 강의 시작 버튼을 누를 경우 첫 레슨을 조회한다.
        // if (this.$route.query.lessonId === undefined || this.$route.query.lessonType === undefined) {
        if (this.commonIsValueNull(this.$route.query.lessonId)) {
          // 첫 레슨을 조회하여 화면에 노출한다
          this.getLessonPage(response.data.id, this.lessonList[0])
        } else {
          // 특정 강의 항목으로 이동시
          this.lessonList.forEach(lesson => {
            if ((lesson.id).toString() === this.$route.query.lessonId) {
              this.getLessonPage(this.$route.params.id, lesson)
              /*eslint-disable */
              return
            }
          })
        }

        // 수업 히스토리 조회
        this.getLessonHistory()
      })
      .catch(e => {
        this.dataShow = false
      })
    },
    getNextPage: function () {
      if (!this.isLast) this.getLessonPage(this.formData.id, this.nextLesson)
    },
    getPreviousPage: function () {
      if (!this.isFirst) this.getLessonPage(this.formData.id, this.previousLesson)
    },
    goPreviouLink: function () {
      this.commonRouterLink('/front/subjectInfo/' + this.$route.params.id)
    },
    openPageContent: function (pageId) {
      // 컨텐츠 내용 팝업으로 띄우기
      let popOption = 'width=300, height=300, left=200, top=130, scrollbars=yes, resizeable=yes'

      // 이론 내용 팝업(실습인 경우)
      let popOpen = window.open('/pop/pageContent/' + pageId, 'pageContent', popOption)
      if (popOpen != null) popOpen.focus()

      // 팝업에 focus가 생기지 않으면 다음을 수행
      setTimeout(() => {
        if (document.hasFocus()) {
          if (popOpen != null) popOpen.close()
          window.open('/pop/pageContent/' + pageId, 'pageContent', popOption)
        }
      }, 10)
    },
    getLessonPage: function (subjectId, lesson) {
      // 해당 수업이 열릴때마다 호출됨

      let lessonType = lesson.lesson_type
      let lessonId = lesson.id
      this.lessonType = lessonType
      this.selected = 'lesson' + lessonId
      this.selectedLessonId = lessonId
      this.selectedInfo.lessonInfo = lesson
      for (let i = 0; i < this.lessonList.length; i++) {
        // eslint-disable-next-line
        if (this.lessonList[i].id.toString() === lessonId.toString()) {
          this.isFirst = (i === 0)
          this.isLast = (i === this.lessonList.length - 1)
          if (!this.isFirst) this.previousLesson = this.lessonList[i - 1]
          if (!this.isLast) this.nextLesson = this.lessonList[i + 1]
          break
        }
      }

      // 페이지 컨텐츠 초기화
      this.isPageContentOK = true
      this.pageContent = ''
      this.pageContentMini.id = null
      this.pageContentMini.type = null
      this.pageContentMini.src = null
      this.vle_mode = 'study'
      this.vle_url = 'about:blank'

      if(this.source){
        this.lessonSource.cancel()
      }

      let userId = this.commonGetStoreUser('id')
      const baseURI = this.$store.state.baseUrl + '/course/pageList?pager=no&lessonId=' + lessonId + '&subjectId=' + subjectId + '&userId=' + userId
      const cancelToken = this.axios.CancelToken
      this.lessonSource = cancelToken.source()
      this.axios.get(baseURI, {cancelToken: this.lessonSource.token})
       .then((response) => {
         this.vle_url = 'about:blank'
         // 레슨을 생성하면 default로 한건의 페이지를 생성하기 때문에
         // 페이지가 존재하는 것으로 가정한다.
         this.pageInfo = response.data
         this.pageContent = response.data[0].content

         // 컨텐츠가 없으면 안내 메세지
         if (this.commonIsValueNull((this.pageContent))) {
           this.isPageContentOK = false
           this.showPageContentMini(false)
           return
         }

         // 실습 or 문제인 경우 컨텐츠 미니
         this.pageContentMini = { id: null, type: null, src: null }
         if (this.lessonType === '01' || this.lessonType === '03') {

           // 현재 엔트리와 스크래치만 vle가 오픈된다.
           if (['02', '03', '04'].includes(this.selectedInfo.lessonInfo.category)) {
             this.pageContentMini = this.commonGetPageContentMini(this.pageContent)
             this.pageContentMini.id = response.data[0].id

             // 동영상만 미니컨텐츠 오픈하고
             if (this.pageContentMini.type==='video') {
               this.showPageContentMini(true)
             // } else if (this.pageContentMini.type==='image') {
             //   // 이미지인 경우 미니컨텐츠 오픈
             //   this.showPageContentMini(true)
             } else {
               // 이미지 or 텍스트인 경우 팝업으로 띄운다.
               this.showPageContentMini(false)
               this.openPageContent(this.pageContentMini.id)
             }
           } else {
             this.showPageContentMini(false)
           }
         } else {
           this.showPageContentMini(false)
         }

         // 로그인 권한별 수업 히스토리 저장 여부 결정 (정신 똑바로 차리고 잘 보도록)
         let isInsertHistoryOK = false

         // 본사 관리자, 지사관리자, 학원 관리자인 경우 히스토리에 저장하지 않음
         if (this.commonIsLoginAuthGroupOK([1, 2, 3, 4])) {
           isInsertHistoryOK = false

           // 해당 학생의 vle를 오픈할때는 학생 user_id를 세팅한다.
           let vle_user = this.commonSetDefault(this.$route.query.user, this.commonGetStoreUser('id'))
           this.vle_mode = "view"
           this.vle_url = this.setVleUrl(this.selectedLessonId, vle_user, this.vle_mode)
         }

         // 교사인 경우
         if (this.commonIsLoginAuthGroupOK([5])) {
           // 교사의 경우 완료체크를 하지 않는다.
           isInsertHistoryOK = false

           // 해당 학생의 vle를 오픈할때는 학생 user_id를 세팅한다.
           let vle_user = this.commonSetDefault(this.$route.query.user, this.commonGetStoreUser('id'))
           this.vle_mode = "view"

           // 교사가 본인의 수업인 경우 완료체크를 한다.
           if (vle_user === this.commonGetStoreUser('id')) {
             isInsertHistoryOK = true
             this.vle_mode = "study"
           }
           this.vle_url = this.setVleUrl(this.selectedLessonId, vle_user, this.vle_mode)
         }

         // 학생인 경우 히스토리 저장함
         if (this.commonIsLoginAuthGroupOK([6])) {
           isInsertHistoryOK = true

           // 학생은 본인것만 조회 가능
           let vle_user = this.commonGetStoreUser('id')
           this.vle_mode = "study"
           this.vle_url = this.setVleUrl(this.selectedLessonId, vle_user, this.vle_mode)

           // 해당 수업에 대한 질문 정보 조회
           this.getLessonQnaInfo(vle_user, subjectId, lessonId)
         }

         // 미리보기 모드로 들어온 경우 히스토리 저장하지 않는다.
         if (this.param.view_mode === 'view') {
           isInsertHistoryOK = false
         }

         // 수업 히스토리 저장
         if (isInsertHistoryOK) {
           // 문제인 경우만 빼고 히스토리에 저장함
           if (this.selectedInfo.lessonInfo.lesson_type !== '03') {
             this.insertLessonHistory(subjectId, lessonId, userId)
           } else {
             // 교사인 경우에는 '문제'인 경우에도 히스토리에 저장함
             if (this.commonIsLoginAuthGroupOK([5])) {
               this.insertLessonHistory(subjectId, lessonId, userId)
             }
           }
         }

         // 스크롤 상단으로 이동
         window.scrollTo(0, 0)

       })
       .catch(e => {
         //this.errors.push(e)
         console.log(e)
       })
    },
    insertLessonHistory (subjectId,lessonId,userId) {
      const baseURI = this.$store.state.baseUrl + '/course/lessonHistoryCreate/?subjectId=' + subjectId + '&lessonId=' + lessonId + '&userId=' + userId
      this.axios.get(baseURI)
      .then((response) => {
        // 완료 로그를 저장한다. 성공시 별도의 response값 없음

        // 수업 히스토리 조회
        this.getLessonHistory()
      })
       .catch(e => {
         //this.errors.push(e)
         console.log(e)
       })
    },
    isSelected (id) {
      return id === this.selected
    },
    paneResize (resize) {
      this.paneProp.resizeState = resize
      // max, min의 개념은 left를 기준으로 한다.
      if (resize === 0) {
        this.paneProp.left.width = this.paneProp.left.oriWidth
      } else if (resize === 1) {
        this.paneProp.left.width = this.paneProp.left.orgMinWidth
      } else if (resize === 2) {
        this.paneProp.left.width = this.paneProp.left.minWidth
      }
    },
    popLessonQnA () {
      // 질문/답변 팝업
      let subject = this.formData.id
      let lesson = this.selectedInfo.lessonInfo.id
      window.open('/pop/myLessonQnaList/?subject=' + subject + '&lesson=' + lesson + '&is_pop=true', 'lessonQna', 'width=1000, height=600')
    },
    getLessonQnaInfo (userId, subjectId, lessonId) {
      // 해당 수업에 대한 질문 정보 조회

      // 정보 초기화
      this.lessonQna.list = []
      this.lessonQna.badgeCnt = 0

      // 질문자 조건 검색
      let searchUser = '&user=' + userId

      // 과목 조건 검색
      let searchSubject = '&subject=' + subjectId

      // 수업 조건 검색
      let searchLesson = '&lesson=' + lessonId

      const baseURI = this.$store.state.baseUrl + '/course/lessonQnaList/?list_type=simple&pager=no' + searchUser + searchSubject + searchLesson
      this.axios.get(baseURI)
      .then((response) => {
        this.lessonQna.list = response.data

        // 배지 만들기 카운트(답변을 아직 읽지 않은 경우)
        for (let i = 0; i < this.lessonQna.list.length; i++) {
          // 조건: is_answer=true, is_read=false
          if (this.lessonQna.list[i].is_answer && !this.lessonQna.list[i].is_read) {
            this.lessonQna.badgeCnt++
          }
        }

      })
      .catch(e => {
        console.log(e)
      })
    },
    showPageContentMini (isPageContentMini) {
      // 미니 컨텐츠 제어(show/hide)
      this.show_page_content_mini = isPageContentMini
    },
    showBtnPageContentPopup () {
      // 컨텐츠 팝업 버튼
      let isPopBtn = false

      // 엔트리 스크래치만 해당됨
      if (['02', '03', '04'].includes(this.selectedInfo.lessonInfo.category)) {
        // 실습 or 문제인 경우
        if (this.selectedInfo.lessonInfo.lesson_type==='01' || this.selectedInfo.lessonInfo.lesson_type==='03') {
          isPopBtn = true
        }
      }

      return isPopBtn
    },
    getLessonHistory () {
      // 수업히스토리(lessonHistory)정보 조회 - 학습진행율 및 '완료'여부 체크를 위해

      // 교사, 학생인 경우에만 완료표시
      if (this.commonIsLoginAuthGroupOK([5, 6])) {

        // 교사는 본인이 수강하는 수업인 경우에만 완료표시 한다.
        if (this.commonIsLoginAuthGroupOK([5])) {
          let vle_user = this.commonSetDefault(this.$route.query.user, this.commonGetStoreUser('id'))
          if (vle_user !== this.commonGetStoreUser('id')) {
            return
          }
        }

        const baseURI = this.$store.state.baseUrl + '/course/lessonHistoryList/?pager=no&subject=' + this.$route.params.id + '&user=' + this.commonGetStoreUser('id')
        this.axios.get(baseURI)
        .then((response) => {
          this.lesson_history.list = response.data
          this.lesson_history.count = response.data.length
        })
        .catch(e => {
          this.lesson_history.dataShow = false
        })
      }
    },
    checkFinish (lessonId) {
      // 해당 lesson을 (수업)완료했는지 여부
      let isFinish = false
      for (let i = 0; i < this.lesson_history.list.length; i++) {
        if (this.lesson_history.list[i].tb_lesson === lessonId) {
          isFinish = true
          break
        }
      }
      return isFinish
    },
    setVleUrl (lessonId, userId, mode) {
      // vle url setting
      return this.$store.state.baseUrl + '/base_vle/vle?tb_lesson_id=' + lessonId + '&tb_user_id=' + userId + '&mode=' + mode + '&user_enc=' + this.commonGetStoreUser('user_enc') + '&lang=' + this.$t('Lang.type').split('-')[0]
    }
  },
  computed: {
    getBtnResize () {
      // 목록 버튼들의 크기 조절
      if (this.paneProp.resizeState === 1) {
        return '40px'
      } else {
        return '70px'
      }
    },
    getAduinoSample () {
      return this.aduinoSample
    },
    getUserIdString () {
      let userId = this.commonGetStoreUser('id')
      if (!this.commonIsValueNull(userId)) {
        return userId.toString()
      } else {
        return ''
      }
    },
    getSubjectIdString () {
      // 과목 아이디를 String로 리턴
      let subjectId = this.$route.params.id
      if (!this.commonIsValueNull(subjectId)) {
        return subjectId.toString()
      } else {
        return ''
      }
    },
    getSelectedLessonIdString () {
      // 선택된 수업 아이디를 String로 리턴
      let lessonId = this.selectedInfo.lessonInfo.id
      if (!this.commonIsValueNull(lessonId)) {
        return lessonId.toString()
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
    width: 8px;
}
::-webkit-scrollbar-track {
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, .1);
}
::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 50, .3);
  border-radius: 10px;
  box-shadow:0 0 0 1px rgba(255, 255, 255, .3);
}
.custom-resizer {
  width: 100%;
  /*height: 900px;*/
  height: 100%;
}
.custom-resizer > .pane {
  text-align: left;
  /*padding: 15px;*/
  overflow: hidden;
  /*background: #eee;*/
  /*border: 1px solid #ccc;*/
}
.custom-resizer > .pane ~ .pane {
}
.custom-resizer > .multipane-resizer {
  margin: 0;
  left: 0;
  position: relative;
}
.custom-resizer > .multipane-resizer:before {
  display: block;
  content: "";
  width: 3px;
  height: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -20px;
  margin-left: -1.5px;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
}
.custom-resizer > .multipane-resizer:hover:before {
  border-color: #999;
}
.list-group-item.active {
    z-index: 2;
    color: #fff;
    background-color: #9ad8ea !important;
    border-color: #9ad8ea !important;
}



.app-header {
  width:150px;
  height:49px;
  overflow: hidden;
}
</style>
