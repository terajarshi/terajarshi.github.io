function autosearch(search, voice){
    discover.uFetch('http://www.omdbapi.com/?apikey=fd161998&s='+search)
    .then(response=>response.json())
    .then(data=>{
        if(voice){
            document.querySelector('#search').querySelector('input').value=(data['Response']=='True')?data['Search'][0]['Title']:'No results found';
        }
        if(data['Response']=='True'){
            document.querySelector('#autocomplete').innerHTML=
            data['Search'].map(movie=>{
                return `<option value="${movie['Title']}">`
            }).slice(0,6).join('')
        }
        
    })
}

window.addEventListener('DOMContentLoaded', ()=>{
    const searchForm=document.querySelector('#search');
    const mic= searchForm.querySelector('#mic')
    const search=searchForm.querySelector('input');
    search.addEventListener('change', ()=>{
        autosearch(search.value)
    })
    search.addEventListener('keyup', ()=>{
        autosearch(search.value)
    })
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(SpeechRecognition){
        mic.parentNode.classList.remove('is-hidden')
        let recognition=new SpeechRecognition();
        recognition.continuous=false;
        mic.onclick=()=>{
            recognition.start()
            recognition.onstart=()=>document.querySelector('#search').querySelector('input').value="Speak to search...";
            recognition.onsoundstart=()=>document.querySelector('#search').querySelector('input').value="Started Listening...";
            recognition.onsoundend=()=>document.querySelector('#search').querySelector('input').value="Trying to recognise...";
            recognition.onresult = (result)=>{
                autosearch(result['results'][0][0]['transcript'], 'True')
                if(result['results'][0][0]){searchForm.submit()}
                recognition.stop();
            }
            recognition.abort=document.querySelector('#search').querySelector('input').value='';
            recognition.onerror=document.querySelector('#search').querySelector('input').value='';
            recognition.onnomatch=document.querySelector('#search').querySelector('input').value='';
            recognition.onend=document.querySelector('#search').querySelector('input').value='';
        }
    }

})

// window.addEventListener('DOMContentLoaded', ()=>{
//     const voiceSearch=docment.querySelector('#voiceSearch');
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if(typeof SpeechRecognition === 'undefined'){
//         voiceSearch.remove()
//     }else{

//     }
// })

// let speechRecognition=new webkitSpeechRecognition();
// speechRecognition.onresult=console.log;
// speechRecognition.start()