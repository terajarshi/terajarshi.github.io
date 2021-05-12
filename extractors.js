let mkv123 = {'url':'https://123mkv.kim/'};
let pagalmovies = {'url':'https://www.pagalmovies.cyou/'};
let animelist = {'url':'https://anime-list16.site/', 'types':['movie','series','anime']};
// http://1hastidl.fun/

mkv123['extractor']={
    search:(text, page)=>{
        return new Promise((resolve, reject)=>{
            console.log(page!=1 && page)
            discover.getData(mkv123['url']+((page!=1 && page)?`page/${page}/`:'')+((text?`?s=${text}`:'')), 'HTML',{
                "headers": {
                    'user-agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0',
                    // 'referer':mkv123['url']
                }
            })
            .then(data=>{
                data = (data.querySelectorAll('.latestPost.excerpt').length>0)?data.querySelectorAll('.latestPost.excerpt'):data.querySelectorAll('.post.status-publish');
                data = Array.from(data).map(record=>{
                    return {
                        'title':record.querySelector('a').title.replace('Permalink to ',''),
                        'link':record.querySelector('a').href,
                        'poster':discover.fixedURIComponent(record.querySelector('img').src),
                        'id':record.querySelector('a').title,
                        'provider':'mkv123'
                    }
                })
                resolve(data)
            })
            .catch(error=>reject(error))
        })
    },
    details:(url)=>{
        return new Promise((resolve, reject)=>{
            discover.getData(url, 'HTML')
            .then(data=>{
                data = data.querySelector('.post-single-content .thecontent')?data.querySelector('.post-single-content .thecontent'):data.querySelector('.post');
                ssurl=mkv123['url']+'screenshots/'+data.querySelector('input[name=fname]').value;
                data={
                    'title':data.querySelector('p img').alt.trim(),
                    'url':url,
                    'poster':discover.fixedURIComponent(data.querySelector('p img').src),
                    'descriptions':Array.from(data.querySelectorAll('p')).filter(record=>/:/gi.test(record.innerText)).slice(0,-1).map(record=>{
                        record=record.innerText;
                        return{
                            'title':record.split(':')[0],
                            'content':record.split(':')[1]
                        }
                    }),
                    'downloads':Array.from(data.querySelectorAll('form')).map(record=>{
                        return{
                            'data':[{
                                "data":discover.fixedURIComponent(`fname=${record.querySelector('input[name=fname]').value}&fsip=${record.querySelector('input[name=fsip]').value}`),
                                "title":record.querySelector('input[name=fname]').value
                            }]
                        }
                    }),
                    'screenshots':[discover.fixedURIComponent(ssurl+" 1 (1).jpg"),discover.fixedURIComponent(ssurl+" 1 (2).jpg"),discover.fixedURIComponent(ssurl+" 1 (3).jpg")],
                    'provider':'mkv123'
                }
                resolve(data)
            })
            .catch(error=>reject(error))
        })
    },
    download:(data)=>{
        return new Promise((resolve, reject)=>{
            discover.getData(mkv123['url']+"start-downloading/",'HTML',{
                "headers": {
                    "content-type": "application/x-www-form-urlencoded",
                    'referer':mkv123['url']
                },
                "body": decodeURIComponent(data)+"&x=40&y=30",
                "method": "POST"
            })
            .then(data=>resolve([{
                'title':'Download',
                'link':data.querySelector('meta[http-equiv="refresh"]').content.replace(/.*?url=/gi, '')
            }]))
            .catch(error=>reject(error))
        })
    }
}
pagalmovies['extractor']={
    search:(text, page)=>{
        return new Promise((resolve, reject)=>{
            discover.getData(pagalmovies['url']+((text)?`/mobile/search?find=${text}&per_page=${((page)?page:'1')}`:''), 'HTML')
            .then(data=>{
                data=data.querySelectorAll(((text)?'.M1':'.updates b'))
                data=Array.from(data).map(record=>{
                    return{
                        'title':record.querySelector('a').title,
                        'link':record.querySelector('a').href,
                        'poster':discover.fixedURIComponent(`${pagalmovies['url']}files/images/${record.querySelector('a').title.replaceAll(' ','_')}.jpg`),
                        'id':/movie\/(.*?)\//.exec(record.querySelector('a').href)[1],
                        'provider':'pagalmovies'
                    }
                })
                resolve(data)
            })
            .catch(error=>reject(error))
        })
    },
    details:(url)=>{
        return new Promise((resolve, reject)=>{
            discover.getData(url, 'HTML')
            .then(data=>{
                downloadLinks=data.querySelectorAll('.fileName');
                data=data.querySelector('.Blue').querySelectorAll('.Fun');
                data={
                    'title':data[0].innerText.split(':')[1].trim(),
                    'url':url,
                    'poster':discover.fixedURIComponent(`${pagalmovies['url']}files/images/${data[0].innerText.split(':')[1].trim().replaceAll(' ','_')}.jpg`),
                    'descriptions':Array.from(data).splice(1).map(record=>{
                        record=record.innerText;
                        return{
                            'title':record.split(':')[0],
                            'content':record.split(':')[1]
                        }
                    }),
                    'downloads':Array.from(downloadLinks).map(record=>{
                        return{
                            'data':[{
                                "data":record.href.match('\/file\/(.*?)\/')[1],
                                "title":record.innerText.match(/(.*)H/i)[1],
                                "info":/Size: (.*?[kmg]b)/i.exec(record.innerText)[1]
                            }]
                        }
                    }),
                    'provider':'pagalmovies'
                }
                resolve(data)
            })
            .catch(error=>reject(error))
        })
    },
    download:(data)=>{
        return new Promise((resolve, reject)=>{
            discover.uFetch(`${pagalmovies['url']}download/${data}/server_1`)
            .then(response=>{
                resolve([{
                    'title':'Download',
                    'link':(response.ok)?`${pagalmovies['url']}download/${data}/server_1`:`${pagalmovies['url']}download/${data}/server_2`
                }])
            })
            .then(error=>reject(error))
        })
    }
}
animelist['extractor']={
    search:(text, page)=>{
        return new Promise((resolve, reject)=>{
            let query=((text)?`&s=${text}`:'')+((page)?`&page=${page}`:'')
            let datas=Promise.all(animelist['types'].map(type=>discover.getData(`${animelist['url']}search?type=${type}${query}`, 'HTML')))
            datas.then(data=>{
                tempArray=[]
                data.forEach(data=>{Array.from(data.querySelectorAll('.row .col-lg')).forEach(records=>{tempArray.push(records)})});
                tempArray=tempArray.filter(record=>!(/هنوز آپلود نشده است/gim.test(record.innerText.trim()))).map(record=>{
                    return{
                        'title':record.querySelector('a').title,
                        'link':record.querySelector('a').href,
                        'poster':discover.fixedURIComponent(((/(no-poster|no_image)/gi.test(record.querySelector('img').src))?'':animelist['url']+record.querySelector('img').attributes['src'].value)),
                        'id':record.querySelector('a').href,
                        'provider':'animelist'
                    }
                })
                resolve(tempArray)
            })
            .catch(error=>reject(error))
        })
    },
    details: (url)=>{
        return new Promise((resolve, reject)=>{
            discover.getData(url, 'HTML')
            .then(data=>{
                data = {
                    'title':data.querySelector('.header-single__info h1').innerText.trim(),
                    'url':url,
                    'poster':discover.fixedURIComponent(animelist['url']+data.querySelector('.poster').attributes['src'].value),
                    'descriptions':[],
                    'downloads':[{
                        'data':Array.from(data.scripts).filter(script=>/p:(\d+)/.test(script.innerText))[0].innerText.match(/p2?:(\d+)/gi).join('&').replaceAll(":","="),
                        'title':data.querySelector('.header-single__info h1').innerText.trim()
                    }],
                    'provider':'animelist'
                }
                discover.animelistDownload(data.downloads[0]['data']).then(list=>{
                    data.downloads=list
                    resolve(data)
                })
            })
            .catch(error=>reject(error))
        })
    },
    download: (data)=>{
        return new Promise((resolve, reject)=>{
            if(/\.\w+$/gi.test(data)){
                resolve([{
                    'title':'Download',
                    'link':data
                }])
            }else{
                let url=data;
                discover.getData(data, 'HTML')
                .then(data=>{
                    data=Array.from(data.querySelectorAll('a.flex')).filter(link=>!/\?dir=/.test(link.href)).map(link=>{
                        return {
                            'title':(((/\.\w+$/gi).test(link.href))?(/S[0-9]{1,3}(E[0-9]{1,3})/gi).exec(link.href)[1]+' ':link.innerText.trim().split('\n')[0]),
                            'link':(link.pathname)?url.match(/https?:\/\/(.*?)\//gi)[0]+link.pathname.replace('/', ''):link.href
                        }
                    });
                    console.log(data)
                    resolve(data)
                })
                .catch(error=>reject(error))
            }
        })
    }
}



let extractors=[mkv123,pagalmovies,animelist]