import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core';
import Oas from 'oas';
import APICore from 'api/dist/core';
declare class SDK {
    spec: Oas;
    core: APICore;
    constructor();
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    config(config: ConfigOptions): void;
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    auth(...values: string[] | number[]): this;
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    server(url: string, variables?: {}): void;
    /**
     * Use this service to create Split-payments referentes for Multibanco or MB WAY payment
     * requests.
     *
     * @summary Split-Payments
     * @throws FetchError<401, types.SplitPaymentsResponse401> 401
     */
    splitPayments(body: types.SplitPaymentsBodyParam, metadata: types.SplitPaymentsMetadataParam): Promise<FetchResponse<200, types.SplitPaymentsResponse200>>;
    /**
     * Use this request to create Debit Direct Authorizations. This request will create an
     * Authorization PDF with a reference number (authorizationId) , which will be sent to the
     * debtor's email.
     *
     * @summary Direct Debit Authorization
     * @throws FetchError<401, types.DirectDebitAuthorizationResponse401> 401
     */
    directDebitAuthorization(body: types.DirectDebitAuthorizationBodyParam): Promise<FetchResponse<200, types.DirectDebitAuthorizationResponse200>>;
    /**
     * Use this request to create a manual debit request for a Direct Debit Authorization
     *
     * @summary Direct Debit Payment
     * @throws FetchError<401, types.DirectDebitPaymentResponse401> 401
     */
    directDebitPayment(body: types.DirectDebitPaymentBodyParam, metadata: types.DirectDebitPaymentMetadataParam): Promise<FetchResponse<200, types.DirectDebitPaymentResponse200>>;
    /**
     * Creates an url to a secure form where the customer may finish the Credit Card payment.
     *
     * Supports 3D Secure Technology.
     *
     * @summary Credit Card
     * @throws FetchError<401, types.CreditCardResponse401> 401
     */
    creditCard(body: types.CreditCardBodyParam): Promise<FetchResponse<200, types.CreditCardResponse200>>;
    /**
     * Creates a request to allow the customer to pay using CofidisPay service.
     *
     * @summary CofidisPay
     * @throws FetchError<400, types.CofidisPayResponse400> 400
     * @throws FetchError<401, types.CofidisPayResponse401> 401
     */
    cofidisPay(body: types.CofidisPayBodyParam): Promise<FetchResponse<200, types.CofidisPayResponse200>>;
    /**
     * Use this method to create multiple Multibanco references at the same time.
     *
     * @summary Multibanco (batch)
     * @throws FetchError<400, types.MultibancoBatchResponse400> 400
     */
    multibancoBatch(): Promise<FetchResponse<200, types.MultibancoBatchResponse200>>;
    /**
     * Polish Payment Method. Creates a request that redirects the payer to an external form to
     * pay with P24.
     *
     * @summary P24
     * @throws FetchError<400, types.P24Response400> 400
     * @throws FetchError<401, types.P24Response401> 401
     */
    p24(body: types.P24BodyParam): Promise<FetchResponse<201, types.P24Response201>>;
    /**
     * Creates a request to allow the customer to pay using Santander Consumer service.
     *
     * @summary Santander Consumer
     * @throws FetchError<401, types.SantanderConsumerResponse401> 401
     */
    santanderConsumer(body: types.SantanderConsumerBodyParam): Promise<FetchResponse<200, types.SantanderConsumerResponse200>>;
    /**
     * Creates an url to a secure form where the customer may finish the Credit Card
     * recurrency. Supports 3D Secure Technology.
     *
     * @summary Credit Card - Recurrence Authorization
     * @throws FetchError<400, types.CreditCardRecurrenceAuthorizationResponse400> 400
     */
    creditCardRecurrenceAuthorization(body: types.CreditCardRecurrenceAuthorizationBodyParam): Promise<FetchResponse<200, types.CreditCardRecurrenceAuthorizationResponse200>>;
    /**
     * Creates a Credit Card Recurrent MIT (Merchant initiated transaction) payment after a
     * sucessful authorization.
     *
     * @summary Credit Card - Recurrence Payment
     * @throws FetchError<400, types.CreditCardRecurrencePaymentResponse400> 400
     */
    creditCardRecurrencePayment(body: types.CreditCardRecurrencePaymentBodyParam, metadata: types.CreditCardRecurrencePaymentMetadataParam): Promise<FetchResponse<200, types.CreditCardRecurrencePaymentResponse200>>;
    /**
     * Creates MB WAY payment requests. (The customer have 5 minutes to execute the payment
     * after receiving the payment notification via MBWAY app.)
     *
     * @summary MB WAY
     * @throws FetchError<401, types.MbwayResponse401> 401
     */
    mbway(body: types.MbwayBodyParam): Promise<FetchResponse<201, types.MbwayResponse201>>;
    /**
     * Creates a request to allow the customer to pay using PayByLink.
     *
     * @summary PayByLink
     * @throws FetchError<401, types.PaybylinkResponse401> 401
     */
    paybylink(body: types.PaybylinkBodyParam): Promise<FetchResponse<200, types.PaybylinkResponse200>>;
    /**
     * Creates a request to allow the customer to pay using PayByLink.
     *
     * @summary PayByLink QR Code
     * @throws FetchError<401, types.PaybylinkQrcodeResponse401> 401
     */
    paybylinkQrcode(body: types.PaybylinkQrcodeBodyParam): Promise<FetchResponse<200, types.PaybylinkQrcodeResponse200>>;
    /**
     * Creates a request to allow the client to check the installment options available using
     * Floa Pay service for that amount and country.
     *
     * @summary Floa Pay - Simulation
     * @throws FetchError<400, types.FloaPaySimulationResponse400> 400
     */
    floaPaySimulation(body: types.FloaPaySimulationBodyParam): Promise<FetchResponse<201, types.FloaPaySimulationResponse201>>;
    /**
     * Creates a request to allow the customer to pay using Floa Pay service.
     *
     * @summary Floa Pay - Payment
     * @throws FetchError<400, types.FloaPayCreateResponse400> 400
     */
    floaPayCreate(body: types.FloaPayCreateBodyParam): Promise<FetchResponse<201, types.FloaPayCreateResponse201>>;
    /**
     * Creates an url to a secure form where the customer may finish the Bizum payment.
     * Supports 3D Secure Technology.
     *
     * @summary Bizum
     * @throws FetchError<401, types.BizumResponse401> 401
     */
    bizum(body: types.BizumBodyParam): Promise<FetchResponse<200, types.BizumResponse200>>;
    /**
     * Creates Pix payment requests. (The customer have to execute the payment after receiving
     * the payment notification via Pix app.)
     *
     * @summary EuroPix
     * @throws FetchError<401, types.EuropixResponse401> 401
     */
    europix(body: types.EuropixBodyParam): Promise<FetchResponse<201, types.EuropixResponse201>>;
    /**
     * Creates Google Pay payment request.
     *
     * @summary Google Pay
     * @throws FetchError<401, types.MbWayCopyResponse401> 401
     */
    mbWayCopy(body: types.MbWayCopyBodyParam): Promise<FetchResponse<201, types.MbWayCopyResponse201>>;
}
declare const createSDK: SDK;
export = createSDK;
