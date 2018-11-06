<template>
  <!-- 아두이노 처리 -->
  <div v-if="this.category ==='01' && (mode !== 'study' || ['01', '03'].includes(this.lessonType))" style="display: inline;" >
    <!--<b-button v-on:click="" size="sm" style="width: 70px; font-size: 10pt; border: 1px solid #a4b7c1;" variant="light" v-b-popover.hover.top="'Local IDE 실행'"><i class="fa fa-play"></i></b-button>-->
    <b-button v-if="mode === 'study'" v-on:click="openArduinoIDE()" size="sm" style="width: 70px; font-size: 10pt; border: 1px solid #a4b7c1;" variant="light" v-b-popover.hover.top="$t('ArduinoHelper.run_local_IDE')">{{$t('ArduinoHelper.run_ide')}}</b-button>
    <b-button v-if="mode === 'study'" v-on:click="openHelp()" size="sm" style="width: 70px; font-size: 10pt; border: 1px solid #a4b7c1;" variant="light" v-b-popover.hover.top="$t('ArduinoHelper.IDE_install_help')">{{$t('Button.help')}}</b-button>
    <b-button v-on:click="downloadArduino()" size="sm" style="width: 70px; font-size: 10pt; border: 1px solid #a4b7c1;" variant="light" v-b-popover.hover.top="$t('Tooltip.project_download')">{{$t('Tooltip.download')}}</b-button>
  </div>
  <!-- 엔트리/스크래치 실습/문제 처리 -->
  <div v-else-if="['02', '03', '04'].includes(this.category)&&(mode !== 'study' || ['01', '03'].includes(this.lessonType))" style="display: inline;">
    <b-button v-on:click="fullscreen()" size="sm" variant="light" v-b-popover.hover.top="$t('Tooltip.full_screen')"><i class="fa fa-arrows-alt"></i>&nbsp; {{$t("Button.fullscreen")}}</b-button>
    <b-button v-on:click="messageVLE('init')" size="sm" variant="light" v-b-popover.hover.top="$t('Tooltip.reset')"><i class="fa fa-refresh"></i> {{$t("Button.reset")}}</b-button>
    <b-button id="codeSaveBtn" v-if="mode === 'study'" v-on:click="messageVLE('save')" size="sm" variant="light" v-b-popover.hover.top="$t('Tooltip.temp_save')"><i class="fa fa-save"></i>&nbsp;{{$t("Button.temp_save")}}</b-button>
    <b-button v-if="mode === 'quiz'" v-on:click="messageVLE('delete')" size="sm" style="width: 70px; font-size: 10pt; border: 1px solid #a4b7c1;" variant="light"v-b-popover.hover.top="$t('Tooltip.delete')" ><i class="fa fa-trash"></i>&nbsp;</b-button>
    <b-button v-on:click="messageVLE('download')" size="sm" variant="light" v-b-popover.hover.top="$t('Tooltip.download')"><i class="fa fa-download"></i>&nbsp;{{$t("Button.download")}}</b-button>
    
    <b-button v-if="['04'].includes(this.category)" v-on:click="messageVLE('build')" size="sm" variant="primary" style="width: 70px; font-size: 10pt; border: 1px solid #a4b7c1;" v-b-popover.hover.top="$t('Tooltip.run')"><i class="fa fa-play"></i>&nbsp;</b-button>
    <b-button v-if="['02', '03'].includes(this.category)&&mode === 'quiz'" v-on:click="messageVLE('ct')" size="sm" style="width: 70px; font-size: 10pt; border: 1px solid #a4b7c1;" variant="primary" v-b-popover.hover.top="$t('CommonText.CT_eval')"><i class="fa fa-bar-chart"></i>&nbsp;</b-button>
    <div class="pull-right" style="margin-left: 3px;">
      <b-button v-if="showSubmitBtn" v-on:click="messageVLE('submit')" size="sm" variant="success" v-b-popover.hover.top="$t('Tooltip.submit')"><i class="fa fa-paper-plane"></i>&nbsp;{{$t("Button.submit")}}</b-button>
    </div>
    <b-modal  v-if="mode === 'quiz'" ref="ctModal" v-model="show" centered :title="$t('CommonText.ct_eval_result')">
      <table class="table">
        <!--<caption>총점: {{ ctLevelSum }}/21 ({{ ctGrade }})</caption>-->
        <thead>
          <tr>
            <th scope="col"><span>#</span></th>
            <th scope="col"><span v-b-popover.hover.top="$t('Tooltip.standard_eval')">{{$t('CommonText.standard')}}</span></th>
            <th scope="col"><span v-b-popover.hover.top="$t('Tooltip.result_eval')">{{$t('CommonText.result')}}</span></th>
            <th scope="col"><span v-b-popover.hover.top="$t('Tooltip.defined_CT_score')">{{$t('CommonText.lesson_ct')}}</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in ctResults" :class="'text-' + item.ctColor">
            <th scope="row">{{ item.ctIndex }}</th>
            <td>
              <span v-if="['03'].includes(category)" v-b-popover.hover.html="item.comment ? item.comment.join('<br><br>'):''" :title="item.ctLabel" style="color: blue;">{{ item.ctLabel }} <i class="fa fa-question-circle" aria-hidden="true"></i></span>
              <span v-else>{{ item.ctLabel }}</span>
            </td>
            <td style="width: 50%">
              <b-progress :value="item.ctLevel" :max="max" animated show-value :variant="item.ctColor"></b-progress>
            </td>
            <td style="width: 20%">
              <b-form-select size="sm" v-model="ct_score[item.ctIndex - 1]" :options="options" class="ct_score mb-3"></b-form-select>
            </td>
          </tr>
        </tbody>
      </table>
      <div slot="modal-footer" class="w-100">
        <b-btn variant="success" @click="saveLessonCT()">{{$t('Button.save_lesson_CT')}}</b-btn>
        <b-btn class="float-right" variant="light" @click="show=false">{{$t('Button.close')}}</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '@/components/mixin/commonMixin'

  export default {
    mixins: [commonMixin],
    props: {
      // VLE모드 : study(학습용), view(평가용), quiz(문제제출용)
      mode: {
        type: String,
        required: true
      },
      // 수업타입
      lessonType: {
        type: String
      },
      // 대상 VLE iframe ID
      targetId: {
        type: String,
        required: true
      },
      // 수업 카테고리(아두이노,엔트리,스크래치,Python)
      category: {
        type: String
      },
      // 과목 아이디(subject)
      subjectId: {
        type: String
      },
      // 수업 아이디(lesson)
      lessonId: {
        type: String
      },
      lessonObj: {
        type: Object
      },
      userId: {
        type: String
      },
      vle_is_submit: {
        type: Boolean
      }
    },
    data () {
      return {
        // VLE 로딩완료 체크
        vle_loaded: false,
        // VLE 메뉴 실행중(true), VLE 메뉴 미실행중(false)
        messagingVLE: false,
        lastMessage: '',
        ctLevelSum: 0,
        ctGrade: this.$t('CommonText.beginner'),
        ctResults: [],
        max: 3,
        options: [
          {value: 0, text: 0},
          {value: 1, text: 1},
          {value: 2, text: 2},
          {value: 3, text: 3}
        ],
        show: false,
        ct_score: [0, 0, 0, 0, 0, 0, 0]
      }
    },
    created: function () {
      // 완료메시지를 받기 위해 이벤트 추가
      // 동일 이벤트 중복 설정시 자동으로 기존 이벤트는 삭제된다... 물론 무식한 방법이다...
      // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Multiple_identical_event_listeners
      if (window.addEventListener) {
        window.addEventListener('message', this.processMessage, false)
      } else {
        window.attachEvent('onmessage', this.processMessage)
      }

      // console.log('lesson::' + this.lessonId)
      // // 아두이노인 경우 본인이 업로드한 IDE소스를 다운받을 수 있도록 한다.
      // if (this.category === '01') {
      //   this.getStudyDataList()
      // }
    },
    methods: {
      showModal () {
        this.ct_score = [
          this.lessonObj.ct1,
          this.lessonObj.ct2,
          this.lessonObj.ct3,
          this.lessonObj.ct4,
          this.lessonObj.ct5,
          this.lessonObj.ct6,
          this.lessonObj.ct7
        ]

        this.$refs.ctModal.show()
      },
      processMessage (event) {
        // 동일 서버의 통신 외에는 무시
        if (event.origin !== this.$store.state.baseUrl) {
          return
        }

        try {
          JSON.parse(event.data)
        } catch (e) {
          console.log(event)
          return
        }

        let result = JSON.parse(event.data)

        // 메시지 처리중일때 다른 메시지는 무시
        if (this.lastMessage !== '' && this.lastMessage !== result.command) {
          return
        }

        if (result.status === 'done') {
          if (result.command === 'init') {
            // '초기화 되었습니다.'
            this.commonNotify('success', this.$t('NotifyMsg.004'))
          } else if (result.command === 'save') {
            // '저장 되었습니다.' : '임시저장 되었습니다.'
            this.commonNotify('success', this.$props.mode === 'quiz' ? this.$t('NotifyMsg.005') : this.$t('NotifyMsg.006'))
          } else if (result.command === 'submit') {
            // '제출 되었습니다.'
            this.commonNotify('success', this.$t('NotifyMsg.007'))
            this.$emit('submit_success', true)
          } else if (result.command === 'delete') {
            // '삭제 되었습니다.'
            this.commonNotify('success', this.$t('NotifyMsg.008'))
          } else if (result.command === 'ct') {
            let data = JSON.parse(result.ct)
            this.ctLevelSum = data.ctLevelSum
            this.ctGrade = data.ctGrade
            this.ctResults = data.ctResults
            this.showModal()
          }
        } else if (result.status === 'error') {
          if (result.command === 'save') {
            // '저장되지 않았습니다.'
            this.commonNotify('error', this.$t('NotifyMsg.009'))
          } else if (result.command === 'submit') {
            // '제출이 불가능 합니다. <br/>잠시 후 다시 한 번 시도해 주세요.'
            this.commonNotify('error', this.$t('NotifyMsg.010'))
          } else if (result.command === 'delete') {
            // '저장된 프로젝트가 없습니다.'
            this.commonNotify('error', this.$t('NotifyMsg.011'))
          } else if (result.command === 'download') {
            // '다운로드를 할 수 없습니다.'
            this.commonNotify('error', this.$t('NotifyMsg.012'))
          }
        } else if (result.status === 'already') {
          // '평가가 완료되어 더이상 제출할 수 없습니다.'
          this.commonNotify('error', this.$t('NotifyMsg.013'))
        } else if (result.status === 'loaded') {
          this.vle_loaded = true
          this.lastMessage = ''
        }

        this.lastMessage = ''
        this.messagingVLE = false
      },
      messageVLE (message) {
        // VLE가 로딩되기 전이거나 이미 실행중인 메뉴가 있을경우에는 실행을 막는다.
        if (!this.vle_loaded || this.messagingVLE) {
          return
        }

        let isConfirm = true
        if (message === 'init') {
          // '정말 초기화 하시겠습니까?'
          isConfirm = confirm(this.$t('AlertMsg.confirm_reset'))
        } else if (message === 'submit') {
          // '정말 제출 하시겠습니까?'
          isConfirm = confirm(this.$t('AlertMsg.confirm_submit'))
        } else if (message === 'delete') {
          // '정말 삭제 하시겠습니까? \n※ 삭제 시 작성된 내용은 초기화 됩니다.'
          isConfirm = confirm(this.$t('AlertMsg.confirm_delete_reset'))
        }

        if (!isConfirm) {
          return
        }

        this.messagingVLE = true
        this.lastMessage = message

        // 메세지 전송
        document.getElementById(this.targetId).contentWindow.postMessage(message, '*')
      },
      openHelp () {
        let popOpen = window.open('/pop/aduinoIdeHelp/', 'pageContent', 'width=1200, height=750')
        popOpen.focus()
      },
      fullscreen () {
        if (document.fullscreenEnabled ||
          document.webkitFullscreenEnabled ||
          document.mozFullScreenEnabled ||
          document.msFullscreenEnabled) {
          // which element will be fullscreen
          var iframe = document.querySelector('#ifrmVLE')
          // Do fullscreen
          if (iframe.requestFullscreen) {
            iframe.requestFullscreen()
          } else if (iframe.webkitRequestFullscreen) {
            iframe.webkitRequestFullscreen()
          } else if (iframe.mozRequestFullScreen) {
            iframe.mozRequestFullScreen()
          } else if (iframe.msRequestFullscreen) {
            iframe.msRequestFullscreen()
          }
        } else {
          document.querySelector('.error').innerHTML = 'Your browser is not supported'
        }
      },
      saveLessonCT () {
        let baseURI = this.$store.state.baseUrl + '/course/lessonInfo/' + this.lessonObj.id + '/'
        this.lessonObj.ct1 = this.ct_score[0]
        this.lessonObj.ct2 = this.ct_score[1]
        this.lessonObj.ct3 = this.ct_score[2]
        this.lessonObj.ct4 = this.ct_score[3]
        this.lessonObj.ct5 = this.ct_score[4]
        this.lessonObj.ct6 = this.ct_score[5]
        this.lessonObj.ct7 = this.ct_score[6]
        this.axios.put(baseURI, this.lessonObj).then((response) => {
          // '현재 수업의 CT점수를 수정하였습니다.'
          this.commonNotify('success', this.$t('NotifyMsg.014'))
        }).catch(e => {
          this.errors.push(e)
          // '수업 수정에 실패 하였습니다.'
          this.commonNotify('error', this.$t('NotifyMsg.312'))
        })
      },
      openArduinoIDE () {
        // 아두이노 IDE 오픈
        // 사용자 아이디(tb_user)
        let userId = this.commonGetStoreUser('id')
        // console.log('user::' + userId)

        // 반 정보 (tb_academy_class)
        let academyClass = this.commonGetStoreUser('academy_class_id')

        // 서버 정보
        let server = this.$store.state.baseUrl

        // 아두이노 IDE 호출
        // console.log('ArduinoIDELink://' + '_' + userId + '_' + academyClass + '_' + this.subjectId + '_' + this.lessonType + '_' + this.lessonId + '_' + server + '_' + '002')
        location.href = 'ArduinoIDELink://' + '_' + userId + '_' + academyClass + '_' + this.subjectId + '_' + this.lessonType + '_' + this.lessonId + '_' + server + '_' + '002'
      },
      downloadArduino () {
        // 아두이노 프로젝트 다운로드
        const baseURI = this.$store.state.baseUrl + '/arduino/arduino_download'

        var data = new FormData()
        data.append('tb_user_id', this.userId)
        data.append('tb_lesson_id', this.lessonId)
        data.append('user_enc', this.commonGetStoreUser('user_enc'))
        this.axios.post(baseURI, data, {responseType: 'blob'})
        .then((response) => {
          let blob = new Blob([response.data], { type: 'application/zip' })

          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // ie or safari
            window.navigator.msSaveOrOpenBlob(blob, 'arduinoProject.zip')
          } else {
            // another(chrome, fire fox...)
            let url = window.URL.createObjectURL(blob)
            var link = document.createElement('a')
            link.href = url
            link.download = 'arduinoProject.zip'
            link.target = '_blank'
            document.body.appendChild(link)
            link.click()
            // '다운로드 되었습니다.'
            this.commonNotify('success', this.$t('NotifyMsg.015'))
          }
        })
        .catch(e => {
          console.log(e)
          // '저장된 파일이 없습니다.'
          this.commonNotify('error', this.$t('NotifyMsg.016'))
        })
      }
    },
    computed: {
      showSubmitBtn () {
        // 학습 모드의 수업 타입이 문제일 경우
        if (this.mode === 'study' && this.lessonType === '03') {
          // user가 학생인 경우 제출 버튼 보이도록 설정
          if (this.commonIsLoginAuthGroupOK([6])) {
            return true
          }
        }
        return false
      }
    }
  }
</script>

<style scoped>

</style>
