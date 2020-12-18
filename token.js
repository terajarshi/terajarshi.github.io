predefinedToken = {"expiration":1607664328000,"authorizationToken":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJmNjZlYjZiOS1mM2E3LTQwYmYtYjZiYy05YmNmMWY2MmI4ZTQiLCJzaXRlIjoiaG9pY2hvaXR2Iiwic2l0ZUlkIjoiN2ZhMGVhOWEtOTc5OS00NDE3LTk5ZjUtY2JiNTM0M2M1NTFkIiwiZW1haWwiOiJ0ZXJhamFyc2hpQGdtYWlsLmNvbSIsImlwYWRkcmVzc2VzIjoiMjQwMTo0OTAwOjNhMjQ6YWZhNjphMDkzOmUzNGI6ZDViNDpkYTg2LCAxMC4xMjAuMzUuMjIsIDM0LjIwNS4xMzcuMjA0LCAxMzAuMTc2Ljk4Ljc2IiwiY291bnRyeUNvZGUiOiJJTiIsInByb3ZpZGVyIjoidmlld2xpZnQiLCJkZXZpY2VJZCI6ImJyb3dzZXItMjI0ODU2YTItY2RiOC01YTE3LWMwZDItMjA0OTk4OWE1ZjBjIiwiaWQiOiJmNjZlYjZiOS1mM2E3LTQwYmYtYjZiYy05YmNmMWY2MmI4ZTQiLCJwaG9uZU51bWJlciI6Iis5MTkwMzgwMTk3OTkiLCJwaG9uZUNvZGUiOjkxLCJpYXQiOjE2MDcwNTk1MjgsImV4cCI6MTYwNzY2NDMyOH0.mRi4NlkrtA4Kdk9QiuIv9D9uUPU6xRuUeJ_4cZYbB4o","refresh_token":"fef40a43c4a2d6d1730c22ba8fcbbc5b3aac075bbcf4b0b41489c76704d69e4ded3b6cc55739ef36e16a938065ce62e6","duration":604798593};
// console.log(predefinedToken.refreshToken)

function getExpiration(token){
    var authToken = jwtDecode(token);
    var tokenExp = authToken.exp;
    var date = new Date(tokenExp * 1000);
    return date
}

function getToken(cb){
    let savedToken = window.localStorage.getItem('token')
    let tokenData = savedToken ? JSON.parse(savedToken) : {}
    return new Promise((resolve, reject) => {
        if(!savedToken){
            // console.log("adding Token to localstorage");
            var tokenExpiryTime = getExpiration(predefinedToken.authorizationToken)
            tokenData = {
            expiration: tokenExpiryTime.getTime(),
            authorizationToken: predefinedToken.authorizationToken,
            refreshToken: predefinedToken.refresh_token || predefinedToken.refreshToken,
            duration: tokenExpiryTime.getTime() - new Date().getTime()
            }
            window.localStorage.setItem('token', JSON.stringify(tokenData))
        }
        if(tokenData.authorizationToken){
            var now = new Date().getTime();
            if(now < tokenData.expiration){
                if(cb) cb(tokenData)
                resolve(tokenData)
                return
            }
        }
        
        if(tokenData.refreshToken){
            // console.log("refreshing Token");
            let refreshToken = tokenData.refresh_token || tokenData.refreshToken;
            fetch(`https://prod-api.viewlift.com/identity/refresh/${refreshToken}`)
            .then(response => response.json())
            .then(data => {
                var tokenExpiryTime = getExpiration(data.authorization_Token || data.authorizationToken)
                tokenData = {
                    expiration: tokenExpiryTime.getTime(),
                    authorizationToken: data.authorization_Token || data.authorizationToken,
                    refreshToken: data.refresh_token || data.refreshToken,
                    duration: tokenExpiryTime.getTime() - new Date().getTime()
                    }
                window.localStorage.setItem('token', JSON.stringify(tokenData))
                if(cb) cb(tokenData)
                resolve(tokenData)
            })
            .then(error => reject(error))
            return
        }   
    })
}

// console.log(token)
