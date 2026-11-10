$(function () {
  "use strict";
  $(".mobile-toggle-menu").on("click", function () {
    $(".wrapper").addClass("toggled");
    $(".wrapper").removeClass("normal");
    $(".sc_mn").removeClass('bx-skip-next');
    $(".sc_mn").addClass('bx-skip-previous');
    localStorage.setItem("sts_umenu_smk", 'toggled');
  }), $(document).ready(function () {
    $(window).on("scroll", function () {
      $(this).scrollTop() > 300 ? $(".back-to-top").fadeIn() : $(".back-to-top").fadeOut()
    }), $(".back-to-top").on("click", function () {
      return $("html, body").animate({
        scrollTop: 0
      }, 600), !1
    })
  }), $(function () {
    $("#menu").metisMenu()
  }), $(".switcher-btn").on("click", function () {
    $(".switcher-wrapper").toggleClass("switcher-toggled")
  }), $(".close-switcher").on("click", function () {
    $(".switcher-wrapper").removeClass("switcher-toggled")
  })
});

let sts_umenu_smk = localStorage.getItem("sts_umenu_smk") ?
  localStorage.getItem("sts_umenu_smk") : 'normal';

function setSidebarDefault() {
  if (window.innerWidth >= 992) {
    $(".wrapper").addClass(sts_umenu_smk);
    $(".sc_mn").addClass('bx-skip-next');
    $(".sc_mn").removeClass('bx-skip-previous');
  } else {
    $(".wrapper").removeClass(sts_umenu_smk);
    $(".sc_mn").removeClass('bx-skip-next');
    $(".sc_mn").addClass('bx-skip-previous');
  }
}
$(document).ready(function () {
    setSidebarDefault();
  }),
  $(window).resize(function () {
    setSidebarDefault();
  });

$(".hidemenu").click(function () {
  let sts_umenu_smk = localStorage.getItem("sts_umenu_smk") ?
    localStorage.getItem("sts_umenu_smk") : 'normal';
  if (sts_umenu_smk == 'normal') {
    localStorage.setItem("sts_umenu_smk", 'toggled');
    $(".wrapper").removeClass("normal");
    $(".wrapper").addClass("toggled");
    $(".sc_mn").addClass('bx-skip-next');
    $(".sc_mn").removeClass('bx-skip-previous');
    $(".sidebar-wrapper").hover(function () {
      $(".wrapper").addClass("sidebar-hovered")
    }, function () {
      $(".wrapper").removeClass("sidebar-hovered")
    })
  } else {
    localStorage.setItem("sts_umenu_smk", 'normal');
    $(".wrapper").removeClass("toggled");
    $(".wrapper").addClass("normal");
    $(".sidebar-wrapper").unbind("hover");
    $(".sc_mn").removeClass('bx-skip-next');
    $(".sc_mn").addClass('bx-skip-previous');
  }
});

$(".sidebar-wrapper").hover(
  function () {
    $(".wrapper").addClass("sidebar-hovered");
  },
  function () {
    $(".wrapper").removeClass("sidebar-hovered");
  }
);

let zoomLevel_smk = localStorage.getItem("zoomLevel_smk") ?
  parseFloat(localStorage.getItem("zoomLevel_smk")) :
  0.8;

applyZoom();

function zoomIn() {
  zoomLevel_smk += 0.1;
  saveZoom();
}

function zoomOut() {
  zoomLevel_smk -= 0.1;
  saveZoom();
}

function resetzoom() {
  zoomLevel_smk = 0.8;
  saveZoom();
}

function saveZoom() {
  if (zoomLevel_smk > 1.3) {
    zoomLevel_smk = 1.3;
  } else if (zoomLevel_smk < 0.5) {
    zoomLevel_smk = 0.5;
  } else {
    zoomLevel_smk = zoomLevel_smk;
  }
  localStorage.setItem("zoomLevel_smk", zoomLevel_smk);
  applyZoom();
}

function applyZoom() {

  const wrapper = document.querySelector(".wrapper");

  if (wrapper) {
    wrapper.style.zoom = zoomLevel_smk;
  }

}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', function (e) {
  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
    (e.ctrlKey && e.key === "U")
  ) {
    e.preventDefault();
  }
});