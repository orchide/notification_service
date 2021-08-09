const TokenBucket = require("../Utilities/Limiter");
const ErrorResponse = require("../Utilities/ErrorResponse");
const Quota = require("../Utilities/Quota");

const Redis = require("ioredis");
const redis = new Redis('redis')




/**
 *
 * @author Orchide Irakoze SR
 *
 * this is our ratelimiter
 *
 * it takes in the following parameters
 *
 * @param {Num of requests per given time} perSecond
 * @param { Length of time before we reload the Bucket } maxBurst
 *
 *
 * Initialize two buckets , one for rate limiting and another for
 * monthly Quotas
 *
 * we map each user's identity optained from redis
 * to their buckets
 *
 *
 * @returns middleware function that checks if the buckets
 * are empty before letting us continue to the route that allows
 * us to send our messages
 */

function limitRequests(perSecond, maxBurst) {
  const buckets = new Map();
  const quotas = new Map();

  // Return an Express middleware function
  return function limitRequestsMiddleware(req, res, next) {
    redis.get(req.headers.id, (err, data) => {
      if (err) res.status(500).send({ error: "Internal server error" });

      if (
        data !== null &&
        data !== "admin" &&
        data !== "publisher" &&
        data !== "none"
      ) {
        // check if user's id exist in the map
        if (!buckets.has(req.headers.id) && !quotas.has(req.headers.id)) {
          //if user doesn't exist we map their id to a bucket
          quotas.set(req.headers.id, new Quota(4, 1));

          buckets.set(req.headers.id, new TokenBucket(perSecond, maxBurst));
        }

        /**
         * incase
         * user matches a certain criterion , an admin in this case
         *
         * we offer them a bigger monthly quota and an extended rate
         */
      } else if (data === "admin") {
        if (!buckets.has(req.headers.id) && !quotas.has(req.headers.id)) {
          quotas.set(req.headers.id, new Quota(40, 1));

          buckets.set(req.headers.id, new TokenBucket(10, 60));
        }
      }

      const bucketForRate = buckets.get(req.headers.id);
      const bucketForQuota = quotas.get(req.headers.id);

      if (bucketForRate.take() && bucketForQuota.take()) {
        next();
      } else {
        res.status(429).send({
          error: `Client ${
            !bucketForQuota.take() ? "Quota" : "rate"
          } limit exceeded`,
        });
      }
    });
  };
}

module.exports = limitRequests;
