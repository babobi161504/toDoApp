const fs = require('fs')
const { Module } = require('module')
const { buffer } = require('stream/consumers')
const path = "./user.json"

function handleLogin(request, response) {
    const chunks = []
    request.on('data', chunk => {
        chunks.push(chunk)
        
    })
    request.on('end', ()=> {
        const reqData = JSON.parse(Buffer.concat(chunks).toString())
        fs.readFile(path, "utf8", (error, data) => {
            if(error) {
                console.log(error)
                response.statusCode = 500
                response.end("Internal server error")
                return
            }
            const users = JSON.parse(data)
            const user = users.find( u => 
                u.username=== reqData.username && u.password === reqData.password
            )
            if (user) {
                var token = `${user.username}.${user.password}`
                user.token =token
                const index = users.findIndex(u => u.username === user.username)
                users[index] = user
                fs.writeFile(path, JSON.stringify(users), (error) => {
                    if (error) {
                        console.log(error)
                        response.statusCode = 500
                        response.end("Internal server error")
                        return
                    }
                })
                response.statusCode = 200
                response.end(token)
                return
            }
            response.statusCode = 401
            response.end("Invalid username or password")
        })
    })
}
module.exports = {
    handleLogin
}