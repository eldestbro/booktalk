<template>
  <div>
    <b-carousel id="carousel1"
                indicators
                background="#ababab"
                :interval="4000"
                v-model="slide"
    >
      <b-carousel-slide img-src="/src/assets/images/temp01.png">
        <h3>
          에듀센에서 AI 교사와 함께<br />
          쉽고 재미있게 소프트웨어를 배우세요!      
        </h3>
        <h4>
          코딩을 배움으로써 복잡하고 어려운 문제를 풀어 나갈 수 있는<br />
          창의력, 논리적 사고력, 문제해결력을 함양할 수 있습니다.
        </h4>
      </b-carousel-slide>
    </b-carousel>




    <div class="class-list">
      <!-- 데이터 리스트 -->
        <a href="" class="class-count">
          <p class="txt">
            에듀센의 수많은 소프트웨어 교육을<br />
            지금 확인하세요!
          </p>
          <strong>총<span>{{this.list.count}}</span>개</strong>
        </a>
        <div class="class-categoty">
          <p class="txt">에듀센에는 총 <strong>{{this.list.count}}</strong> 개의 강의가 있습니다.</p>
          카테고리
          <ul>
            <li><a href=""></a></li>
            <li><a href=""></a></li>
            <li><a href=""></a></li>
            <li><a href=""></a></li>
            <li><a href=""></a></li>
            <li><a href=""></a></li>
          </ul>
        </div>
        <div class="class-scrolly">
          <scrolly v-if="list.data.length > 0">
            <scrolly-viewport>
              <div class="class-item-list" v-for="i in Math.ceil(list.data.length / list.data.length)" :key="i">
                <div class="class-item" v-for="subject in list.data.slice((i-1)*list.data.length, i*list.data.length)" :key="subject.id" >
                  <b-link href="#" v-on:click="commonRouterLink('/front/subjectInfo/' + subject.id)">
                    <p class="bg" v-bind:style="{ background: 'url('+subject.image+') no-repeat',backgroundPosition:'50% 50%',backgroundSize:'cover'}"></p>
                    <p class="title">{{subject.title}}</p>
                    <p class="description" >{{subject.description}}</p>                  
                  </b-link>
                  <!--<div slot="footer">-->
                    <!--<div class="bv-example-row container">-->
                      <!--<div class="row">-->
                          <!--<span><small class="text-muted"><i class="fa fa-user"></i>&nbsp; {{subject.student_count.signup_count}}&nbsp;명 수강중</small></span>-->
                          <!--<div class="text-right col" style="padding-right: 0px">-->
                            <!--<b-badge v-if="subject.code_info.difficulty.code=='01'" variant="success" class="mainCardBadgeType1">{{subject.code_info.difficulty.name}}</b-badge>-->
                            <!--<b-badge v-else-if="subject.code_info.difficulty.code=='02'" variant="primary" class="mainCardBadgeType1">{{subject.code_info.difficulty.name}}</b-badge>-->
                            <!--<b-badge v-else-if="subject.code_info.difficulty.code=='03'" variant="danger" class="mainCardBadgeType1">{{subject.code_info.difficulty.name}}</b-badge>-->
                            <!--<b-badge v-else variant="secondary" class="mainCardBadgeType1">{{subject.code_info.difficulty.name}}</b-badge>-->
                          <!--</div>-->
                      <!--</div>-->
                    <!--</div>-->
                  <!--</div>-->
                </div>
              </div>
            </scrolly-viewport>
            <scrolly-bar axis="y"></scrolly-bar>
            <scrolly-bar axis="x"></scrolly-bar>
          </scrolly>
        </div>
      
        <!-- pagination -->
        <pagination :dataCount="list.count" :currentPage="Number(param.currentPage)" @page-changed="pageChanged"></pagination>
    </div>

    
  </div>

</template>



<script>
import commonMixin from '@/components/mixin/commonMixin'
import loadingMessage from '@/components/LoadingMessage'
import pagination from '@/components/Pagination'
import { Scrolly, ScrollyViewport, ScrollyBar } from 'vue-scrolly'

export default{
  mixins: [commonMixin],
  components: {
    'loading-message': loadingMessage,
    'pagination': pagination,
    Scrolly,
    ScrollyViewport,
    ScrollyBar
  },
  data () {
    return {
      list: {
        state: 0,
        count: 0,
        data: []
      },
      param: {
        searchWord: '',
        currentPage: 1
      }
    }
  },
  methods: {
    getDataList () {
      // 과목타입 조회조건
      let openTypeList = []

      // 로그인을 하지 않은 경우 모든 과목타입을 보여준다.
      let isAnon = this.commonIsValueNull(this.commonGetStoreUser('jwt'))
      if (isAnon) {
        openTypeList = ['01', '02', '03']
      } else {
        // 로그인이 된 경우 사용자의 openType을 조회한다.
        if (this.commonIsLoginAuthGroupOK([1, 2])) {
          // 본사관리자는 모든 타입을 오픈타입으로 한다.
          openTypeList = ['01', '02', '03']
        } else if (this.commonIsLoginAuthGroupOK([3, 4, 5, 6])) {
          // 지사, 학원, 교사, 학생은 해당 사용자의 openType값을 세팅한다.
          openTypeList = this.commonGetUserOpenType()
        }
      }
      let searchOpenTypeList = '&open_type_list=' + openTypeList

      this.list.state = 0
      const baseURI = this.$store.state.baseUrl + '/course/subjectMappingList/?list_type=detail&is_active=true&search=' + this.param.searchWord + '&page=' + this.param.currentPage + searchOpenTypeList
      this.axios.get(baseURI)
      .then((response) => {
        this.list.data = response.data.results
        this.list.count = response.data.count
        this.list.state = 1
      })
      .catch(e => {
        this.list.state = 2
      })
    },
    getSearch () {
      // 검색 실행(페이지를 1로 초기화 한다.)
      this.param.currentPage = 1
      this.getDataList()
    },
    pageChanged (pNum) {
      // 페이지 변경 시
      this.param.currentPage = pNum
      this.getDataList()
    }
  },
  computed: {

  },
  created () {
    // 페이지 로딩 시 파라미터 세팅
    this.param.searchWord = this.commonSetDefault(this.$route.query.search, this.param.searchWord)
    this.param.currentPage = this.commonSetDefault(this.$route.query.page, this.param.currentPage)
    this.getDataList()
  }
}
</script>

<style lang="scss">
$class-item-width:                220px !default;
$class-item-margin:                15px !default;

.class-list {
  position: absolute;
  top:0;
  left:0%;
  bottom:0;
  width: $class-item-width *10;
  background:#fff;
  border-left:1px solid #d5d5d5;
  .class-count {
    position: absolute;
    bottom:30px;
    left:-432px;
    width:462px;
    height:80px;
    padding:10px 10px 10px 10px;
    border-radius:40px;
    font-size:16px;
    line-height:22px;
    background:#fff;
    box-shadow: 0px 10px 46px -6px rgba(0,0,0,0.5);
    strong {
      display:block;
      position:absolute;
      top:0;
      right:0;
      height:100%;
      padding:30px 10px 0;
      border-radius:40px;
      background:#3148c9;
      color:#fff;
      font-size:20px;
      font-weight:400;
      span {
        font-size:40px;
      }
    }
  }
  .class-categoty {
    height:100px;
    background:#fafafa;
    border-bottom:1px solid #d5d5d5;
  }
  .class-scrolly {
    position: absolute;
    top:100px;
    left:0;
    right:0;
    bottom:0;
    .scrolly {
      height:100%;
    }
    .class-item-list {
      padding:30px 46px;
      width:200%;
      .class-item {
        float:left;
        width:$class-item-width;
        height:235px;
        margin:0 $class-item-margin $class-item-margin 0;
        box-shadow: 0px 10px 46px -6px rgba(0,0,0,0.5);    
        border-radius:10px;
        a {
          display:block;
          width:100%;
          height:100%;
          color:#000;
          .bg {
            background:#f60;
            width:100%;
            height:100px;
            border-radius: 10px 10px 0 0;
          }
          .title {
            display:none;
          }
          .description {
            font-size:14px;
            line-height: 18px;
          }      
        }
      }
    }
  }
}
</style>
