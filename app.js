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
function downloader(provider, data){
  eval(`${provider}`)['extractor'].download(data)
  .then(data=>{
    data= data.map(link=>{
      return `<div class="field has-addons">
          <p class="control is-expanded">
              <a href="${link.link}#Intent;action=android.intent.action.VIEW;scheme=http;type=video/mp4;end" class="button is-fullwidth is-small is-dark">${link.title}</a>
          </p>
          <div class="control"><button onclick="discover.shareLink('${link.link}')" class="button is-small is-info"><span class="icon is-small"><i class="fas fa-share"></i></span></button></div>
      </div>`
    }).join('')
    ui.showModal(data, 'card')
  })
  .catch(error=>{
    ui.showModal('Error: '+error, 'card')
  })
}


if(!params.has("page") && !params.has("search")){
  searchResults('')
}
if(!params.has("page") && params.has("search")){
  searchResults(params.get('search'))
}
if(params.has("page") && params.has("provider") && !params.has("search")){
  // document.querySelector('.navbar').classList.add('is-hidden');
  // document.querySelector('html').classList.remove('has-searchbar-fixed-top')
  // document.querySelector('html').classList.remove('has-navbar-fixed-top')
  eval(params.get('provider'))['extractor'].details(params.get('permalink'))
  .then(data=>{
    document.querySelector('.mainSection').innerHTML=ui.showMovie(data);
  })
}

