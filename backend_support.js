let corsHost='https://cors.bridged.cc/';
let corsHost2 = 'https://api.codetabs.com/v1/proxy?quest=';

let discover={
    uFetch: (url, options)=>{
        ui.showModal(`<progress class="progress is-primary" max="100">15%</progress>`);
        return new Promise((resolve, reject)=>{
            fetch(url, options)
            .then(response=>{resolve(response)})
            .catch(()=>{
                fetch(corsHost+url, options)
                .then(response=>resolve(response))
                .catch(()=>{
                    fetch(corsHost2+url, options)
                    .then(response=>resolve(response))
                    .catch(error=>reject(error))
                })
            })
        })
    },
    getData: (url, type, options)=>{
        return new Promise((resolve, reject)=>{
            discover.uFetch(url, options)
            .then(response=>(type=='HTML')?response.text():response.json())
            .then(data=>{
                if(type=='HTML'){
                    data=new DOMParser().parseFromString(data, "text/html");
                }
                ui.closeModal()
                resolve(data)
            })
            .catch(error=>{
                ui.closeModal()
                reject(error)
            })
        })
    },
    shareLink:(url)=>{
        url = decodeURIComponent(url)
        if(navigator.share){
            navigator.share({
                title: 'Share',
                text: 'Share this link from MovieGrabber',
                url: url,
              })
        }else{
            alert('Can\'t share')
        }
      },
    animelistDownload:(data)=>{
        return new Promise((resolve, reject)=>{
            discover.getData(`${animelist.url}ajax-dlink/?${data}`)
            .then(data=>{
                data=new DOMParser().parseFromString(data['data'], 'text/html');
                if(data.querySelector('div[class^="download-box"]') && data.querySelector('div[class^="download-box"]').classList.contains('download-box__series')){
                    data=Array.from(data.querySelectorAll('.item__link'));
                    let season=Array.from(new Set(data.map(season=>{
                        season = season.href.match(/\/(S[0-9]{1,3})\//)[1];
                        return season
                    })))
                    season=season.map(season=>{
                        return {
                            'heading':season,
                            'data':data.filter(link=>new RegExp(season).test(link)).map(link=>{
                                return {
                                    'title':(((/\.\w+$/gi).test(link.href))?(/S[0-9]{1,3}(E[0-9]{1,3})/gi).exec(link.href)[1]+' ':'')+link.innerText.trim(),
                                    'data':link.href
                                }
                            })
                        }
                    })
                    console.log(season)
                    resolve(season)
                }else{
                    data=Array.from(data.querySelectorAll('.info')).map(info=>{
                        return {
                            'data':[{
                                'title':info.querySelector('.info__quality').innerText,
                                'data':info.querySelector('a').href,
                                'info':Array.from(info.querySelectorAll('.info__value')).map(info=>info.innerText).join(" ")
                            }]
                        }
                    })
                    resolve(data)
                }
            })
            .catch(error=>reject(error))
        })
    },
    arraySort:( array )=>{
        array.sort(() => Math.random() - 0.5);
       },
    fixedURIComponent:(str)=>{
        return encodeURI(str).replace(/[!'()*]/g, function(c) {
            return '%' + c.charCodeAt(0).toString(16);
          });
    }

}


