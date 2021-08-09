/**
 * @author Orchide Irakoze
 * 
 * @constructor Number of requests and Num of months
 * 
 * 
 * @example 20 (requests) in 60 (seconds)
 * 
 * 
 * @class this is essentialy an Token Bucket implementation 
 * tweaked to limit and provision tokens (ie Number of requests)
 * on a monthly basis 
 * 
 * 
 */




class TokenBucket {



    constructor(capacity, fillPerSecond) {
        this.capacity = capacity;
        this.fillPerSecond = fillPerSecond;

        this.lastFilled = Math.floor(Date.now() / 1000);
        this.tokens = capacity;
    }

    take() {
        // Calculate how many tokens (if any) should have been added since the last request
        this.refill();

        if (this.tokens > 0) {
            this.tokens -= 1;
            return true;
        }

        return false;
    }

    refill() {
        const now = Math.floor(Date.now() / 1000);
        const rate = (now - this.lastFilled) / this.fillPerSecond;

        this.tokens = Math.min(this.capacity, this.tokens + Math.floor(rate * this.capacity));
        this.lastFilled = now;
    }
}

module.exports = TokenBucket;