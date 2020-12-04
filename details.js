if(!params.has("page") && !params.has("search")){
    h_getPageContents(h_homepage);
}else if(params.get("provider") == "hoichoi" && params.has("permalink")){
    // console.log(params.get("permalink"))
    // getDetails(detailsUrl+params.get("permalink"));
    let detailsUrl = `https://prod-api-cached-2.viewlift.com/content/pages?path=${params.get("permalink")}&site=hoichoitv&includeContent=true&moduleOffset=0&moduleLimit=4&languageCode=default&countryCode=IN`;
    getDetails(detailsUrl);
}else if(params.has("search")){
    // console.log(params.get("search"));
    h_search(params.get("search"));
}

window.dpaddebug.toggleDebugMode();
