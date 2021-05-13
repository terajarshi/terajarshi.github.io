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
                data=new DOMParser().parseFromString(data['data'], 'text/html').querySelectorAll('a');
                data=Array.from(new Set(Array.from(data).filter(link=>(/(Anime|Movie|Series)\//gi).test(link.href) && !(/[#]/gi).test(link.href) || (/\.\w+$/gi).test(link.href)).map(link=>{
                    return (/\.\w+$/gi).test(link.href)?link.href.match(/^.*\//gi)[0]:link.href;
                })))
                let groups = Array.from(new Set(data.filter(link=>(/[174][0-9]{0,3}p.\w+/gi).test(link)).map(link=>link.match(/[174][0-9]{0,3}p.\w+/gi))))
                if(groups.length>0){
                    data=groups.map(group=>{
                        return {
                            'heading':decodeURIComponent(group),
                            'data':data.filter(link=>new RegExp(group).test(link)).map(link=>{
                                return {
                                    'data':link,
                                    'title':decodeURIComponent(link).match(/(S[0-9]{1,3})|([^\/]+\/?$)/gi)[0].replaceAll('/', '')
                                }
                            })
                        }
                    })       
                }else{
                    data=data.map(link=>{
                        return {
                            'data':[{'data':link, 'title':decodeURIComponent(link).match(/[^\/]+\/?$/gi)[0].replaceAll('/', '')}]
                        }
                    })
                }
                resolve(data)
            })
            .catch(error=>reject(error))
        })
    },
    arraySort:( array )=>{
        array.sort(() => Math.random() - 0.5);
       },
    fixedURIComponent:(str)=>{
        return str.replace(/[()]/g, function(c) {
            return '%' + c.charCodeAt(0).toString(16);
          });
    }

}



