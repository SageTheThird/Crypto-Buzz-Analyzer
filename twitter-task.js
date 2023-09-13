const Twitter = require('./adapters/twitter/twitter.js');
const { fetchTrendingCoins } = require('./helpers/coingecko');

const { Web3Storage } = require('web3.storage');
const dotenv = require('dotenv');
const { default: axios } = require('axios');
dotenv.config();

/**
 * TwitterTask is a class that handles the Twitter crawler and validator
 *
 * @description TwitterTask is a class that handles the Twitter crawler and validator
 *              In this task, the crawler asynchronously populates a database, which is later
 *              read by the validator. The validator then uses the database to prepare a submission CID
 *              for the current round, and submits that for rewards.
 *
 *              Four main functions control this process:
 *              @crawl crawls Twitter and populates the database
 *              @validate verifies the submissions of other nodes
 *              @getRoundCID returns the submission for a given round
 *              @stop stops the crawler
 *
 * @param {function} getRound - a function that returns the current round
 * @param {number} round - the current round
 * @param {Array} coins - coins to use the crawler for
 * @param {string} adapter - the adapter to use for the crawler
 * @param {string} db - the database to use for the crawler
 *
 * @returns {TwitterTask} - a TwitterTask object
 *
 */

class TwitterTask {
  constructor(getRound, round, coins = ['BEL', 'BEAI', 'BONK', 'PNB', 'BTC']) {
    this.round = round;
    this.lastRoundCheck = Date.now();
    this.isRunning = false;
    this.coins = coins;
    this.adapter = null;
    this.setAdapter = async () => {
      const username = process.env.TWITTER_USERNAME;
      const password = process.env.TWITTER_PASSWORD;

      if (!username || !password) {
        throw new Error(
          'Environment variables TWITTER_USERNAME and/or TWITTER_PASSWORD are not set',
        );
      }

      let credentials = {
        username: username,
        password: password,
      };
      this.adapter = new Twitter(credentials, this.db, 10);
      await this.adapter.negotiateSession();
    };

    this.updateRound = async () => {
      // if it has been more than 1 minute since the last round check, check the round and update this.round
      if (Date.now() - this.lastRoundCheck > 60000) {
        this.round = await getRound();
        this.lastRoundCheck = Date.now();
      }
      return this.round;
    };
    this.start();
  }

  async updateSearchTerms() {
    try {
      const trendingCoins = await fetchTrendingCoins();
      this.coins = trendingCoins; // Adjust based on the structure of the API response
    } catch (error) {
      console.error('Error updating search terms:', error);
    }
  }

  /**
   * strat
   * @description starts the crawler
   *
   * @returns {void}
   *
   */
  async start() {
    await this.setAdapter();

    await this.updateSearchTerms();

    this.isRunning = true;

    // Create a single query string with all search terms separated by OR
    const searchTermsQuery = this.coins.join(' OR ');
    let query = {
      limit: 500,
      searchTerm: this.coins,
      query: `https://twitter.com/search?q=${encodeURIComponent(
        searchTermsQuery,
      )}&src=typed_query`,
      depth: 5,
      updateRound: async () => {
        return this.updateRound(); // TODO - verify that this works as an import
      },
      recursive: true,
      round: this.round,
    };

    this.adapter.crawl(query); // let it ride
  }

  /**
   * stop
   * @description stops the crawler
   *
   * @returns {void}
   */
  async stop() {
    this.isRunning = false;
    this.adapter.stop();
  }

  /**
   * getRoundCID
   * @param {*} roundID
   * @returns
   */
  async getRoundCID(roundID) {
    console.log('starting submission prep for ');
    let result = await this.adapter.getSubmissionCID(roundID);
    console.log('returning round CID', result, 'for round', roundID);
    return result;
  }

  /**
   * getJSONofCID
   * @description gets the JSON of a CID
   * @param {*} cid
   * @returns
   */
  async getJSONofCID(cid) {
    return await getJSONFromCID(cid);
  }

  /**
   * validate
   * @description validates a round of results from another node against the Twitter API
   * @param {*} proofCid
   * @returns
   */
  async validate(proofCid) {
    // in order to validate, we need to take the proofCid
    // and go get the results from web3.storage

    let data = await getJSONFromCID(proofCid); // check this
    // console.log(`validate got results for CID: ${ proofCid } for round ${ roundID }`, data, typeof(data), data[0]);

    // the data submitted should be an array of additional CIDs for individual tweets, so we'll try to parse it

    let proofThreshold = 4; // an arbitrary number of records to check

    for (let i = 0; i < proofThreshold; i++) {
      let randomIndex = Math.floor(Math.random() * data.length);
      let item = data[randomIndex];
      let result = await getJSONFromCID(item.cid);

      // then, we need to compare the CID result to the actual result on twitter
      // i.e.
      console.log('item was', item);

      // need to check if there's an active session and set one if not
      let twitterCheck;
      let sessionValid = await this.adapter.checkSession();
      if (item.id) {
        if (sessionValid) {
          console.log('about to parse item on twitter', item.id);
          twitterCheck = await this.adapter.parseItem(item.id); // update to suit the adapter
        } else {
          console.error('could not negotiate a twitter session to validate');
        }

        // TODO - revise this check to make sure it handles issues with type conversions
        console.log('ipfs', item);
        let ipfsCheck = await this.getJSONofCID(item.cid);
        console.log('ipfsCheck', ipfsCheck);
        console.log('twitterCheck', twitterCheck);
        console.log(
          'data !== twitterCheck',
          ipfsCheck.content !== twitterCheck.content,
        );
        if (ipfsCheck.content !== twitterCheck.content) {
          return false;
        }
      } else {
        console.log('invalid item id', item.id);
        return false;
      }
    }

    // if none of the random checks fail, return true
    return true;
  }
}

module.exports = TwitterTask;

/**
 * getJSONFromCID
 * @description gets the JSON from a CID
 * @param {*} cid
 * @returns promise<JSON>
 */
const getJSONFromCID = async cid => {
  return new Promise((resolve, reject) => {
    let url = `https://${cid}.ipfs.dweb.link/data.json`;
    // console.log('making call to ', url)
    axios.get(url).then(response => {
      if (response.status !== 200) {
        console.log('error', response);
        reject(response);
      } else {
        // console.log('response', response)
        resolve(response.data);
      }
    });
  });
};
