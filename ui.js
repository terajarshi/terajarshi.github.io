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
let ui = {
  showModal:(data, type)=>{
    let modal = document.querySelector('#modal');
    if(type=='card'){
      modal.innerHTML=`
      <div class="modal-background"></div>
        <div class="modal-card" style="padding-left: 1.5rem; padding-right: 1.5rem;">
          <header class="modal-card-head">
              <p class="modal-card-title">Download</p>
              <button class="delete" onclick='ui.closeModal()'></button>
          </header>
          <section class="modal-card-body">
          ${data}
          </section>
        </div>
      </div>`
    }else{
      modal.innerHTML=`
      <div class="modal-background"></div>
        <div class="modal-content" style="padding-left: 1.5rem; padding-right: 1.5rem;">
          ${data}
        </div>
      </div>`
    }
    modal.classList.add('is-active');
  },
  closeModal:()=>{
    document.querySelector('#modal').classList.remove('is-active');
  },
  showMovie:(data)=>{
    return `<div class="columns is-multiline" style="margin:0 auto !important;">
        <div class="column moviePoster is-one-quarter is-paddingless is-narrow">
            <a onclick="window.history.back();" class="has-text-white backButton">
                &#x2190;
            </a>
            <figure class="image is-3by4" id="moviePosterFigure" style="background-image: url('${data['poster']}');"></figure>
            <div class="blurTheSpot2"></div>
            <p class="movieName">${data['title']} <br> <b>${data['provider']}</b></p>
        </div>
        <div class="column is-vcentered is-narrow">
            <div class="movieInformation">
                <p class="has-text-white"></p><br>
                <ul id="movieInfo">
                ${data['descriptions'].map(description=>`<li class="infoName">${description['title']}</li><li class="infoDetails">${description['content']}</li>`).join('')}

                </ul>
            </div>
        </div>
        <div class="column is-vcentered is-full">
            <div class="movieInformation">
                <p class="has-text-white"></p><br>
                <ul id="movieInfo">
                <li class="infoName">Downloads: </li>
                ${data['downloads'].map(download=>{
                  let preloadDom=(download['heading'])?`<br><li class="infoName">${download['heading']}</li>`:'';
                  preloadDom+=download['data'].map(link=>`<li><button onclick="downloader('${data['provider']}','${link['data']}')" class="allActions">${link['title']}</button></li>`).join(' ')
                  return preloadDom
                }).join(' ')}                          
                </ul>
            </div>
        </div>
        <p class="text has-text-centered"><a href="${data['url']}">***Visit source Page***</a></p>
    </div>`;
  },
  poster:(data)=>{
      return `<li class="reel">
                  <a href="?page=details&provider=${data['provider']}&permalink=${data['link']}" class="dpad-focusable" tabindex="0">
                      <div style="background-image: url(${data['poster']});">
                          <div class="blurTheSpot"></div>
                          <p class="reelText">${data['title']}<br> <b>${data['provider']}</b></p>
                      </div>
                  </a>
              </li>`
  }
}
