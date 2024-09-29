import {exchangeRateService} from "./exchange-rate.service";
import {IUpdate} from "../interfaces/update.interface";
import {ECurrency} from "../enums/currency.enum";
import {errorMessages} from "../constants/error-messages.constant";
import {apiTelegramService} from "./api-telegram.service";
import {ETelegramCommand} from "../enums/telegram-command.enum";

class TelegramService {

    private readonly CALCULATION_REQUEST_EXAMPLE = '/calculate 50 USD to UAH';
    private readonly RATE_REQUEST_EXAMPLE = '/rate EUR PLN';
    private readonly TO_KEYWORD = 'to'
    private readonly WELCOME_MESSAGE = `
Welcome to the Exchange Rates Bot! 🎉

You can use this bot to check current exchange rates or calculate currency conversions. Here are the commands you can use:

- **/rate {currency1} {currency2}**: Get the exchange rate between two currencies.
  - Example: /rate USD EUR (to get the rate from USD to EUR)

- **/calculate {amount} {currency1} to {currency2}**: Convert an amount from one currency to another.
  - Example: /calculate 100 USD to EUR (to convert 100 USD to EUR)

Feel free to try these commands and let me know how I can help with your currency conversions!
`;

    public async setWebhook(): Promise<void> {
        try {
            const { data } = await apiTelegramService.setWebhook();
            console.info('Webhook successfully set: ', data)
        } catch (error) {
            console.error('Error setting webhook: ', error);
        }
    }

    public getUpdates = async (data: IUpdate) => {
                const text = data.message?.text;
                const chatId = data.message?.chat?.id;

                if (text && text.toLowerCase().startsWith(ETelegramCommand.RATE)) {
                    await this.handleFetchingExchangeRates(text, chatId);

                } else if (text && text.toLowerCase().startsWith(ETelegramCommand.CALCULATE)) {
                    await this.handleCurrencyExchangeCalculation(text, chatId);

                } else if (text && text.toLowerCase().startsWith(ETelegramCommand.START)) {
                    await this.sendMessage(chatId, this.WELCOME_MESSAGE);
                } else {
                    await this.sendMessage(chatId, errorMessages.INVALID_COMMAND);
                }
     }

    private sendMessage = async (chatId: number, text: string) => {
        try {
            await apiTelegramService.sendMessage(chatId, text);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    private async handleFetchingExchangeRates(text: string, chatId: number): Promise<void> {

        const inputParts = text.split(' ');

        if (inputParts.length != 3 ) {
            await this.sendErrorMessage(chatId, errorMessages.RIGHT_FORMAT(this.RATE_REQUEST_EXAMPLE));
            return;
        }

        const fromCurrency = inputParts[1].toUpperCase();
        const toCurrency = inputParts[2].toUpperCase();

        if (!(fromCurrency in ECurrency) || !(toCurrency in ECurrency)){
            await this.sendErrorMessage(chatId, errorMessages.WRONG_CURRENCY);
            return;
        }

        try {
            const { data } = await exchangeRateService.getRates(fromCurrency);

            if (!data || !data.conversion_rates || !data.conversion_rates[fromCurrency] || !data.conversion_rates[toCurrency]) {
                await this.sendErrorMessage(chatId, errorMessages.SYSTEM_ERROR);
                return;
            }

                const baseRate = data.conversion_rates[fromCurrency];
                const targetRate = data.conversion_rates[toCurrency];

                const textToSend = `${baseRate} ${fromCurrency} = ${targetRate.toFixed(2)} ${toCurrency}`;
                await this.sendMessage(chatId, textToSend);

        }catch (err) {
            await this.sendErrorMessage(chatId, errorMessages.SYSTEM_ERROR);
            console.error('Error fetching exchange rates: ', err);
        }
    }

    private async handleCurrencyExchangeCalculation(text: string, chatId: number): Promise<void> {
        const inputParts = text.split(' ');

        if (inputParts.length != 5) {
            await this.sendErrorMessage(chatId, errorMessages.RIGHT_FORMAT(this.CALCULATION_REQUEST_EXAMPLE));
            return;
        }

        const amount = parseFloat(inputParts[1]);
        const fromCurrency = inputParts[2].toUpperCase();
        const toKeyword = inputParts[3];
        const toCurrency = inputParts[4].toUpperCase();

        if (isNaN(amount)) {
            await this.sendErrorMessage(chatId, errorMessages.INVALID_AMOUNT(this.CALCULATION_REQUEST_EXAMPLE));
            return;
        }

        if (toKeyword != this.TO_KEYWORD) {
            await this.sendErrorMessage(chatId, errorMessages.RIGHT_FORMAT(this.CALCULATION_REQUEST_EXAMPLE));
            return;
        }


        if (!(fromCurrency in ECurrency) || !(toCurrency in ECurrency)){
            await this.sendErrorMessage(chatId, errorMessages.WRONG_CURRENCY);
            return;
        }

        try {
            const { data } = await exchangeRateService.getRates(fromCurrency);

            if (!data || !data.conversion_rates || !data.conversion_rates[toCurrency]) {
                await this.sendErrorMessage(chatId, errorMessages.SYSTEM_ERROR);
                return;
            }
                const targetRate = data.conversion_rates[toCurrency];

                const calculatedRate = targetRate * amount;

                const textToSend = `${amount} ${fromCurrency} = ${calculatedRate.toFixed(2)} ${toCurrency}`;
                await this.sendMessage(chatId, textToSend);

        }catch (err) {
            await this.sendErrorMessage(chatId, errorMessages.SYSTEM_ERROR);
            console.error('Error fetching exchange rates: ', err);
        }
    }
    private async sendErrorMessage(chatId: number,message: string): Promise<void> {
        await this.sendMessage(chatId, message);
    }
}
export const telegramService = new TelegramService();
