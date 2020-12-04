// aToken = "https://prod-api.viewlift.com/identity/anonymous-token?site=hoichoitv";
aToken = "test/hAtoken.json"
function save_aToken() {
    console.log("step 1");
    fetch(aToken)
        .then(response => response.json())
        .then(result => {
            var anonymous = result.authorizationToken;
            var parsedToken = parseJwt(anonymous);
            var exp = new Date(parsedToken.exp * 1000);
            setCookie("anonymousToken", anonymous, exp);
        })
        .catch(error => function(error){
            console.log(error);
        });
}
console.log(save_aToken());


var anonymousToken = getCookie("anonymousToken");

function getAToken() {
    var d = new Date();
    if (anonymousToken != "") {
        var parsedToken = parseJwt(anonymousToken);
        var exp = new Date(parsedToken.exp * 1000);
        
        if (exp > d) {
            console.log("Anonymous Token found and it is in good condition");
            anonymousToken = getCookie("anonymousToken");
        } 
        
        
        else {
            console.log("Anonymous token needs to be generated because the token is expired.");
            save_aToken();
            anonymousToken = getCookie("anonymousToken");
        }
    } 
    
    
    
    else {
        console.log("Anonymous Token needs to generated because there was no token");
        save_aToken();
        anonymousToken = getCookie("anonymousToken");
        // return anonymousToken;
    }
    
    return anonymousToken;
}



// console.log(getAToken());