import { APIGatewayProxyEvent } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";
import axios from "axios";

// game-deals?currency=USD
export const handler = async (event: APIGatewayProxyEvent) => {
    try {
    const { queryStringParameters = {} } = event;
    const { currency } = queryStringParameters;

    if (!currency) {
      return formatJSONResponse({
        statusCode: 400,
        data: {
          messsage: "missing query string of currency",
        },
      });
    }

    const deals = await axios.get("https://www.cheapshark.com/api/1.0/deals", {
      params: {
        upperPrice: 15,
        pageSize: 5,
      },
    });

    const currencyExchange = await axios.get(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/${currency}.json`
    );

    const currencyExchangeRate = currencyExchange.data[currency];

    const repricedDeals = deals.data.map((deal) => {
      const {
        title,
        storeID,
        salePrice,
        normalPrice,
        savings,
        steamRatingPercent,
        releaseDate,
      } = deal;

      return {
        title,
        storeID,
        steamRatingPercent,
        salePrice: salePrice * currencyExchangeRate,
        normalPrice: normalPrice * currencyExchangeRate,
        savings: savings * currencyExchangeRate,
        releaseDate: new Date(releaseDate * 1000).toISOString(),
      };
    });

    return formatJSONResponse({
      data: {
        deals: repricedDeals
      },
    });
  } catch (error) {
    console.log(error);
    return formatJSONResponse({
      statusCode: 502,
      data: {
        messsage: "Internal server error",
      },
    });
  }
};
