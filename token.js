predefinedToken = {"authorizationToken":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJmNjZlYjZiOS1mM2E3LTQwYmYtYjZiYy05YmNmMWY2MmI4ZTQiLCJzaXRlIjoiaG9pY2hvaXR2Iiwic2l0ZUlkIjoiN2ZhMGVhOWEtOTc5OS00NDE3LTk5ZjUtY2JiNTM0M2M1NTFkIiwiZW1haWwiOiJ0ZXJhamFyc2hpQGdtYWlsLmNvbSIsImlwYWRkcmVzc2VzIjoiNTAuMTYuMjQ5LjE4MCwgMTAuMTIwLjM1LjIyLCA1Mi41NS4yMzcuMTc5LCAxMzAuMTc2Ljk4LjEzOCIsImNvdW50cnlDb2RlIjoiVVMiLCJwb3N0YWxjb2RlIjoiMjAxNDkiLCJwcm92aWRlciI6InZpZXdsaWZ0IiwiZGV2aWNlSWQiOiJob2ktY2hvaS11bi1vZmZpY2lhbC1hLXAtaS0iLCJpZCI6ImY2NmViNmI5LWYzYTctNDBiZi1iNmJjLTliY2YxZjYyYjhlNCIsInBob25lTnVtYmVyIjoiKzkxOTAzODAxOTc5OSIsInBob25lQ29kZSI6OTEsImlhdCI6MTYwODMwMDEwNSwiZXhwIjoxNjA4OTA0OTA1fQ.oZ1Az-JqJsigxCv8YlIsESWmxB2eoSHg1xaM2Xn2hhY","refreshToken":"cf3a4a740636dc81fcd9b3483f096eb13aff1e91968313784ad027f3acc9b0e42d50d53df58283b49e9615d263332894","userId":"f66eb6b9-f3a7-40bf-b6bc-9bcf1f62b8e4","email":"terajarshi@gmail.com","name":" ","isSubscribed":true,"provider":"viewlift","passwordEnabled":true,"phoneNumber":"+919038019799","phoneCode":91};
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
