<template>
  <div>
    <a href="" class="banner-top"><img src="/src/assets/images/banner-top.png" alt=""></a>
    <b-carousel id="carousel1" indicators :interval="0" class="carousel-fade">
      <b-carousel-slide class="slide01">
        <h3>
          에듀센에서 AI 교사와 함께1<br />
          쉽고 재미있게 소프트웨어를 배우세요!      
        </h3>
        <h4>
          코딩을 배움으로써 복잡하고 어려운 문제를 풀어 나갈 수 있는<br />
          창의력, 논리적 사고력, 문제해결력을 함양할 수 있습니다.
        </h4>
      </b-carousel-slide>
      <b-carousel-slide class="slide01">
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

    <b-carousel id="carousel2" indicators :interval="0" class="carousel-fade">
      <b-carousel-slide class="slide01">
        <h3>
          Educen Test™     
        </h3>
        <h4>
          지금 나의 코딩 실력은 어느 정도일까?<br />
          Educen Test™를 통해 알아보세요.
        </h4>
        <a href="" class="btn">자세히 보기</a>
      </b-carousel-slide>
       <b-carousel-slide class="slide01">
        <h3>
          Educen Test™     
        </h3>
        <h4>
          지금 나의 코딩 실력은 어느 정도일까?<br />
          Educen Test™를 통해 알아보세요.
        </h4>
        <a href="" class="btn">자세히 보기</a>
      </b-carousel-slide>
    </b-carousel>

    <div class="class-list" v-bind:class="{ active: classList.isActive }">      
      <!-- 데이터 리스트 -->
        <a href="javascript:void();" v-on:click="classOpen" class="class-count">
          <p class="txt">
            에듀센의 수많은 소프트웨어 교육을<br />
            지금 확인하세요!
          </p>
          <strong>총 <span>{{this.list.count}}</span>개</strong>
        </a>
        <div class="class-categoty">
          <!-- 검색 -->
          <a href="" class="btn-search"></a>
          <div class="search">
            <b-input-group>
              <b-form-input id="searchInput" name="search" v-model="param.searchWord" v-on:keyup.enter.native="getSearch" :placeholder="$t('SearchText.subject')"></b-form-input>
              <b-btn text="Button" v-on:click="getSearch">{{$t('SearchText.subject_btn_text')}}</b-btn>
            </b-input-group>
          </div>
          <div class="cate">
            <span class="sti">카테고리</span>
            <ul>
              <li><a href="">전체 <span>271</span></a></li>
              <li><a href="">스크래치 <span>271</span></a></li>
              <li><a href="">엔트리 <span>271</span></a></li>
              <li><a href="">파이썬 <span>271</span></a></li>
              <li><a href="">언플러그드 <span>271</span></a></li>
              <li><a href="">기타 <span>271</span></a></li>
            </ul>
          </div>
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
              <!-- pagination -->
              <pagination :dataCount="list.count" :currentPage="Number(param.currentPage)" @page-changed="pageChanged"></pagination>
            </scrolly-viewport>
            <scrolly-bar axis="y"></scrolly-bar>
          </scrolly>
        </div>
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
      },
      classList: {
        isActive: false
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
    },
    classOpen () {
      if (this.classList.isActive === true) {
        this.classList.isActive = false
      } else {
        this.classList.isActive = true
      }
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
@mixin text-clamp($lines: 2, $line-height: false) {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: $lines;

    // Fallback for non-Webkit browsers
    // (won't show `…` at the end of the block)
    @if $line-height {
        max-height: $line-height * $lines * 1px;
    }
}

.banner-top {
  position: absolute;
  top:0;
  left:0;
  right:0;
  z-index:20;
}

#carousel1 {
  position: absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  z-index:10;
  .carousel-inner {
    height:100%;
    .carousel-caption {
      position: relative;
      right:auto;
      bottom:auto;
      left:auto;
      height:100%;
      padding:0;
      text-align: left;
    }
  }
  .carousel-indicators {
    margin: 0;
    top:436px;
    left:80px;    
    right:auto;
    bottom:auto;
    li {
      width:40px;
      background:#d5d5d5;
      margin:0 5px 0 0;
      cursor:pointer;
      &.active {
        background:#36a2cd;
      }      
    }
  }
  .slide01 {
    height:100%;
    background:url("/src/assets/images/main-slide01.jpg") no-repeat 100% 100%;
    background-size:auto 100%;
    text-align: left;
    h3 {
      padding:194px 0 0 80px;
      font-size:40px;
      line-height:45px;
      color:#36a2cd;
      font-weight: 500;
      letter-spacing: -2px;
    }
    h4 {
      padding:37px 0 0 79px;
      font-size:20px;
      line-height:30px;
      color:#090909;
      font-weight: 300;
      letter-spacing: -1px;
    }
  }  
}

#carousel2 {
  position: absolute;
  top:539px;
  left:80px;
  width:530px;
  height:130px;
  z-index:20;
  .carousel-inner {
    height:100%;
    .carousel-caption {
      position: relative;
      right:auto;
      bottom:auto;
      left:auto;
      height:100%;
      padding:0;
      text-align: left;
    }
  }
  .carousel-indicators {
    margin: 0;
    bottom:30px;
    left:auto;
    top:auto;
    right:80px;    
    li {
      width:30px;
      background:#d5d5d5;
      margin:0 5px 0 0;
      cursor:pointer;
      &.active {
        background:#36a2cd;
      }      
    }
  }
  .slide01 {
    position: relative;
    height:100%;
    background:url("/src/assets/images/main-banner01.jpg") no-repeat 100% 100%;
    text-align: left;
    h3 {
      padding:19px 0 0 30px;
      font-size:24px;
      line-height:42px;
      color:#fff;
      font-weight: 900;
      letter-spacing: 0;
    }
    h4 {
      padding:3px 0 0 30px;
      font-size:14px;
      line-height:20px;
      color:#fff;
      letter-spacing: -1px;
    }
    .btn {
      display: block;
      position: absolute;
      bottom:59px;
      right:38px;
      width:160px;
      height:40px;
      background:rgba(0,0,0,0.2);    
      font-size:18px;
      text-align:center;
      color:#fff;
      border-radius:20px;
      &:hover {
        background:rgba(0,0,0,0.4);    
      }
    }
  }  
}

.class-list {
  position: absolute;
  top:0;
  left:90%;
  bottom:0;
  //width: $class-item-width *10;
  right:0;
  background:#fff;
  border-left:1px solid #d5d5d5;
  transition: left 0.5s ease-in-out;
  z-index:20;
  .class-count {
    position: absolute;
    bottom:30px;
    left:-432px;
    width:462px;
    height:80px;
    padding:18px 10px 10px 39px;
    border-radius:40px;
    font-size:16px;
    line-height:22px;
    background:#fff;
    box-shadow: 0px 10px 46px -6px rgba(0,0,0,0.5);
    z-index:30;
    strong {
      display:block;
      position:absolute;
      top:0;
      right:0;
      height:100%;
      padding:28px 28px 0 28px;
      border-radius:40px;
      background:#3148c9;
      color:#fff;
      font-size:20px;
      font-weight:500;
      span {
        font-size:40px;
      }
    }
    &:after {
      content:"";
      display:block;
      position: absolute;
      top:30px;
      left:34px;
      background:url("/src/assets/images/ico/btn-class-close.png") no-repeat 0 0;
      width:12px;
      height:20px;
    }    
  }
  .class-categoty {
    position: relative;
    height:100px;
    padding:0 0 0 100px;
    background:#fafafa;
    border-bottom:1px solid #d5d5d5;
    line-height:100px;
    overflow: hidden;
    .btn-search {
      display:block;
      position: absolute;
      top:0;
      left:0;
      width:100px;
      height:100px;
      background:#3148c9;
    }
    .search {
      position: relative;
      padding:20px 0 0 0;
      .form-control {
        width:620px;
        height:60px;
        margin:0 0 0 30px;
        background:#f1f3f4;
        border: 1px solid #e1e1e1;
        border-radius: 30px;
        line-height:60px;
        font-size:20px;
        color:#000;
      }
      .btn-secondary {
        display:block;
        position: absolute;
        top:0;
        right:0;
        width:180px;
        height:60px;
        padding:0;
        border:0;
        color:#fff;
        font-size:20px;
        line-height:60px;
        border-radius: 30px;
        background:#3148c9;
      }   
    } 
    .search {
      float:left;
    }
    .cate {
      position: relative;
      float:left;
      margin:0 0 0 30px;
      padding:0 0 0 20px;
      &:after {
        content:"";
        display:block;
        position: absolute;
        top:50%;
        left:0;
        border:1px solid #ebebeb;
        height:30px;
        margin-top:-15px;
      }
      .sti {
        float:left;
        font-size:18px;
        color:#333;        
      }
      ul {
        float:left;
        li {
          float:left;
          a {
            display:inline-block;
            height:44px;
            background:#fff;
            margin:0 5px;
            font-size:15px;
            color:#090909;
            padding:0 15px;
            border-radius:22px;
            line-height:42px;
            border:2px solid #ebebeb;
            
            span {
              font-size:12px;
              font-weight:500;
              color:#c4c4c4;
            }
            &:hover {
              border-color:#fff;
              box-shadow: 0px 10px 46px -6px rgba(0,0,0,0.5);
              span {
                color:#36a2cd;
              }
            }
          }
        }
      }
    }
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
            height:145px;
            border-radius: 10px 10px 0 0;
          }
          .title {
            display:none;
          }
          .description {
            margin:17px 13px;
            font-size:14px;
            line-height: 18px;
            @include text-clamp($lines:3);
          }      
        }
      }
      &:after {content:"";display:block;height:0;font-size:0;line-height:0;clear:both;}
    }
  }
  &.active {
    left:-1px;
    .class-count {
      left:-50px;
      width:80px;
      height:80px;
      font-size:0;
      background:#3148c9;
      p {
        display: none;
      }
      strong {
        display:none;
      }
    }
  }
}





.carousel.carousel-fade .carousel-item {
    -webkit-transition: opacity 2s ease-in-out;
    -moz-transition: opacity 2s ease-in-out;
    -ms-transition: opacity 2s ease-in-out;
    -o-transition: opacity 2s ease-in-out;
    transition: opacity 2s ease-in-out;
}
.carousel.carousel-fade .active.left,
.carousel.carousel-fade .active.right {
    left: 0;
    z-index: 2;
    opacity: 0;
    filter: alpha(opacity=0);
}
.carousel.carousel-fade .next,
.carousel.carousel-fade .prev {
    left: 0;
    z-index: 1;
}

.carousel.carousel-fade .carousel-control {
    z-index: 3;
}

</style>
