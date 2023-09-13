const { coreLogic } = require('./coreLogic');
const { app } = require('./init');
const {
  namespaceWrapper,
  taskNodeAdministered,
} = require('./namespaceWrapper');

/**
 * setup
 * @description sets up the task node, particularly the inter-process communication to start and stop the task
 * @returns {void}
 */
async function setup() {
  console.log('setup function called');
  // Run default setup
  await namespaceWrapper.defaultTaskSetup();
  process.on('message', m => {
    console.log('CHILD got message:', m);
    if (m.functionCall == 'submitPayload') {
      console.log('submitPayload called');
      coreLogic.submitTask(m.roundNumber);
    } else if (m.functionCall == 'auditPayload') {
      console.log('auditPayload called');
      coreLogic.auditTask(m.roundNumber);
    } else if (m.functionCall == 'executeTask') {
      console.log('executeTask called');
      coreLogic.task();
    } else if (m.functionCall == 'generateAndSubmitDistributionList') {
      console.log('generateAndSubmitDistributionList called');
      coreLogic.submitDistributionList(m.roundNumber);
    } else if (m.functionCall == 'distributionListAudit') {
      console.log('distributionListAudit called');
      coreLogic.auditDistribution(m.roundNumber);
    }
  });
}

if (taskNodeAdministered) {
  setup();
}

const Data = require('./model/data'); // Adjust the path to point to your data.js file
const { closeGauge } = require('puppeteer-chromium-resolver/lib/util');
// Adjust the parameters as necessary

if (app) {
  app.get('/getTrendingCoins', async (req, res) => {
    const trendingCoins =
      await require('./helpers/coingecko').fetchTrendingCoins();
    return res.status(200).json({ data: trendingCoins });
  });

  app.get('/getTweets', async (req, res) => {
    const { id, sentiment, user, coin, sentimentScore } = req.query;

    //http://localhost:10000/getTweets?sentiment=negative&sentimentScore=-1&coin=BTC

    // Create a query object with only the parameters that are not undefined
    const queryObject = {};
    if (id) queryObject.id = id;
    if (sentiment) queryObject.sentiment = sentiment;
    if (user) queryObject.user = user;
    if (coin) queryObject.coin = coin;
    if (sentimentScore) queryObject.sentimentScore = Number(sentimentScore);
    const dataInstance = await namespaceWrapper.getDb();
    const data = await dataInstance.find(queryObject);
    return res.status(200).json({ data: data });
  });

  app.get('/taskState', async (req, res) => {
    const state = await namespaceWrapper.getTaskState();
    console.log((await namespaceWrapper.getDb()).count('positive'));
    console.log('TASK STATE', state);

    res.status(200).json({ taskState: state });
  });
  app.use('/api/', require('./routes'));
}
