$(function () {
  "use strict";
  	function setSidebarDefault() {
  	  if (window.innerWidth >= 992) {
  	    $(".wrapper").addClass("toggled"); // laptop / desktop
  	  } else {
  	    $(".wrapper").removeClass("toggled"); // hp & tablet
  	  }
  	}
  	$(document).ready(function () {
  	  setSidebarDefault();
  	}), 
  	$(window).resize(function () {
  	  setSidebarDefault();
  	}),
  $(".mobile-toggle-menu").on("click", function () {
    $(".wrapper").addClass("toggled");
  }),
    $(".toggle-icon").click(function () {
      $(".wrapper").hasClass("toggled")
        ? ($(".wrapper").removeClass("toggled"),
          $(".sidebar-wrapper").unbind("hover"))
        : ($(".wrapper").addClass("toggled"),
          $(".sidebar-wrapper").hover(
            function () {
              $(".wrapper").addClass("sidebar-hovered");
            },
            function () {
              $(".wrapper").removeClass("sidebar-hovered");
            }
          ));
    }),
    $(document).ready(function () {
      $(window).on("scroll", function () {
        $(this).scrollTop() > 300
          ? $(".back-to-top").fadeIn()
          : $(".back-to-top").fadeOut();
      }),
        $(".back-to-top").on("click", function () {
          return (
            $("html, body").animate(
              {
                scrollTop: 0,
              },
              600
            ),
            !1
          );
        });
    }),
    $(function () {
      $("#menu").metisMenu();
    }),
    $(".chat-toggle-btn").on("click", function () {
      $(".chat-wrapper").toggleClass("chat-toggled");
    }),
    $(".chat-toggle-btn-mobile").on("click", function () {
      $(".chat-wrapper").removeClass("chat-toggled");
    }),
    $(".email-toggle-btn").on("click", function () {
      $(".email-wrapper").toggleClass("email-toggled");
    }),
    $(".email-toggle-btn-mobile").on("click", function () {
      $(".email-wrapper").removeClass("email-toggled");
    }),
    $(".compose-mail-btn").on("click", function () {
      $(".compose-mail-popup").show();
    }),
    $(".compose-mail-close").on("click", function () {
      $(".compose-mail-popup").hide();
    }),
    $(".switcher-btn").on("click", function () {
      $(".switcher-wrapper").toggleClass("switcher-toggled");
    }),
    $(".close-switcher").on("click", function () {
      $(".switcher-wrapper").removeClass("switcher-toggled");
    });
});
$(window).on("resize", function () {
  $(".content").LoadingOverlay("resize");
});

document.addEventListener('contextmenu', e => e.preventDefault());

// disable shortcuts
document.addEventListener('keydown', function (e) {
  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
    (e.ctrlKey && e.key === "U")
  ) {
    e.preventDefault();
  }
}); 