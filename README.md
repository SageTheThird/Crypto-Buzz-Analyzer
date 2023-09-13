## Project Status

**Note**: This project is currently in development and has not yet been deployed to the Koii Networks. Stay tuned for updates!

## Overview

Crypto Buzz Analyzer is a project built on the Koii Network that aims to analyze the sentiment surrounding various cryptocurrencies based on tweets. It serves as a tool to gauge the public sentiment around trending cryptocurrencies, potentially helping to identify scams and spread awareness about the credibility of various coins.

Here's a brief overview of how the project works:

1. **Trending Coins**: Initially, the task picks up the trending coins from the CoinGecko API. This data serves as a basis to identify which coins are currently popular and being discussed in the crypto community.

2. **Twitter Crawler**: Once the trending coins are identified, the task starts crawling Twitter to gather data on these coins. It searches for tweets mentioning these coins using various hashtags and symbols associated with them.

3. **Sentiment Analysis**: After gathering the tweets, we perform sentiment analysis on the tweet content, while also taking into account the engagement metrics and analyzing the presence of certain keywords and URLs, which could potentially be indicators of scams or misinformation. This analysis helps in determining whether the sentiment surrounding a particular coin is positive, negative, or neutral.

4. **Data Storage**: All the analyzed data is then stored on IPFS, ensuring that it is decentralized and readily accessible.

5. **API Endpoints**: The project exposes a couple of API endpoints that allow users to query the stored data.

6. **Front-End**: No Front-end yet. Will spin something simple when I get some time. If you're interested in contributing, please feel free to fork the project and submit a pull request! :)

By utilizing this project, users can potentially identify scams and be more informed about the general sentiment surrounding various cryptocurrencies, fostering a safer and more informed crypto community.


## Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher)

### Steps

1. Clone the repository:
   ```
   git clone https://github.com/SageTheThird/Crypto-Buzz-Analyzer.git
   ```
   
2. Navigate to the project directory:
   ```
   cd Crypto-Buzz-Analyzer
   ```

3. Install the necessary packages:
   ```
   npm install
   ```

4. Set up the necessary environment variables in a `.env` file. 3 variables are needed to run the project: TWITTER_USERNAME, TWITTER_PASSWORD, WEB3STORAGE_TOKEN.

5. Run the project:
   ```
   npm start
   ```

## Usage

### `GET /getTweets`

This endpoint allows you to retrieve tweets based on various query parameters, offering a rich dataset that can be utilized in numerous ways. You can specify a trending coin to retrieve all the data about that coin (you can use the `/getTrendingCoins` endpoint to know what's trending). You can also use other parameters to filter the results:

- `coin`: The cryptocurrency coin mentioned in the tweet (e.g., BTC, Bitcoin, ETH, Ethereum).
- `sentiment`: The sentiment of the tweet (positive, negative, or neutral).
- `id`: The ID of the tweet (URL of the tweet).
- `user`: The Twitter username who posted the tweet (e.g., @oliiver_eth).
- `sentimentScore`: The sentiment score assigned to the tweet (numeric value).

#### Potential Applications

The data retrieved from this endpoint can be leveraged in various ways, including but not limited to:

1. **Dashboard Integration**: Incorporate the data into a dashboard to visualize the sentiment trends and engagement metrics surrounding different cryptocurrencies.
   
2. **Market Analysis**: Utilize the data for market analysis, helping to identify potential investment opportunities or to gauge the general sentiment around specific coins.

3. **Research and Reporting**: Use the data as a basis for research reports, academic studies, or articles focusing on the cryptocurrency market.

4. **Alert Systems**: Develop an alert system that notifies users of sudden shifts in sentiment, which might indicate market movements or emerging scams.

5. **Community Engagement**: Analyze community engagement and discussions around specific coins, helping to identify influencers and key opinion leaders in the crypto space.

#### Example Usage

```sh
curl -X GET 'http://localhost:10000/getTweets?coin=BTC&sentiment=negative'
```

## Contribution

Feel free to fork the project and submit pull requests for any enhancements or bug fixes. Please adhere to the existing coding style and commit message format.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact

For any queries or suggestions, please open an issue on GitHub or contact the repository owner.

---
