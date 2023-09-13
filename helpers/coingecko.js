async function fetchTrendingCoins() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/search/trending',
    );
    const data = await response.json();
    const coins = data.coins;
    const searchTerms = coins.map(coin => {
      const symbol = coin.item.symbol;
      const name = coin.item.name.replace(/\s+/g, '');
      return `#${name} OR $${symbol}`;
    });
    return searchTerms;
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    return [
      '#BTC OR $BTC',
      '#ETH OR $ETH',
      '#DOGE OR $DOGE',
      '#SOL OR $SOL',
      '#AVAX OR $AVAX',
      '#POLY OR $POLY',
    ];
  }
}

module.exports = {
  fetchTrendingCoins,
};
