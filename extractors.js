let mkv123 = {'url':'https://123mkv.report/'};
let pagalmovies = {'url':'https://www.pagalmovies.com.in/'};
let animelist = {'url':'https://anime-list.net/', 'types':['movie','series','anime']};
let skymoviesHD={'url':'https://skymovieshd.baby/'}
let moviesjoy={'url':'https://moviesjoy.pw/'}
// http://1hastidl.fun/

mkv123['extractor']={
    search:(text, page)=>{
        return new Promise((resolve, reject)=>{
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
                'link':data.querySelector('a[onclick="open_win()"]').href
            }]))
            .catch(error=>reject(error))
        })
    }
}
moviesjoy['extractor']={
    search:(text, page)=>{
        return new Promise((resolve, reject)=>{
            discover.getData(moviesjoy['url']+((page!=1 && page)?`page/${page}/`:'')+((text?`?s=${text}`:'')), 'HTML',{
                "headers": {
                    'user-agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0',
                    // 'referer':mkv123['url']
                }
            })
            .then(data=>{
                data = data.querySelectorAll('.latestpost.post');
                data = Array.from(data).map(record=>{
                    return {
                        'title':record.querySelector('a').title.replace('Permalink to ',''),
                        'link':record.querySelector('a').href+"?poster="+discover.fixedURIComponent(record.querySelector('img').src),
                        'poster':discover.fixedURIComponent(record.querySelector('img').src),
                        'id':record.querySelector('a').title,
                        'provider':'moviesjoy'
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
                data = data.querySelector('article.post');
                data={
                    'title':data.querySelector('.entry-title').innerText.trim(),
                    'url':url.split('?poster=')[0],
                    'poster':discover.fixedURIComponent(url.split('?poster=')[1]),
                    'descriptions':[...data.querySelector('.post-content').innerText.split('\n')].map(desc=>{
                        desc=desc.split(':');
                        return {'title':(desc[0])?desc[0].trim():'','content':(desc[1])?desc[1].trim():''}
                        }),
                    'downloads':[...data.querySelectorAll('iframe[src^="https://movies"]')].map(iframe=>{
                        return {'data':[{
                            "data":iframe.src,
                            "title":"Download"
                        }]}
                    }),
                    'provider':'moviesjoy'
                }
                resolve(data)
            })
            .catch(error=>reject(error))
        })
    },
    download:(data)=>{
        return new Promise((resolve, reject)=>{
            discover.getData(data,'HTML')
            .then(data=>{
                let title = data.querySelector('title').innerText;
                discover.getData(data.querySelector('iframe').src, 'HTML').then(video=>{
                    data=video.querySelector('video source').src;
                    resolve([{
                        'title':title,
                        'link':video.querySelector('video source').src
                    }])
                })
                .catch(error=>reject(error))
            })
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
                let poster=data.querySelector('.absmiddle').src;
                let downloadLinks=data.querySelectorAll('.fileName');
                data=data.querySelector('.Blue').querySelectorAll('.Fun');
                data={
                    'title':data[0].innerText.split(':')[1].trim(),
                    'url':url,
                    'poster':discover.fixedURIComponent(poster),
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
                                "data":record.href.replace(/\/file\//, '/server/'),
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
        console.log(data.replace(/\/movie\//gi, '/server/'))      
        return new Promise((resolve, reject)=>{
            discover.getData(data.replace(/\/movie\//gi, '/server/'), 'HTML')
            .then(data=>{
                data=[...data.querySelectorAll('.dwnLink')].map(link=>{return {'title':'Download', 'link':link.href}})
                resolve(data)
            })
            .then(error=>reject(error))
            // discover.uFetch(`${pagalmovies['url']}download/${data}/server_1`)
            // .then(response=>{
            //     resolve([{
            //         'title':'Download',
            //         'link':(response.ok)?`${pagalmovies['url']}download/${data}/server_1`:`${pagalmovies['url']}download/${data}/server_2`
            //     }])
            // })
            // .then(error=>reject(error))
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
        data=new URL(data);
        data=(!data.href.includes('?dir')?new URL('?dir='+data.pathname.replace('/', ''), data.origin).href:data);
        let host=data;
        return new Promise((resolve, reject)=>{
            discover.getData(data, 'HTML')
            .then(data=>{
                data=Array.from(data.querySelectorAll('a')).filter(link=>(/\.\w+$/gi).test(link.href)).map(link=>{
                    return {
                        'title':(((/(E[0-9]{1,3})/gi).test(link.href))?(/(E[0-9]{1,3})/gi).exec(link.href)[1]+' ':link.innerText.trim().split('\n')[0]),
                        'link':new URL(link.attributes['href'].value, host).href
                    }
                }).filter(link=>new URL(link.link).host==new URL(host).host);
                resolve(data)
            })
            .catch(error=>reject(error))
        })
    }
}
skymoviesHD['extractor']={
    search:(text, page)=>{
        return new Promise((resolve, reject)=>{
            console.log((text.length>4)?`${skymoviesHD['url']}search.php?search=${text}&cat=All`:skymoviesHD['url'])
            discover.getData((text.length>4)?`${skymoviesHD['url']}search.php?search=${text}&cat=All`:skymoviesHD['url'], 'HTML')
            .then(data=>{
                data = Array.from(data.querySelectorAll('a[href^="/movie/"]')).filter(link=>link.innerText.trim().length>5).map(link=>{
                    return {
                        'title':link.innerText.trim().substring(0,30),
                        'link':new URL(link.attributes['href'].value, skymoviesHD['url']).href,
                        'id':new URL(link.attributes['href'].value, skymoviesHD['url']).href,
                        'poster':'',
                        'provider':'skymoviesHD'
                    }
                })
                if(page){data=data.slice((page-1)*page, page*6)}
                console.log(data)
                resolve(data)
            })
            .catch(error=>reject(error))
        })
    },
    details:(url)=>{
        return new Promise((resolve,reject)=>{
            discover.getData(url, 'HTML')
            .then(data=>{
                data={
                    'title':data.querySelector('title').innerText.trim(),
                    'url':url,
                    'poster':data.querySelector('.movielist img').src,
                    'descriptions':Array.from(data.querySelectorAll('.Let')).filter(let=>(/:/gi).test(let.innerText)).map(record=>{
                        record=record.innerText;
                        return{
                            'title':record.split(':')[0],
                            'content':record.split(':')[1]
                        }
                    }),
                    'screenshots':Array.from(data.querySelectorAll('center img')).map(img=>img.src),
                    'downloads':[...data.querySelectorAll('a[href^="https://howblogs"]')].map(link=>{
                        return {
                            'data':[{'title':'Download','data':link.href}]
                        }
                    }),
                    'provider': 'skymoviesHD'
                }
                resolve(data)
            })
            .catch(error=>reject(error))
        })
    },
    download: (data)=>{
        let host=data;
        return new Promise((resolve, reject)=>{
                if(!data.includes('streamtape'|'strcloud')){
                    discover.getData(data, 'HTML')
                    .then(data=>{
                        data=[...data.querySelectorAll('.cotent-box a')].map(link=>link.attributes['href'].value)
                        console.log(data)
                    })
                    resolve([{'title':'Download', 'link':'data'}])
                }
            // discover.getData(data, 'HTML')
            // .then(data=>{
            //     data=Array.from(data.querySelectorAll('a')).filter(link=>(/\.\w+$/gi).test(link.href)).map(link=>{
            //         return {
            //             'title':(((/(E[0-9]{1,3})/gi).test(link.href))?(/(E[0-9]{1,3})/gi).exec(link.href)[1]+' ':link.innerText.trim().split('\n')[0]),
            //             'link':new URL(link.attributes['href'].value, host).href
            //         }
            //     }).filter(link=>new URL(link.link).host==new URL(host).host);
            //     console.log(data)
            //     resolve(data)
            // })
            // .catch(error=>reject(error))
        })
    }
}


let extractors=[mkv123, pagalmovies,animelist,moviesjoy]
