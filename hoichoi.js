let h_homepage = "https://prod-api-cached-2.viewlift.com/content/pages?path=%2F&site=hoichoitv&includeContent=true&moduleOffset=0&moduleLimit=4&languageCode=default&countryCode=IN";
// let h_homepage = "test/page.json"
function h_getPageContents(url){
    $.getJSON(url, function(data){
        // console.log(data)
        let container = `
            <ul class="searchResult has-text-centered">
            </ul>`;
        $(".mainSection").append(container)
        // console.log(data.modules);
        $(data.modules).each(function(keyA, valA){
            // console.log(valA.title);
            if(valA.title){
                var mTitle = valA.title;
                $(valA.contentData).each(function(keyB, valB){
                    // console.log(valB);
                    var gist = valB.gist;
                    var permalink = gist.permalink;
                    var image = '';
                    if (gist.imageGist._3x4){
                        image = gist.imageGist._3x4;
                    }
                    var title = gist.title;

                    var content = `
                    <li class="reel">
                        <a href="?page=details&provider=hoichoi&permalink=${permalink}">
                            <div style="background-image: url(${image});">
                                <div class="blurTheSpot"></div>
                                <p class="reelText">${title}<br> <b>Hoichoi</b></p>
                            </div>
                        </a>
                    </li>
                    `;
                    $(".searchResult").append(content);
                })
            }
        })
    })
}

function h_search(keyword){
    let searchUrl = `https://prod-api-cached-2.viewlift.com/search/v1?site=hoichoitv&searchTerm=${keyword}&types=VIDEO,SERIES&languageCode=default`;
    let container = `
        <ul class="searchResult has-text-centered">
        </ul>`;
    $(".mainSection").append(container)
    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(function(searches){
                // console.log(searches);
                if(searches.drmEnabled==false && searches.gist.contentType == "VIDEO" || searches.gist.contentType == "SERIES"){
                    console.log(searches);
                    // console.log(valB);
                    var gist = searches.gist;
                    var permalink = gist.permalink;
                    var image = '';
                    if (gist.imageGist._3x4){
                        image = gist.imageGist._3x4;
                    }else if (gist.imageGist._16x9){
                        image = gist.imageGist._16x9;
                    }else{
                        var image = "assets/hoichoi_no_poster.jpg"
                    }

                    var title = gist.title;

                    var content = `
                    <li class="reel">
                        <a href="?page=details&provider=hoichoi&permalink=${permalink}" class="dpad-focusable" tabindex="0">
                            <div style="background-image: url(${image});">
                                <div class="blurTheSpot"></div>
                                <p class="reelText">${title}<br> <b>Hoichoi</b></p>
                            </div>
                        </a>
                    </li>
                    `;
                    $(".searchResult").append(content);
                }
            })
        })
}

function getDetails(url){
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            if(data.modules){
                $(data.modules).each(function(key1, val1){
                    if(val1.moduleType == "ShowDetailModule" || val1.moduleType == "VideoDetailModule"){
                        // console.log(val1.contentData);
                        let gist = val1.contentData[0].gist;
                        // console.log(gist);
                        var imgsize = "3by4";
                        if (gist.imageGist._3x4){
                            var image = gist.imageGist._3x4;
                        }else if(gist.imageGist._16x9){
                            var image = gist.imageGist._16x9;
                            imgsize="4by3";
                        }else if(gist.posterImageUrl){
                            var image = gist.posterImageUrl;
                        }else{
                            var image = "assets/hoichoi_no_poster.jpg"
                        }
                        var title = gist.title;
                        var description = gist.description;
                        var dButton = '';
                        if(gist.contentType == "VIDEO"){
                            dButton = `<li><a onclick="downloadHoichoi('${gist.id}')" class="allActions">Downloads</a></li>`;
                        }
                        let html1 = `<div class="columns is-marginless">
                                        <div class="column moviePoster is-one-third is-paddingless">
                                            <a onclick="window.history.back();" class="has-text-white backButton">
                                                &#x2190;
                                            </a>
                                            <figure class="image is-${imgsize}" id="moviePosterFigure" style="background-image: url(${image});"></figure>
                                            <div class="blurTheSpot2"></div>
                                            <p class="movieName">${title} <br> <b>Hoichoi</b></p>
                                        </div>
                                        <div class="column is-vcentered">
                                            <div class="movieInformation">
                                                <p class="has-text-white">${description}</p><br>
                                                <ul id="movieInfo">
                                                ${dButton}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>`;
                            $(".mainSection").append(html1);
                        if(val1.contentData[0].creditBlocks.length > 0){
                            var creditBlocks = val1.contentData[0].creditBlocks;
                            // console.log(creditBlocks);
                            creditBlocks.forEach(function(i2){
                                // console.log(v2);
                                if(i2.credits.length > 0){
                                    let infos = '';
                                    infos += `<li class="infoName">${i2.title}</li>`
                                    i2.credits.forEach(function(i3){
                                        infos += `<li class="infoDetails">${i3.title}</li>`;
                                    })
                                    $("#movieInfo").append(infos);
                                }
                            })
                        }
                        if(!val1.contentData[0].seasons && val1.contentData[0].series){
                            let series = val1.contentData[0].series[0].gist;
                            // console.log(series);
                            let seasonDetails = `<div class="seasonDetails">
                            <ul class="episodesList has-text-centered">
                                <li class="reel">
                                    <a href="?page=details&provider=hoichoi&id=${series.id}&permalink=${series.permalink}" class="reelLink">
                                        <div style="background-image: url(${series.imageGist._16x9});">
                                            <div class="blurTheSpot"></div>
                                            <p class="reelText"><b>${series.title}</b></p>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>`;
                            $(".mainSection").append(seasonDetails);  
                        }

                        if(val1.contentData[0].seasons){
                            var seasons = val1.contentData[0].seasons;
                            let seasonDetails = `<div class="seasonDetails">
                                        </div>`;
                            $(".mainSection").append(seasonDetails);                            
                            seasons.forEach(function(season){
                                // console.log(season);
                                let episodeCounter = 1;
                                let episodeListLi = '';
                                season.episodes.forEach(function(episode){
                                    // console.log(episode);
                                    let episodeLi = `
                                    <li class="reel">
                                        <a href="?page=details&provider=hoichoi&id=${episode.id}&permalink=${episode.gist.permalink}" class="reelLink">
                                            <div style="background-image: url(${episode.gist.videoImageUrl});">
                                                <div class="blurTheSpot"></div>
                                                <p class="reelText"><b>${episodeCounter}: ${episode.title}</b> <br> ${episode.gist.description}</p>
                                            </div>
                                        </a>
                                    </li>`;
                                    episodeListLi+=episodeLi;
                                    episodeCounter++;
                                })
                                // console.log(episodeListLi);
                                let episodeList = `
                                <h3 class="title is-5 has-text-white" style="margin: 1.5rem;">${season.title}</h3>
                                <p class="has-text-white" style="margin: 1.5rem;">${season.description}</p>
                                <ul class="episodesList has-text-centered">
                                ${episodeListLi}
                                </ul>`;
                                $(".seasonDetails").append(episodeList);
                            })
                        }
                    }
                })
            }else{
                alert("Something is wrong");
                window.location.href="/index.html";
            }
        })
        // .then(error => {
        //     alert(error);
        // })
};

function downloadHoichoi(id){
    let token = {'token':''};
    getToken(data => {
        authorizationToken = data.authorizationToken || data.authorization_Token;
        token.token=authorizationToken;
    });

    fetch(`https://prod-api.viewlift.com/entitlement/video/status?id=${id}`, {
        method: 'GET',
        headers: {
            'authorization' : token.token,
        }
    })
    .then(response => response.json())
    .then(data => {
        // console.log(data.video.streamingInfo.videoAssets);
        let videos = data.video.streamingInfo.videoAssets;
        let buttons = '';
            buttons += `<a class="button is-small is-fullwidth is-dark" href="${videos.hls.replace("https", "intent")}#Intent;action=android.intent.action.VIEW;scheme=http;type=application/vnd.apple.mpegurl;end">Stream Online</a><br>
            <button class="button is-small is-fullwidth is-dark" onclick="shareLink('${encodeURIComponent(videos.hls)}')">Share - Stream Online</button><br>`;

        videos.mpeg.forEach(function(mpegVideos){
            buttons += `<a class="button is-small is-fullwidth is-dark" href="${mpegVideos.url.replace("https", "intent")}#Intent;action=android.intent.action.VIEW;scheme=http;type=video/mp4;end">${mpegVideos.renditionValue.replace('_', '')}</a><br>
            <button class="button is-small is-fullwidth is-dark" onclick="shareLink('${encodeURIComponent(mpegVideos.url)}')">Share - ${mpegVideos.renditionValue.replace('_', '')}</button><br>`;
        })
        let contentsToBeAdded = `
                    <div class="modal is-active" id="linksModal" style="z-index: +999999;">
                        <div class="modal-background"></div>
                        <div class="modal-card" style="padding-left: 1.5rem; padding-right: 1.5rem;">
                            <header class="modal-card-head">
                                <p class="modal-card-title">Download</p>
                                <button class="delete" onclick='$("#linksModal").toggleClass("is-active")'></button>
                            </header>
                            <section class="modal-card-body">
                            ${buttons}
                            </section>
                        </div>
                    </div>;`
        $(".mainSection").append(contentsToBeAdded);
    })
}
