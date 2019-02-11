$(document).ready(function() {
  //scroll
  $(window).scroll(function() {
    var $el = $("header");

    if ($(this).scrollTop() > 0) $el.addClass("active");
    else $el.removeClass("active");
  });

  // slide
  var mainSlide = new Swiper(".main__slide .swiper-container", {
    effect: "fade",
    loop: true,
    pagination: {
      el: ".main__slide .swiper-pagination",
      clickable: true
    }
  });

  var mainNewsCompany = new Swiper(".main__news-company .swiper-container", {
    slidesPerView: 4,
    spaceBetween: 10,

    breakpoints: {
      900: {
        slidesPerView: 2,
        spaceBetween: 10
      },
      500: {
        slidesPerView: 1,
        spaceBetween: 10
      }
    },
    pagination: {
      el: ".main__news-company .swiper-pagination",
      clickable: true
    }
  });

  var mainNewsLately = new Swiper(".main__news-lately .swiper-container", {
    effect: "fade",
    loop: true,
    pagination: {
      el: ".main__news-lately .swiper-pagination",
      type: "fraction"
    },
    navigation: {
      nextEl: ".main__news-lately .swiper-button-next",
      prevEl: ".main__news-lately .swiper-button-prev"
    }
  });

  var mainNewsCase = new Swiper(".main__news-case .swiper-container", {
    slidesPerView: 3,
    spaceBetween: 10,
    slidesPerGroup: 3,
    loop: true,
    breakpoints: {
      900: {
        slidesPerView: 2,
        slidesPerGroup: 2
      },
      500: {
        slidesPerView: 1,
        slidesPerGroup: 1
      }
    },
    pagination: {
      el: ".main__news-case .swiper-pagination",
      clickable: true
    }
  });

  var mainAward = new Swiper(".main__award .swiper-container", {
    slidesPerView: 3,
    spaceBetween: 10,

    breakpoints: {
      900: {
        slidesPerView: 2
      },
      500: {
        slidesPerView: 1
      }
    },
    pagination: {
      el: ".main__award .swiper-pagination",
      type: "fraction"
    },
    navigation: {
      nextEl: ".main__award .swiper-button-next",
      prevEl: ".main__award .swiper-button-prev"
    }
  });

  //메인상단검색 focus
  $(".main__search-search input").focusin(function() {
    $(".main__search-search").addClass("active");
  });
  $(".main__search-search input").focusout(function() {
    $(".main__search-search").removeClass("active");
  });

  //tab
  $(".main__news-lately .inner").tabs({
    create: function(event, ui) {}
  });

  $(".main__search-field-tab li a").on("click", function() {
    var idx = $(this)
      .parent("li")
      .index();
    $(".main__search-field-tab li").removeClass("active");
    $(".main__search-field-tabcon").removeClass("active");
    $(this)
      .parent("li")
      .addClass("active");
    $(".main__search-field-tabcon:eq(" + idx + ")").addClass("active");
    return false;
  });

  //분야별 검색
  $(".main__search-field .btn-close").on("click", function() {
    $(".main__search-field-tab li").removeClass("active");
    $(".main__search-field-tabcon").removeClass("active");
    return false;
  });

  // header search
  $(".search-layer__button, .mobile-menu__btn-search").on("click", function() {
    $(".search-layer").addClass("active");
    $(".search-dim").fadeIn();
    return false;
  });
  $(".search-layer__search-close, .search-dim").on("click", function() {
    $(".search-layer").removeClass("active");
    $(".search-dim").fadeOut();
    return false;
  });
  $(".search-layer__search-input").focusin(function() {
    $(".search-layer").addClass("open");
  });
  $(".header__menu-submenu-language-menu").hover(
    function() {
      $(".search-layer").addClass("under");
    },
    function() {
      $(".search-layer").removeClass("under");
    }
  );

  // mobile header menu
  $(".mobile-menu__btn-menu").click(function() {
    if ($("html").hasClass("menu-open")) {
      $("html").removeClass("menu-open");
    } else {
      $("html").addClass("menu-open");
    }
    return false;
  });
  $(".header__menu > ul > li > a").click(function() {
    if (
      $(this)
        .parent("li")
        .hasClass("none")
    ) {
    } else {
      $(".header__menu > ul > li").removeClass("active");
      if (
        $(this)
          .parent("li")
          .hasClass("active")
      ) {
      } else {
        $(this)
          .parent("li")
          .addClass("active");
      }
      return false;
    }
  });

  //ie css object-fit
  var userAgent, ieReg, ie;
  userAgent = window.navigator.userAgent;
  ieReg = /msie|Trident.*rv[ :]*11\./gi;
  ie = ieReg.test(userAgent);

  if (ie) {
    $(".object-target").each(function() {
      var $container = $(this),
        imgUrl = $container.find("img").prop("src");
      if (imgUrl) {
        $container
          .css("backgroundImage", "url(" + imgUrl + ")")
          .addClass("object-fit");
      }
    });
  }
});
