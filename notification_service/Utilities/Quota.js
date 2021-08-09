
/**
 * @author Orchide Irakoze
 * 
 * @constructor Number of requests and Num of months
 * 
 * 
 * @example 1000 (requests) in 1 (month)
 * 
 * 
 * @class this is essentialy an Token Bucket implementation 
 * tweaked to limit and provision tokens (ie Number of requests)
 * on a monthly basis 
 * 
 * 
 */





class Quota {
    constructor(capacity, fillPerMonth) {
        this.capacity = capacity;
        this.fillPerMonth = fillPerMonth;

        this.lastFilled = Math.floor(new Date(Date.now()).getDate());
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
        const now = 30;
        const rate = (now - this.lastFilled) / this.fillPerMonth;

        this.tokens = Math.min(this.capacity, this.tokens + Math.floor(rate * this.capacity));
        this.lastFilled = now;
    }
}


module.exports = Quota; 