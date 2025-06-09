"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var oas_1 = __importDefault(require("oas"));
var core_1 = __importDefault(require("api/dist/core"));
var openapi_json_1 = __importDefault(require("./openapi.json"));
var SDK = /** @class */ (function () {
    function SDK() {
        this.spec = oas_1.default.init(openapi_json_1.default);
        this.core = new core_1.default(this.spec, 'eupago/1.0 (api/6.1.3)');
    }
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    SDK.prototype.config = function (config) {
        this.core.setConfig(config);
    };
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
    SDK.prototype.auth = function () {
        var _a;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        (_a = this.core).setAuth.apply(_a, values);
        return this;
    };
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
    SDK.prototype.server = function (url, variables) {
        if (variables === void 0) { variables = {}; }
        this.core.setServer(url, variables);
    };
    /**
     * Use this service to create Split-payments referentes for Multibanco or MB WAY payment
     * requests.
     *
     * @summary Split-Payments
     * @throws FetchError<401, types.SplitPaymentsResponse401> 401
     */
    SDK.prototype.splitPayments = function (body, metadata) {
        return this.core.fetch('/v1/split-payments/{payment-method}', 'post', body, metadata);
    };
    /**
     * Use this request to create Debit Direct Authorizations. This request will create an
     * Authorization PDF with a reference number (authorizationId) , which will be sent to the
     * debtor's email.
     *
     * @summary Direct Debit Authorization
     * @throws FetchError<401, types.DirectDebitAuthorizationResponse401> 401
     */
    SDK.prototype.directDebitAuthorization = function (body) {
        return this.core.fetch('/v1.02/directdebit/authorization', 'post', body);
    };
    /**
     * Use this request to create a manual debit request for a Direct Debit Authorization
     *
     * @summary Direct Debit Payment
     * @throws FetchError<401, types.DirectDebitPaymentResponse401> 401
     */
    SDK.prototype.directDebitPayment = function (body, metadata) {
        return this.core.fetch('/v1.02/directdebit/payment/{reference}', 'post', body, metadata);
    };
    /**
     * Creates an url to a secure form where the customer may finish the Credit Card payment.
     *
     * Supports 3D Secure Technology.
     *
     * @summary Credit Card
     * @throws FetchError<401, types.CreditCardResponse401> 401
     */
    SDK.prototype.creditCard = function (body) {
        return this.core.fetch('/v1.02/creditcard/create', 'post', body);
    };
    /**
     * Creates a request to allow the customer to pay using CofidisPay service.
     *
     * @summary CofidisPay
     * @throws FetchError<400, types.CofidisPayResponse400> 400
     * @throws FetchError<401, types.CofidisPayResponse401> 401
     */
    SDK.prototype.cofidisPay = function (body) {
        return this.core.fetch('/v1.02/cofidis/create', 'post', body);
    };
    /**
     * Use this method to create multiple Multibanco references at the same time.
     *
     * @summary Multibanco (batch)
     * @throws FetchError<400, types.MultibancoBatchResponse400> 400
     */
    SDK.prototype.multibancoBatch = function () {
        return this.core.fetch('/v1.02/multibanco/batch', 'post');
    };
    /**
     * Polish Payment Method. Creates a request that redirects the payer to an external form to
     * pay with P24.
     *
     * @summary P24
     * @throws FetchError<400, types.P24Response400> 400
     * @throws FetchError<401, types.P24Response401> 401
     */
    SDK.prototype.p24 = function (body) {
        return this.core.fetch('/v1/p24/create', 'post', body);
    };
    /**
     * Creates a request to allow the customer to pay using Santander Consumer service.
     *
     * @summary Santander Consumer
     * @throws FetchError<401, types.SantanderConsumerResponse401> 401
     */
    SDK.prototype.santanderConsumer = function (body) {
        return this.core.fetch('/v1.02/santander/create', 'post', body);
    };
    /**
     * Creates an url to a secure form where the customer may finish the Credit Card
     * recurrency. Supports 3D Secure Technology.
     *
     * @summary Credit Card - Recurrence Authorization
     * @throws FetchError<400, types.CreditCardRecurrenceAuthorizationResponse400> 400
     */
    SDK.prototype.creditCardRecurrenceAuthorization = function (body) {
        return this.core.fetch('/v1.02/creditcard/subscription', 'post', body);
    };
    /**
     * Creates a Credit Card Recurrent MIT (Merchant initiated transaction) payment after a
     * sucessful authorization.
     *
     * @summary Credit Card - Recurrence Payment
     * @throws FetchError<400, types.CreditCardRecurrencePaymentResponse400> 400
     */
    SDK.prototype.creditCardRecurrencePayment = function (body, metadata) {
        return this.core.fetch('/v1.02/creditcard/payment/{recurrentID}', 'post', body, metadata);
    };
    /**
     * Creates MB WAY payment requests. (The customer have 5 minutes to execute the payment
     * after receiving the payment notification via MBWAY app.)
     *
     * @summary MB WAY
     * @throws FetchError<401, types.MbwayResponse401> 401
     */
    SDK.prototype.mbway = function (body) {
        return this.core.fetch('/v1.02/mbway/create', 'post', body);
    };
    /**
     * Creates a request to allow the customer to pay using PayByLink.
     *
     * @summary PayByLink
     * @throws FetchError<401, types.PaybylinkResponse401> 401
     */
    SDK.prototype.paybylink = function (body) {
        return this.core.fetch('/v1.02/paybylink/create', 'post', body);
    };
    /**
     * Creates a request to allow the customer to pay using PayByLink.
     *
     * @summary PayByLink QR Code
     * @throws FetchError<401, types.PaybylinkQrcodeResponse401> 401
     */
    SDK.prototype.paybylinkQrcode = function (body) {
        return this.core.fetch('/v1.02/paybylink/qrcode', 'post', body);
    };
    /**
     * Creates a request to allow the client to check the installment options available using
     * Floa Pay service for that amount and country.
     *
     * @summary Floa Pay - Simulation
     * @throws FetchError<400, types.FloaPaySimulationResponse400> 400
     */
    SDK.prototype.floaPaySimulation = function (body) {
        return this.core.fetch('/v1.02/floa/simulate', 'post', body);
    };
    /**
     * Creates a request to allow the customer to pay using Floa Pay service.
     *
     * @summary Floa Pay - Payment
     * @throws FetchError<400, types.FloaPayCreateResponse400> 400
     */
    SDK.prototype.floaPayCreate = function (body) {
        return this.core.fetch('/v1.02/floa/create', 'post', body);
    };
    /**
     * Creates an url to a secure form where the customer may finish the Bizum payment.
     * Supports 3D Secure Technology.
     *
     * @summary Bizum
     * @throws FetchError<401, types.BizumResponse401> 401
     */
    SDK.prototype.bizum = function (body) {
        return this.core.fetch('/v1.02/bizum/create', 'post', body);
    };
    /**
     * Creates Pix payment requests. (The customer have to execute the payment after receiving
     * the payment notification via Pix app.)
     *
     * @summary EuroPix
     * @throws FetchError<401, types.EuropixResponse401> 401
     */
    SDK.prototype.europix = function (body) {
        return this.core.fetch('/v1.02/pix/create', 'post', body);
    };
    /**
     * Creates Google Pay payment request.
     *
     * @summary Google Pay
     * @throws FetchError<401, types.MbWayCopyResponse401> 401
     */
    SDK.prototype.mbWayCopy = function (body) {
        return this.core.fetch('/v1.02/googlepay/create', 'post', body);
    };
    return SDK;
}());
var createSDK = (function () { return new SDK(); })();
module.exports = createSDK;
