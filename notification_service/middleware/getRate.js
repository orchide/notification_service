const redis = require('redis')
const fetch = require('node-fetch')



const client = redis.createClient(process.env.REDIS_PORT)



 async function getRate() {


    const userId = req.headers.id ; 



    
      const user = await fetch(`http://localhost:8080/api/v1/user/${userId}`)
      const results = await user.json();


      const limit = results.data[0].request_per_second

      client.setex(userId , 3600 , limit)

   return 1


}


  module.exports = getRate ;