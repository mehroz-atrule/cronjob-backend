import { fetchData } from "../controllers/scrappingCurrencyData/scrappingCurrencyData.js";
import { fetchDataGoldCities } from "../controllers/scrappingGoldData/scrappingCityWiseData.js";
import { fetchDataGOLDbyWeight } from "../controllers/scrappingGoldData/goldRateByWeight.js";
import { fetchDataGoldOldDays } from "../controllers/scrappingGoldData/pastDayGoldRate.js";

import { currencyRatesRepository } from "../repositories/currencyRatesRepository.js";
import { goldCityRatesRepository } from "../repositories/goldCityRatesRepository.js";
import { goldRatesByWeightRepository } from "../repositories/goldRatesByWeightRepository.js";
import { pastDaysGoldRatesRepository } from "../repositories/pastDaysGoldRatesRepository.js";
export const runCronJob = async () => {
  console.log("Cron job executed at", new Date().toISOString());

  try {
    const currencyData = await fetchData();
    console.log("currencyData:", currencyData?.rates.length);
    if (currencyData !== undefined) {
      await currencyRatesRepository.deleteAll();
      await currencyRatesRepository.create(currencyData);
    }

    const currencyGoldData = await fetchDataGoldCities();
    console.log("currencyGoldData:", currencyGoldData?.rates.length);
    if (currencyGoldData !== undefined) {
      await goldCityRatesRepository.deleteAll();
      await goldCityRatesRepository.create(currencyGoldData);
    }

    const currencyGoldDataBYWeight = await fetchDataGOLDbyWeight();
    console.log(
      "currencyGoldDataBYWeight:",
      currencyGoldDataBYWeight?.rates.length
    );

    if (currencyGoldDataBYWeight !== undefined) {
      await goldRatesByWeightRepository.deleteAll();
      await goldRatesByWeightRepository.create(currencyGoldDataBYWeight);
    }

    const currencyGoldDataByPastDate = await fetchDataGoldOldDays();
    console.log(
      "currencyGoldDataByPastDate:",
      currencyGoldDataByPastDate?.rates.length
    );

    if (currencyGoldDataByPastDate !== undefined) {
      await pastDaysGoldRatesRepository.deleteAll();
      await pastDaysGoldRatesRepository.create(currencyGoldDataByPastDate);
    }
  } catch (error) {
    console.error("Error calling update-rates API:", error.message);
  }
};
