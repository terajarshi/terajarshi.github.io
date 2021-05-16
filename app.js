if("serviceWorker" in navigator){
  navigator.serviceWorker.register("service-worker.js")
}
// url parameters
let params = new window.URLSearchParams(window.location.search);
// url parameters ends
function showResults(text, page){
  data=Promise.all(extractors.map(extractor=>{return extractor['extractor'].search(text,page)}))
  data.then(data=>{
    tempArray=[];
    ui.showModal(`<progress class="progress is-primary" max="100">15%</progress>`);
    data.forEach(movies => {
      movies.forEach(movie=>tempArray.push(ui.poster(movie)))
    });
    tempArray.sort(() => Math.random() - 0.5);
    document.querySelector('.searchResult').innerHTML+=(tempArray.length>0)?tempArray.join(''):'No results found'
    ui.closeModal()
  }).catch(error=>
    ui.showModal(error))
}
function searchResults(text){
  let page=1;
  showResults(text,page);
  window.addEventListener('scroll',()=>{
    if((window.scrollY+window.outerHeight) >= document.body.scrollHeight) {
      page+=1;
      showResults(text,page);
    }
  })
}
function downloader(provider, data, title){
  eval(`${provider}`)['extractor'].download(data)
  .then(data=>{
    data= data.map(link=>{
      return `<div class="field has-addons">
          <p class="control is-expanded">
              <a href="${link.link}" class="button is-fullwidth is-small is-dark" download>${link.title}</a>
          </p>
          ${navigator.share?`<div class="control"><button onclick="discover.shareLink('${link.link}')" class="button is-small is-info"><span class="icon is-small"><i class="fas fa-share"></i></span></button></div>`:''}
          <div class="control"><a href="${link.link.replace(/https?/gi, 'intent')}#Intent;action=android.intent.action.VIEW;scheme=http;type=video/mp4;S.title=${(title)?title:link.title};S.browser_fallback_url=${link.link};end;" class="button is-small is-warning"><span class="icon is-small"><i class="fas fa-play"></i></span></a></div>
      </div>`
    }).join('')
    ui.showModal(data, 'card')
  })
  .catch(error=>{
    ui.showModal('Error: '+error, 'card')
  })
}
function updateMeta(data){
  let tags = `<meta property="og:title" content="${(data['title'])?data['title']:'Home'} - Movie Grabber">
  <meta property="og:site_name" content="MovieGrabber">
  <meta property="og:url" content="${window.location.href}">
  <meta property="og:description" content="${(data['descriptions'])?data['descriptions'].map(description=>description['content']+':'+description['content']).join(' '):''}">
  <meta property="og:type" content="video.movie">
  <meta property="og:image" content="${(data['poster'])?data['poster']:''}">
  <meta name="title" content="${(data['title'])?data['title']:''}">
  <meta name="description" content="${(data['descriptions']?data['descriptions'].map(description=>description['content']+':'+description['content']).join(' '):'')}">
  <meta name="keywords" content="${(data['descriptions']?data['descriptions'].map(description=>description['content']).join():'')}">
  <meta name="robots" content="index, follow">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="language" content="English">
  <meta name="author" content="${(data['provider'])?data['provider']:'Terajarshi'}">`
  document.querySelector('head').innerHTML+=tags;
  document.querySelector('head title').innerHTML=`${(data['title'])?data['title']:'Home'} - Movie Grabber`;
}

if(!params.has("page") && !params.has("search")){
  searchResults('')
  let data={'title':'Home', 'descriptions':[{'content':'Search For Movies and Series and Anime for free'}]}
  updateMeta(data)
}
if(!params.has("page") && params.has("search")){
  searchResults(params.get('search'))
  let data={'title':'Search', 'descriptions':[{'content':params.get('search')}]}
  updateMeta(data)
}
if(params.has("page") && params.has("provider") && !params.has("search")){
  // document.querySelector('.navbar').classList.add('is-hidden');
  // document.querySelector('html').classList.remove('has-searchbar-fixed-top')
  // document.querySelector('html').classList.remove('has-navbar-fixed-top')
  eval(params.get('provider'))['extractor'].details(params.get('permalink'))
  .then(data=>{
    document.querySelector('.mainSection').innerHTML=ui.showMovie(data);
    updateMeta(data)
  })
}

