// for navbar
$(document).ready(function() {

    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");
  });
});
// for navbar ends

$(window).resize(function(){
  // set movieposter size
  pHeight = $(window).height();
  pWidth = $(window).width();
  if (pWidth > pHeight){
    $("#moviePosterFigure").removeClass("is-3by4");
    $("#moviePosterFigure").addClass("is-3by2");
    console.log("pWidth");
  }else{
    $("#moviePosterFigure").removeClass("is-3by2");
    $("#moviePosterFigure").addClass("is-3by4");
    console.log("pHeight");
  }
})
// set movieposter size ends

// url parameters
let params = new window.URLSearchParams(window.location.search);
// url parameters ends

// page scroll
var position = 0; 

// should start at 0
$(window).scroll(function() {
    var scroll = $(window).scrollTop();
    if(scroll > position) {
      $("#searchForm").addClass("is-hidden-mobile is-hidden-tablet");
    } else {
      $("#searchForm").removeClass("is-hidden-mobile is-hidden-tablet");
    }
    position = scroll;
});
// page scroll ends

const jwtDecode = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

function setCookie(cname, cvalue, exdays) {
    // var d = new Date();
    // d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ exdays.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function shareLink(url){
  url = decodeURIComponent(url)
  const shareData = {
    title: "Share Link from MovieGrabber",
    url: url
  }
  if(navigator.share){
    navigator.share(shareData);
  }else{
    window.open(url);
  }
}
