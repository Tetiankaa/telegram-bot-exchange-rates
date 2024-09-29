import {ECurrency} from "../enums/currency.enum";
import {ETelegramCommand} from "../enums/telegram-command.enum";

export const errorMessages = {
    RIGHT_FORMAT: (example: string) => `Please provide request like in this example: (e.g., ${example})`,
    WRONG_CURRENCY: `Wrong currency. Please provide some of allowed values: ${Object.values(ECurrency).join(', ')}`,
    SYSTEM_ERROR: 'Oops... The system encountered a problem... Try again later.',
    INVALID_AMOUNT: (example: string) => `Invalid amount. Please provide a valid number for the amount. (e.g., ${example})`,
    INVALID_COMMAND: `Please provide some of the allowed commands: (e.g., ${Object.values(ETelegramCommand).join(' ')})`
}
