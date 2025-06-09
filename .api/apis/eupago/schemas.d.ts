declare const Bizum: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["payment"];
        readonly properties: {
            readonly payment: {
                readonly type: "object";
                readonly description: "Informations regarding the payment";
                readonly required: readonly ["successUrl", "failUrl"];
                readonly properties: {
                    readonly identifier: {
                        readonly type: "string";
                    };
                    readonly amount: {
                        readonly type: "object";
                        readonly required: readonly ["value", "currency"];
                        readonly properties: {
                            readonly value: {
                                readonly type: "number";
                                readonly description: "Payment amount";
                                readonly format: "float";
                                readonly minimum: -3.402823669209385e+38;
                                readonly maximum: 3.402823669209385e+38;
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly default: "EUR";
                            };
                        };
                    };
                    readonly successUrl: {
                        readonly type: "string";
                        readonly description: "The payer will be forwarded to this url if the payment process is successful.";
                    };
                    readonly failUrl: {
                        readonly type: "string";
                        readonly description: "The payer will be forwarded to this url if the payment process fails (eg: no funds, problems with 3DS)";
                    };
                };
            };
            readonly customer: {
                readonly type: "object";
                readonly description: "Informations regarding customer's notifications";
                readonly properties: {
                    readonly notify: {
                        readonly type: "boolean";
                        readonly default: true;
                    };
                    readonly email: {
                        readonly type: "string";
                        readonly description: "Customer's email";
                    };
                };
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Success"];
                };
                readonly transactionID: {
                    readonly type: "string";
                    readonly examples: readonly ["01932b14d52372d68cb2575864ae0d79"];
                };
                readonly reference: {
                    readonly type: "string";
                    readonly examples: readonly ["21931835"];
                };
                readonly redirectUrl: {
                    readonly type: "string";
                    readonly examples: readonly ["https://clientes.eupago.pt/api/extern/bizum/form/01932b14d52372d68cb2575864ae0d79"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Rejected"];
                };
                readonly code: {
                    readonly type: "string";
                    readonly examples: readonly ["APIKEY_MISSING"];
                };
                readonly text: {
                    readonly type: "string";
                    readonly examples: readonly ["API Key was not available in the request"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const CofidisPay: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["payment", "customer", "items"];
        readonly properties: {
            readonly payment: {
                readonly type: "object";
                readonly description: "Informations regarding the payment";
                readonly required: readonly ["successUrl", "failUrl", "taxCode"];
                readonly properties: {
                    readonly identifier: {
                        readonly type: "string";
                    };
                    readonly amount: {
                        readonly type: "object";
                        readonly description: "Payment amount and currency";
                        readonly required: readonly ["value", "currency"];
                        readonly properties: {
                            readonly value: {
                                readonly type: "number";
                                readonly description: "Payment amount";
                                readonly format: "float";
                                readonly minimum: -3.402823669209385e+38;
                                readonly maximum: 3.402823669209385e+38;
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly default: "EUR";
                            };
                        };
                    };
                    readonly successUrl: {
                        readonly type: "string";
                        readonly description: "Payer will be forwarded to this url if the transaction is successful.";
                    };
                    readonly failUrl: {
                        readonly type: "string";
                        readonly description: "Payer will be forwarded to this url if the transaction fails.";
                    };
                    readonly taxCode: {
                        readonly type: "string";
                        readonly description: "If you are a **Biziq** user and have the tax rate equal to **0**, please choose the correct code. If not, choose the code \"null\".";
                        readonly enum: readonly [any, "M01", "M02", "M03", "M04", "M05", "M06", "M07", "M08", "M09", "M10", "M11", "M12", "M13", "M14", "M15", "M16", "M19", "M20", "M21", "M25", "M26", "M30", "M31", "M32", "M33", "M34", "M40", "M41", "M42", "M43", "M99"];
                    };
                };
            };
            readonly customer: {
                readonly type: "object";
                readonly description: "Customer information";
                readonly required: readonly ["notify", "email", "name", "vatNumber"];
                readonly properties: {
                    readonly notify: {
                        readonly type: "boolean";
                        readonly description: "Specifies if the use should receive an email on their inbox to finish the operation.";
                    };
                    readonly email: {
                        readonly type: "string";
                        readonly description: "Must always be filled, even if notify param is false.";
                    };
                    readonly name: {
                        readonly type: "string";
                        readonly description: "Customer's name";
                    };
                    readonly socialSecurityNumber: {
                        readonly type: "integer";
                        readonly format: "int32";
                        readonly minimum: -2147483648;
                        readonly maximum: 2147483647;
                    };
                    readonly citizenNumber: {
                        readonly type: "string";
                    };
                    readonly checkDigit: {
                        readonly type: "string";
                        readonly description: "Note: Do not leave blank spaces (correct: XYZ8 | wrong: XYZ 8)";
                    };
                    readonly issueCardDate: {
                        readonly type: "string";
                        readonly description: "YYYY-MM-DD";
                        readonly format: "date";
                    };
                    readonly vatNumber: {
                        readonly type: "integer";
                        readonly format: "int32";
                        readonly minimum: -2147483648;
                        readonly maximum: 2147483647;
                    };
                    readonly phoneNumber: {
                        readonly type: "string";
                    };
                    readonly birthDate: {
                        readonly type: "string";
                        readonly description: "YYYY-MM-DD";
                        readonly format: "date";
                    };
                    readonly billingAddress: {
                        readonly type: "object";
                        readonly required: readonly ["address", "zipCode", "city"];
                        readonly properties: {
                            readonly address: {
                                readonly type: "string";
                                readonly description: "Street name";
                            };
                            readonly zipCode: {
                                readonly type: "string";
                            };
                            readonly city: {
                                readonly type: "string";
                            };
                        };
                    };
                };
            };
            readonly items: {
                readonly type: "array";
                readonly description: "All items in the order. This param may include different objects (items).";
                readonly items: {
                    readonly properties: {
                        readonly reference: {
                            readonly type: "string";
                            readonly description: "Product code";
                        };
                        readonly price: {
                            readonly type: "number";
                            readonly description: "Product price (without IVA or other fees)";
                            readonly format: "float";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly quantity: {
                            readonly type: "integer";
                            readonly description: "Number of times this product is ordered";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly tax: {
                            readonly type: "number";
                            readonly description: "Tax percentage";
                            readonly format: "float";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly discount: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly description: {
                            readonly type: "string";
                            readonly description: "Product name";
                        };
                    };
                    readonly required: readonly ["reference", "price", "quantity", "tax", "discount", "description"];
                    readonly type: "object";
                };
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Success"];
                };
                readonly transactionID: {
                    readonly type: "string";
                    readonly examples: readonly ["4523566c0e8f7fb7306bae1500278a85"];
                };
                readonly reference: {
                    readonly type: "string";
                    readonly examples: readonly ["007"];
                };
                readonly redirectUrl: {
                    readonly type: "string";
                    readonly examples: readonly ["https://sandbox.eupago.pt/api/extern/cofidis/form/4523566c0e8f7fb7306bae1500278a85"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Rejected"];
                };
                readonly code: {
                    readonly type: "string";
                    readonly examples: readonly ["AMOUNT_MISSING"];
                };
                readonly text: {
                    readonly type: "string";
                    readonly examples: readonly ["Amount was not available in the request"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Rejected"];
                };
                readonly code: {
                    readonly type: "string";
                    readonly examples: readonly ["APIKEY_MISSING"];
                };
                readonly text: {
                    readonly type: "string";
                    readonly examples: readonly ["API Key was not available in the request"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const CreditCard: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["payment", "customer"];
        readonly properties: {
            readonly payment: {
                readonly type: "object";
                readonly description: "Informations regarding the payment";
                readonly required: readonly ["successUrl", "failUrl", "backUrl"];
                readonly properties: {
                    readonly identifier: {
                        readonly type: "string";
                    };
                    readonly amount: {
                        readonly type: "object";
                        readonly required: readonly ["value", "currency"];
                        readonly properties: {
                            readonly value: {
                                readonly type: "number";
                                readonly description: "Payment amount";
                                readonly format: "float";
                                readonly minimum: -3.402823669209385e+38;
                                readonly maximum: 3.402823669209385e+38;
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly default: "EUR";
                            };
                        };
                    };
                    readonly successUrl: {
                        readonly type: "string";
                        readonly description: "The payer will be forwarded to this url if the payment process is successful.";
                    };
                    readonly failUrl: {
                        readonly type: "string";
                        readonly description: "The payer will be forwarded to this url if the payment process fails (eg: no funds, problems with 3DS)";
                    };
                    readonly backUrl: {
                        readonly type: "string";
                        readonly description: "The payer will be forwarded to this url if the user presses back.";
                    };
                    readonly lang: {
                        readonly type: "string";
                        readonly description: "Defines the Language of the form.";
                        readonly default: "PT";
                    };
                    readonly minutesFormUp: {
                        readonly type: "integer";
                        readonly description: "Number of minutes that the url for the payment form will remain active. After that time the form will be unaccessible and the reference expired. Max and default 1440 minutes";
                        readonly default: 1440;
                        readonly format: "int32";
                        readonly minimum: -2147483648;
                        readonly maximum: 2147483647;
                    };
                };
            };
            readonly customer: {
                readonly type: "object";
                readonly description: "Informations regarding customer's notifications";
                readonly required: readonly ["notify", "email"];
                readonly properties: {
                    readonly notify: {
                        readonly type: "boolean";
                        readonly default: true;
                    };
                    readonly email: {
                        readonly type: "string";
                        readonly description: "Customer's email";
                    };
                };
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Success"];
                };
                readonly transactionID: {
                    readonly type: "string";
                    readonly examples: readonly ["6526ds26653sad5489sa32"];
                };
                readonly reference: {
                    readonly type: "string";
                    readonly examples: readonly ["00235"];
                };
                readonly redirectUrl: {
                    readonly type: "string";
                    readonly examples: readonly ["https://clientes.eupago.pt/api/extern/creditcard/form/6526ds26653sad5489sa32"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Rejected"];
                };
                readonly code: {
                    readonly type: "string";
                    readonly examples: readonly ["APIKEY_MISSING"];
                };
                readonly text: {
                    readonly type: "string";
                    readonly examples: readonly ["API Key was not available in the request"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const CreditCardRecurrenceAuthorization: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["payment"];
        readonly properties: {
            readonly payment: {
                readonly type: "object";
                readonly required: readonly ["successUrl", "failUrl", "backUrl"];
                readonly properties: {
                    readonly identifier: {
                        readonly type: "string";
                    };
                    readonly amount: {
                        readonly type: "object";
                        readonly required: readonly ["value", "currency"];
                        readonly properties: {
                            readonly value: {
                                readonly type: "number";
                                readonly description: "Payment amount";
                                readonly format: "float";
                                readonly minimum: -3.402823669209385e+38;
                                readonly maximum: 3.402823669209385e+38;
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly default: "EUR";
                            };
                        };
                    };
                    readonly subscription: {
                        readonly type: "object";
                        readonly required: readonly ["autoProcess", "periodicity", "date", "limitDate"];
                        readonly properties: {
                            readonly autoProcess: {
                                readonly type: "integer";
                                readonly description: "Parameter that defines the intention of auto-processing payments with a value of 0 for \"no\" or 1 for \"yes.\"";
                                readonly default: 0;
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly collectionDay: {
                                readonly type: "integer";
                                readonly description: "Parameter referring to the transaction execution day in auto-processed payments (Relevant only when autoProcess is set to 1). If left blank, it will assume the current day as reference.";
                                readonly default: any;
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly periodicity: {
                                readonly type: "string";
                                readonly description: "Paramenter referring to the periodicity of auto-processing (Required if autoProcess = 1)";
                                readonly enum: readonly ["Semanal", "Quinzenal", "Mensal", "Trimestral", "Semestral", "Anual"];
                            };
                            readonly date: {
                                readonly type: "string";
                                readonly description: "In YYYY-MM-DD format. Date from which recurrence activation and use will be possible";
                            };
                            readonly limitDate: {
                                readonly type: "string";
                                readonly description: "In YYYY-MM-DD format. Date until which the recurrence can be used (After this date, the recurrence expires, and a new one must be executed).";
                            };
                            readonly customer: {
                                readonly type: "object";
                                readonly description: "Object that encompasses the customer's phone, email and name responsible for the credit card.";
                                readonly properties: {
                                    readonly notify: {
                                        readonly type: "boolean";
                                        readonly description: "To define if the customer will be notified with the data of subscription request by email/sms.";
                                        readonly default: false;
                                    };
                                    readonly phone: {
                                        readonly type: "string";
                                        readonly description: "National mobile phone number for recurrence notifications, one-time payments, and subscriptions (No area code required, enter only 9 digits).";
                                    };
                                    readonly email: {
                                        readonly type: "string";
                                        readonly description: "Email for recurrence notifications, one-time payments, and subscriptions.";
                                    };
                                    readonly name: {
                                        readonly type: "string";
                                        readonly description: "Name of the customer to be displayed in recurrence notifications, one-time payments, and subscriptions.";
                                    };
                                };
                            };
                        };
                    };
                    readonly successUrl: {
                        readonly type: "string";
                        readonly description: "The payer will be forwarded to this url if the payment process is successful.";
                    };
                    readonly failUrl: {
                        readonly type: "string";
                        readonly description: "The payer will be forwarded to this url if the payment process fails (eg: no funds, problems with 3DS)";
                    };
                    readonly backUrl: {
                        readonly type: "string";
                        readonly description: "The payer will be forwarded to this url if the user presses back.";
                    };
                    readonly lang: {
                        readonly type: "string";
                        readonly description: "Defines the Language of the form.";
                        readonly default: "PT";
                    };
                    readonly minutesFormUp: {
                        readonly type: "integer";
                        readonly description: "Number of minutes that the url for the payment form will remain active. After that time the form will be unaccessible and the reference expired. Max and default 1440 minutes";
                        readonly default: 1440;
                        readonly format: "int32";
                        readonly minimum: -2147483648;
                        readonly maximum: 2147483647;
                    };
                };
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Success"];
                };
                readonly statusSubs: {
                    readonly type: "string";
                    readonly examples: readonly ["Pending"];
                };
                readonly subscriptionID: {
                    readonly type: "string";
                    readonly examples: readonly ["5e7290a8d31b53489b896a9560bc93a3"];
                };
                readonly referenceSubs: {
                    readonly type: "string";
                    readonly examples: readonly ["14551"];
                };
                readonly redirectUrl: {
                    readonly type: "string";
                    readonly examples: readonly ["https://sandbox.eupago.pt/api/extern/creditcard/formsub/5e7290a8d31b53489b896a9560bc93a3"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {};
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const CreditCardRecurrencePayment: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["payment"];
        readonly properties: {
            readonly payment: {
                readonly type: "object";
                readonly properties: {
                    readonly amount: {
                        readonly type: "object";
                        readonly description: "Place your amount parameters";
                        readonly required: readonly ["value", "currency"];
                        readonly properties: {
                            readonly value: {
                                readonly type: "number";
                                readonly description: "Payment amount";
                                readonly format: "float";
                                readonly minimum: -3.402823669209385e+38;
                                readonly maximum: 3.402823669209385e+38;
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly default: "EUR";
                            };
                        };
                    };
                    readonly identifier: {
                        readonly type: "string";
                        readonly description: "Place a custom identifier to your payment request. In case of omission, it will assume the identifier of the corresponding authorization.";
                    };
                };
            };
            readonly customer: {
                readonly type: "object";
                readonly description: "To trigger the notification for the customer on successful payment.";
                readonly properties: {
                    readonly notify: {
                        readonly type: "boolean";
                        readonly description: "When it's 'True', it will trigger a notification by email/sms for the customer info setted on the corresponding authorization request.";
                    };
                };
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly recurrentID: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Parameter that can be consulted in Eupago's backOffice";
                };
            };
            readonly required: readonly ["recurrentID"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Success"];
                };
                readonly status: {
                    readonly type: "string";
                    readonly examples: readonly ["Paid"];
                };
                readonly transactionID: {
                    readonly type: "string";
                    readonly examples: readonly ["c7e59d7e0d835354a50081c43b9febcc"];
                };
                readonly reference: {
                    readonly type: "string";
                    readonly examples: readonly ["115805"];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Payment has been executed successfully."];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {};
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const DirectDebitAuthorization: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["debtor", "payment"];
        readonly properties: {
            readonly identifier: {
                readonly type: "string";
                readonly examples: readonly ["exemplo pedido recorrente mensal"];
            };
            readonly adminCallback: {
                readonly type: "string";
                readonly description: "Use this optional field to receive a communication when this reference is paid.";
            };
            readonly debtor: {
                readonly type: "object";
                readonly description: "Array with debtor information.";
                readonly required: readonly ["iban", "name", "bic", "email"];
                readonly properties: {
                    readonly address: {
                        readonly type: "object";
                        readonly description: "Debtor's Address";
                        readonly required: readonly ["zipCode", "country", "street", "locality"];
                        readonly properties: {
                            readonly zipCode: {
                                readonly type: "string";
                                readonly description: "zipCode of the address (do not insert the city)";
                            };
                            readonly country: {
                                readonly type: "string";
                            };
                            readonly street: {
                                readonly type: "string";
                            };
                            readonly locality: {
                                readonly type: "string";
                                readonly description: "City";
                            };
                        };
                    };
                    readonly iban: {
                        readonly type: "string";
                        readonly description: "Debtor's IBAN";
                    };
                    readonly name: {
                        readonly type: "string";
                        readonly description: "Debtor's Name";
                    };
                    readonly bic: {
                        readonly type: "string";
                        readonly description: "Debtor's BIC/SWIFT";
                    };
                    readonly email: {
                        readonly type: "string";
                        readonly description: "Debtor's Email. Used to send the Authorization PDF and next payment notifications.";
                    };
                };
            };
            readonly payment: {
                readonly type: "object";
                readonly description: "Array with payment information.";
                readonly required: readonly ["autoProcess", "limitDate", "type"];
                readonly properties: {
                    readonly date: {
                        readonly type: "string";
                        readonly description: "Format YYYY-MM-DD";
                        readonly format: "date";
                    };
                    readonly amount: {
                        readonly type: "number";
                        readonly format: "float";
                        readonly minimum: -3.402823669209385e+38;
                        readonly maximum: 3.402823669209385e+38;
                    };
                    readonly autoProcess: {
                        readonly type: "string";
                        readonly description: "Defines if the debit will processed by the API automatically (1) or there will be a manual debit instruction (0).";
                        readonly enum: readonly ["0", "1"];
                    };
                    readonly collectionDay: {
                        readonly type: "integer";
                        readonly description: "Mandatory if it is defined a periodicity and it's type is RCUR.";
                        readonly format: "int32";
                        readonly minimum: -2147483648;
                        readonly maximum: 2147483647;
                    };
                    readonly periodicity: {
                        readonly type: "string";
                        readonly description: "Defines the periodicity of the debit";
                        readonly enum: readonly ["Semanal", "Quinzenal", "Mensal", "Trimestral", "Semestral", "Anual"];
                    };
                    readonly limitDate: {
                        readonly type: "string";
                        readonly description: "Date (YYYY-MM-DD) defined to be the last debit for this Authorization";
                        readonly format: "date";
                    };
                    readonly type: {
                        readonly type: "string";
                        readonly description: "Type of debit. OOFF must be used on Authorizations that will only have one debit. RCUR is used for Authorizations that have recurring debits";
                        readonly enum: readonly ["OOFF", "RCUR"];
                    };
                };
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Success"];
                };
                readonly reference: {
                    readonly type: "string";
                    readonly examples: readonly ["101086000000011332"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Rejected"];
                };
                readonly code: {
                    readonly type: "string";
                    readonly examples: readonly ["APIKEY_MISSING"];
                };
                readonly text: {
                    readonly type: "string";
                    readonly examples: readonly ["API Key was not available in the request"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const DirectDebitPayment: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["date", "amount", "type"];
        readonly properties: {
            readonly date: {
                readonly type: "string";
                readonly description: "Debit Date (YYYY-MM-DD)";
                readonly format: "date";
                readonly examples: readonly ["2022-01-05"];
            };
            readonly amount: {
                readonly type: "number";
                readonly format: "float";
                readonly minimum: -3.402823669209385e+38;
                readonly maximum: 3.402823669209385e+38;
            };
            readonly type: {
                readonly type: "string";
                readonly description: "Type of debit. If it is the final debit of the Authorization you must send the value FNAL.";
                readonly default: "RCUR";
                readonly enum: readonly ["RCUR", "FNAL"];
            };
            readonly obs: {
                readonly type: "string";
                readonly description: "An optional field that will define the identifier of the reference. When missing the reference will assume the identifier of the corresponding Authorization";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly reference: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "authorizationId";
                };
            };
            readonly required: readonly ["reference"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Success"];
                };
                readonly collectionDate: {
                    readonly type: "string";
                    readonly examples: readonly ["2022-01-05"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Rejected"];
                };
                readonly code: {
                    readonly type: "string";
                    readonly examples: readonly ["APIKEY_MISSING"];
                };
                readonly text: {
                    readonly type: "string";
                    readonly examples: readonly ["API Key was not available in the request"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const Europix: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["payment"];
        readonly properties: {
            readonly payment: {
                readonly type: "object";
                readonly description: "Informations regarding the payment";
                readonly properties: {
                    readonly identifier: {
                        readonly type: "string";
                    };
                    readonly amount: {
                        readonly type: "object";
                        readonly required: readonly ["value", "currency"];
                        readonly properties: {
                            readonly value: {
                                readonly type: "number";
                                readonly description: "Payment amount";
                                readonly format: "float";
                                readonly minimum: -3.402823669209385e+38;
                                readonly maximum: 3.402823669209385e+38;
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly default: "EUR";
                            };
                        };
                    };
                };
            };
            readonly customer: {
                readonly type: "object";
                readonly description: "Informations regarding customer's notifications";
                readonly properties: {
                    readonly name: {
                        readonly type: "string";
                        readonly description: "Customer's name";
                    };
                    readonly vat: {
                        readonly type: "integer";
                        readonly format: "int32";
                        readonly minimum: -2147483648;
                        readonly maximum: 2147483647;
                    };
                    readonly email: {
                        readonly type: "string";
                    };
                    readonly countryCode: {
                        readonly type: "string";
                        readonly description: "Respective country code from the customer phone (+55 for brasil numbers)";
                    };
                    readonly phoneNumber: {
                        readonly type: "string";
                    };
                    readonly address: {
                        readonly type: "object";
                        readonly required: readonly ["street", "zipCode", "city", "state"];
                        readonly properties: {
                            readonly street: {
                                readonly type: "string";
                                readonly description: "Street name";
                            };
                            readonly zipCode: {
                                readonly type: "string";
                            };
                            readonly city: {
                                readonly type: "string";
                            };
                            readonly state: {
                                readonly type: "string";
                            };
                        };
                    };
                    readonly notify: {
                        readonly type: "boolean";
                        readonly default: false;
                    };
                };
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "201": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Success"];
                };
                readonly transactionID: {
                    readonly type: "string";
                    readonly examples: readonly ["fc4740349d5b350eca08fa5e503fa0aa"];
                };
                readonly reference: {
                    readonly type: "string";
                    readonly examples: readonly ["2914983"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Rejected"];
                };
                readonly code: {
                    readonly type: "string";
                    readonly examples: readonly ["APIKEY_MISSING"];
                };
                readonly text: {
                    readonly type: "string";
                    readonly examples: readonly ["API Key was not available in the request"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const FloaPayCreate: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["payment", "installmentCode", "items"];
        readonly properties: {
            readonly payment: {
                readonly type: "object";
                readonly description: "Informations regarding the payment";
                readonly required: readonly ["lang", "backUrl", "successUrl", "failUrl"];
                readonly properties: {
                    readonly identifier: {
                        readonly type: "string";
                    };
                    readonly amount: {
                        readonly type: "object";
                        readonly required: readonly ["value", "currency"];
                        readonly properties: {
                            readonly value: {
                                readonly type: "number";
                                readonly description: "Payment amount";
                                readonly format: "float";
                                readonly minimum: -3.402823669209385e+38;
                                readonly maximum: 3.402823669209385e+38;
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly default: "EUR";
                            };
                        };
                    };
                    readonly lang: {
                        readonly type: "string";
                        readonly description: "Defines the Language of the form. \"PT\" for Portuguese, \"ES\" for Spanish or \"FR\" for French";
                        readonly enum: readonly ["PT", "ES", "FR"];
                    };
                    readonly backUrl: {
                        readonly type: "string";
                        readonly description: "The costumer will be forwarded to this url if the user presses back.";
                    };
                    readonly successUrl: {
                        readonly type: "string";
                        readonly description: "The costumer will be forwarded to this url if the payment process is successful.The payer will be forwarded to this url if the user presses back.";
                    };
                    readonly failUrl: {
                        readonly type: "string";
                        readonly description: "The costumer will be forwarded to this url if the payment process fails (eg: no funds)";
                    };
                    readonly reportDelayInDays: {
                        readonly type: "string";
                        readonly description: "Only for Pay Later installmentCodes ( 'BC1XCD', 'BC1XFD','BC1XCDSP', 'BC1XFDSP', 'BC1XFDPT')";
                    };
                    readonly "": {
                        readonly type: "string";
                    };
                };
            };
            readonly installmentCode: {
                readonly type: "string";
                readonly description: "The installment code defines the number of installments in which the customer will pay and whether there will be fees for it. It is limited by country and amount.";
                readonly enum: readonly ["BC3XC", "BC3XF", "BC4XC", "BC4XF", "BC10XC", "BC10XP", "BC10XF", "BC1XCD", "BC1XFD", "BC1XCDSP", "BC3XFSP", "BC3XCSP", "BC4XFSP", "BC4XCSP", "BC1XFDSP", "BC3XFPT", "BC4XFPT", "BC1XFDPT"];
            };
            readonly items: {
                readonly type: "object";
                readonly description: "All items in the order. This param may include different objects (items).";
                readonly required: readonly ["name", "price", "quantity", "category", "subCategory"];
                readonly properties: {
                    readonly name: {
                        readonly type: "string";
                    };
                    readonly price: {
                        readonly type: "number";
                        readonly description: "Total price for this kind of product (the sum of all quantities)";
                        readonly format: "float";
                        readonly minimum: -3.402823669209385e+38;
                        readonly maximum: 3.402823669209385e+38;
                    };
                    readonly quantity: {
                        readonly type: "integer";
                        readonly description: "Number of products of this kind";
                        readonly format: "int32";
                        readonly minimum: -2147483648;
                        readonly maximum: 2147483647;
                    };
                    readonly category: {
                        readonly type: "string";
                        readonly description: "Indicate the product category. For example Tech";
                    };
                    readonly subCategory: {
                        readonly type: "string";
                        readonly description: "Indicate the subcategory of the product. For example Headphones";
                    };
                };
            };
            readonly customer: {
                readonly type: "object";
                readonly description: "Customer information that can be filled later on the Floa form if not sent on this request.";
                readonly properties: {
                    readonly civility: {
                        readonly type: "string";
                        readonly description: "The courtesy title \"Mr\" from Mister is used for men regardless of marital status. \"Mrs\" from Mistress and \"Ms\" from \"Miss\" are used for married and unmarried women, respectively.";
                        readonly enum: readonly ["'Mr'", "'Ms'", "'Mrs'"];
                    };
                    readonly firstName: {
                        readonly type: "string";
                        readonly description: "Customer first name";
                    };
                    readonly lastName: {
                        readonly type: "string";
                        readonly description: "Customer last name";
                    };
                    readonly secondLastName: {
                        readonly type: "string";
                        readonly description: "Mandatory for \"Mrs\" civility only. (Usually the husband last name when it's adopted by the wife).";
                    };
                    readonly birthDate: {
                        readonly type: "string";
                        readonly description: "Birth date of the customer. Please input on the format YYYY-MM-DD (example 2000-05-07)";
                    };
                    readonly birthDepartment: {
                        readonly type: "string";
                        readonly description: "The birth department field it's mandatory and applied for France only";
                    };
                    readonly email: {
                        readonly type: "string";
                        readonly description: "Customer email address";
                    };
                    readonly phoneNumber: {
                        readonly type: "string";
                        readonly description: "Customer phone number";
                    };
                    readonly countryCodePhone: {
                        readonly type: "string";
                        readonly description: "Country calling code for the client phone. For portuguese numbers for example, you must input \"+351\"";
                    };
                    readonly vatNumber: {
                        readonly type: "string";
                        readonly description: "VAT identification number";
                    };
                    readonly billingAddress: {
                        readonly type: "object";
                        readonly description: "Customer billing address information";
                        readonly properties: {
                            readonly address: {
                                readonly type: "string";
                                readonly description: "Street name";
                            };
                            readonly zipCode: {
                                readonly type: "string";
                                readonly description: "Postcode must be entered in the format of the country in question. For example, for Portugal enter 4150-124";
                            };
                            readonly city: {
                                readonly type: "string";
                            };
                            readonly countryCode: {
                                readonly type: "string";
                                readonly description: "Defines the Language of the form. \"PT\" for Portugal, \"ES\" for Spain or \"FR\" for France";
                                readonly enum: readonly ["PT", "ES", "FR"];
                            };
                        };
                    };
                    readonly "": {
                        readonly type: "string";
                    };
                };
            };
            readonly shippingAddress: {
                readonly type: "object";
                readonly description: "Address whre the products will be shipped to the customer";
                readonly properties: {
                    readonly shippingMethod: {
                        readonly type: "string";
                        readonly description: "STD -> Standard Delivery, EXP -> Express Delivery, TRK -> Tracked Delivery , REG -> Registed Delivery, COL -> Colissimo, CHR -> Chronopost, REL -> Point Relais, TNT , UPS , TRP -> Transporter , MAG -> Store Delivery, LCK -> Lockers, VIR -> Virtual, RIM ->Immediate pick-up store";
                        readonly enum: readonly ["STD", "EXP", "TRK", "REG", "COL", "CHR", "REL", "TNT", "UPS", "TRP", "MAG", "LCK", "VIR", "RIM"];
                    };
                    readonly address: {
                        readonly type: "string";
                        readonly description: "Street name";
                    };
                    readonly zipCode: {
                        readonly type: "string";
                        readonly description: "Postcode must be entered in the format of the country in question. For example, for Portugal enter 4150-124";
                    };
                    readonly city: {
                        readonly type: "string";
                    };
                    readonly countryCode: {
                        readonly type: "string";
                        readonly description: "Defines the country to be shipped the items. \"PT\" for Portugal, \"ES\" for Spain or \"FR\" for France";
                        readonly enum: readonly ["PT", "ES", "FR"];
                    };
                };
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "201": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Success"];
                };
                readonly transactionID: {
                    readonly type: "string";
                    readonly examples: readonly ["019257d2ea277c9a8d7a3abb07833c9c"];
                };
                readonly reference: {
                    readonly type: "string";
                    readonly examples: readonly ["159213"];
                };
                readonly redirectUrl: {
                    readonly type: "string";
                    readonly examples: readonly ["https://sandbox.eupago.pt/api/extern/floa/form/019257d2ea277c9a8d7a3abb07833c9c"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Rejected"];
                };
                readonly code: {
                    readonly type: "string";
                    readonly examples: readonly ["COUNTRY_INVALID"];
                };
                readonly text: {
                    readonly type: "string";
                    readonly examples: readonly ["Country is invalid"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const FloaPaySimulation: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["payment", "countryCode"];
        readonly properties: {
            readonly payment: {
                readonly type: "object";
                readonly required: readonly ["value", "currency"];
                readonly properties: {
                    readonly value: {
                        readonly type: "number";
                        readonly description: "Payment amount";
                        readonly format: "float";
                        readonly minimum: -3.402823669209385e+38;
                        readonly maximum: 3.402823669209385e+38;
                    };
                    readonly currency: {
                        readonly type: "string";
                        readonly default: "EUR";
                    };
                };
            };
            readonly countryCode: {
                readonly type: "string";
                readonly description: "Which country are you going to ship (sell) the product";
                readonly enum: readonly ["PT", "ES", "FR"];
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "201": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Success"];
                };
                readonly installmentOptions: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly productName: {
                                readonly type: "string";
                                readonly examples: readonly ["4X BC FREE PT"];
                            };
                            readonly productCode: {
                                readonly type: "string";
                                readonly examples: readonly ["BC4XFPT"];
                            };
                            readonly countryCode: {
                                readonly type: "string";
                                readonly examples: readonly ["PT"];
                            };
                            readonly installmentCount: {
                                readonly type: "integer";
                                readonly default: 0;
                                readonly examples: readonly [4];
                            };
                            readonly customerFees: {
                                readonly type: "string";
                                readonly examples: readonly ["0,00"];
                            };
                            readonly customerTotalAmount: {
                                readonly type: "string";
                                readonly examples: readonly ["2000,00"];
                            };
                            readonly merchantFinancedAmount: {
                                readonly type: "string";
                                readonly examples: readonly ["2000,00"];
                            };
                            readonly merchantFees: {
                                readonly type: "string";
                                readonly examples: readonly ["0,00"];
                            };
                            readonly merchantServiceFees: {
                                readonly type: "string";
                                readonly examples: readonly ["40,00"];
                            };
                            readonly merchantTotalAmount: {
                                readonly type: "string";
                                readonly examples: readonly ["40,00"];
                            };
                            readonly simulatedInstallments: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly rank: {
                                            readonly type: "integer";
                                            readonly default: 0;
                                            readonly examples: readonly [1];
                                        };
                                        readonly date: {
                                            readonly type: "string";
                                            readonly examples: readonly ["2024-10-04"];
                                        };
                                        readonly amount: {
                                            readonly type: "string";
                                            readonly examples: readonly ["500,00"];
                                        };
                                    };
                                };
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly examples: readonly ["EUR"];
                            };
                        };
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Rejected"];
                };
                readonly code: {
                    readonly type: "string";
                    readonly examples: readonly ["FLOA_LOADFORM_BAD_REQUEST"];
                };
                readonly text: {
                    readonly type: "string";
                    readonly examples: readonly ["Unable to process load form request with Floa"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const MbWayCopy: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["payment"];
        readonly properties: {
            readonly payment: {
                readonly type: "object";
                readonly description: "Informations regarding the payment";
                readonly properties: {
                    readonly identifier: {
                        readonly type: "string";
                    };
                    readonly amount: {
                        readonly type: "object";
                        readonly required: readonly ["value", "currency"];
                        readonly properties: {
                            readonly value: {
                                readonly type: "number";
                                readonly description: "Payment amount";
                                readonly format: "float";
                                readonly minimum: -3.402823669209385e+38;
                                readonly maximum: 3.402823669209385e+38;
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly default: "EUR";
                            };
                        };
                    };
                    readonly successUrl: {
                        readonly type: "string";
                        readonly description: "The payer will be forwarded to this url if the payment process is successful.";
                        readonly default: "https://eupago.pt";
                    };
                    readonly failUrl: {
                        readonly type: "string";
                        readonly description: "The payer will be forwarded to this url if the payment process fails (eg: no funds)";
                    };
                    readonly cancelUrl: {
                        readonly type: "string";
                        readonly description: "The URL to which the user is redirected in the event of a cancelled transaction";
                    };
                    readonly pendingUrl: {
                        readonly type: "string";
                        readonly description: "The URL to which the user is redirected in the event of a pending transaction";
                    };
                    readonly challengeUrl: {
                        readonly type: "string";
                        readonly description: "Received in the response message and indicates to which URL to redirect the shopper.";
                    };
                    readonly backUrl: {
                        readonly type: "string";
                        readonly description: "The payer will be forwarded to this url if the user presses back.";
                    };
                    readonly lang: {
                        readonly type: "string";
                        readonly description: "Defines the Language of the form. \"PT\" for Portuguese, \"ES\" for Spanish or \"EN\" for English";
                        readonly default: "PT";
                    };
                    readonly minutesFormUp: {
                        readonly type: "integer";
                        readonly description: "Number of minutes that the url for the payment form will remain active. After that time the form will be unaccessible and the reference expired. Max 1440 minutes";
                        readonly default: 1440;
                        readonly format: "int32";
                        readonly minimum: -2147483648;
                        readonly maximum: 2147483647;
                    };
                };
            };
            readonly customer: {
                readonly type: "object";
                readonly description: "Informations regarding customer's notifications";
                readonly properties: {
                    readonly notify: {
                        readonly type: "boolean";
                        readonly description: "A parameter that defines if the final client want to be notified of the payment request by email";
                    };
                    readonly failOver: {
                        readonly type: "string";
                        readonly description: "A parameter that defines if the final client will recieve an sms/email reminder notification in case of fail payment (\"0\" or \"1\" string value)";
                    };
                    readonly name: {
                        readonly type: "string";
                        readonly description: "Customer's name";
                    };
                    readonly email: {
                        readonly type: "string";
                        readonly description: "Customer's email (required if failOver = \"1\")";
                    };
                    readonly phone: {
                        readonly type: "string";
                        readonly description: "Customer's phone number  (required if failOver = \"1\", 9 digits string)";
                    };
                };
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "201": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Success"];
                };
                readonly transactionID: {
                    readonly type: "string";
                    readonly examples: readonly ["fc4740349d5b350eca08fa5e503fa0aa"];
                };
                readonly reference: {
                    readonly type: "string";
                    readonly examples: readonly ["2914983"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Rejected"];
                };
                readonly code: {
                    readonly type: "string";
                    readonly examples: readonly ["APIKEY_MISSING"];
                };
                readonly text: {
                    readonly type: "string";
                    readonly examples: readonly ["API Key was not available in the request"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const Mbway: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["payment"];
        readonly properties: {
            readonly payment: {
                readonly type: "object";
                readonly description: "Informations regarding the payment";
                readonly required: readonly ["customerPhone", "countryCode"];
                readonly properties: {
                    readonly identifier: {
                        readonly type: "string";
                    };
                    readonly amount: {
                        readonly type: "object";
                        readonly required: readonly ["value", "currency"];
                        readonly properties: {
                            readonly value: {
                                readonly type: "number";
                                readonly description: "Payment amount";
                                readonly format: "float";
                                readonly minimum: -3.402823669209385e+38;
                                readonly maximum: 3.402823669209385e+38;
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly default: "EUR";
                            };
                        };
                    };
                    readonly customerPhone: {
                        readonly type: "string";
                        readonly description: "Phone number that is connected to the MB WAY app and will accept the payment";
                    };
                    readonly countryCode: {
                        readonly type: "string";
                        readonly description: "Respective country code from the customer phone (+351 for portuguese number)";
                    };
                };
            };
            readonly customer: {
                readonly type: "object";
                readonly description: "Informations regarding customer's notifications";
                readonly properties: {
                    readonly notify: {
                        readonly type: "boolean";
                        readonly description: "A parameter that defines if the final client want to be notified of the payment request by email";
                    };
                    readonly failOver: {
                        readonly type: "string";
                        readonly description: "A parameter that defines if the final client will recieve an sms/email reminder notification in case of fail payment (\"0\" or \"1\" string value)";
                    };
                    readonly name: {
                        readonly type: "string";
                        readonly description: "Customer's name";
                    };
                    readonly email: {
                        readonly type: "string";
                        readonly description: "Customer's email (required if failOver = \"1\")";
                    };
                    readonly phone: {
                        readonly type: "string";
                        readonly description: "Customer's phone number  (required if failOver = \"1\", 9 digits string)";
                    };
                };
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "201": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Success"];
                };
                readonly transactionID: {
                    readonly type: "string";
                    readonly examples: readonly ["fc4740349d5b350eca08fa5e503fa0aa"];
                };
                readonly reference: {
                    readonly type: "string";
                    readonly examples: readonly ["2914983"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Rejected"];
                };
                readonly code: {
                    readonly type: "string";
                    readonly examples: readonly ["APIKEY_MISSING"];
                };
                readonly text: {
                    readonly type: "string";
                    readonly examples: readonly ["API Key was not available in the request"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const MultibancoBatch: {
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {};
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {};
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const P24: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["amount", "urlreturn"];
        readonly properties: {
            readonly amount: {
                readonly type: "number";
                readonly description: "Amount to pay in Złoty (‎PLN‎)‎.";
                readonly format: "float";
                readonly examples: readonly [5.22];
                readonly minimum: -3.402823669209385e+38;
                readonly maximum: 3.402823669209385e+38;
            };
            readonly identifier: {
                readonly type: "string";
            };
            readonly urlreturn: {
                readonly type: "string";
                readonly description: "Used to define the url to where the customer will be redirected he/she finishes the payment.";
            };
            readonly admincallback: {
                readonly type: "string";
                readonly description: "Use this optional param to receive a communication when this reference is paid.";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "201": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Success"];
                };
                readonly urlresult: {
                    readonly type: "string";
                    readonly examples: readonly ["https://sandbox.przelewy24.pl/trnRequest/7A2C48BF8C-850839-8CEA01-B589ACBFFC"];
                };
                readonly reference: {
                    readonly type: "string";
                    readonly examples: readonly ["000000964"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly oneOf: readonly [{
                readonly title: "Amount Missing";
                readonly type: "object";
                readonly properties: {
                    readonly transactionStatus: {
                        readonly type: "string";
                        readonly examples: readonly ["Rejected"];
                    };
                    readonly code: {
                        readonly type: "string";
                        readonly examples: readonly ["AMOUNT_MISSING"];
                    };
                    readonly text: {
                        readonly type: "string";
                        readonly examples: readonly ["Amount was not available in the request"];
                    };
                };
            }, {
                readonly title: "Urlreturn Missing";
                readonly type: "object";
                readonly properties: {
                    readonly transactionStatus: {
                        readonly type: "string";
                        readonly examples: readonly ["Rejected"];
                    };
                    readonly code: {
                        readonly type: "string";
                        readonly examples: readonly ["URLRETURN_MISSING"];
                    };
                    readonly text: {
                        readonly type: "string";
                        readonly examples: readonly ["Url Return was not available in the request"];
                    };
                };
            }];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Rejected"];
                };
                readonly code: {
                    readonly type: "string";
                    readonly examples: readonly ["APIKEY_MISSING"];
                };
                readonly text: {
                    readonly type: "string";
                    readonly examples: readonly ["API Key was not available in the request"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const Paybylink: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["payment"];
        readonly properties: {
            readonly payment: {
                readonly type: "object";
                readonly description: "Informations regarding the payment";
                readonly properties: {
                    readonly identifier: {
                        readonly type: "string";
                    };
                    readonly amount: {
                        readonly type: "object";
                        readonly required: readonly ["value", "currency"];
                        readonly properties: {
                            readonly value: {
                                readonly type: "number";
                                readonly description: "Payment amount";
                                readonly format: "float";
                                readonly minimum: -3.402823669209385e+38;
                                readonly maximum: 3.402823669209385e+38;
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly default: "EUR";
                            };
                        };
                    };
                    readonly shipping: {
                        readonly type: "object";
                        readonly required: readonly ["value"];
                        readonly properties: {
                            readonly value: {
                                readonly type: "number";
                                readonly description: "Shipping amount";
                                readonly default: 0;
                                readonly format: "float";
                                readonly minimum: -3.402823669209385e+38;
                                readonly maximum: 3.402823669209385e+38;
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly default: "EUR";
                            };
                        };
                    };
                    readonly lang: {
                        readonly type: "string";
                        readonly description: "Defines the Language of the email notifications.";
                        readonly default: "PT";
                    };
                    readonly expirationDate: {
                        readonly type: "string";
                        readonly description: "Defines the date when the link will expire (Default value is 24 hours after the link creation)";
                        readonly default: "2099-12-31 23:59:59";
                        readonly format: "date";
                    };
                    readonly successUrl: {
                        readonly type: "string";
                        readonly description: "The payer will be forwarded to this url if the payment process is successful.";
                    };
                    readonly failUrl: {
                        readonly type: "string";
                        readonly description: "The payer will be forwarded to this url if the payment process fails.";
                    };
                    readonly backUrl: {
                        readonly type: "string";
                        readonly description: "The payer will be forwarded to this url if the user presses back.";
                    };
                };
            };
            readonly products: {
                readonly type: "array";
                readonly description: "All products in the order. This param may include different objects (products).";
                readonly items: {
                    readonly properties: {
                        readonly sku: {
                            readonly type: "string";
                            readonly description: "Product code (Required to pay with Cofidis Pay)";
                        };
                        readonly name: {
                            readonly type: "string";
                            readonly description: "Product name";
                        };
                        readonly value: {
                            readonly type: "number";
                            readonly description: "Product price";
                            readonly format: "float";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly quantity: {
                            readonly type: "integer";
                            readonly description: "Number of times this product is ordered  (Required to pay with Cofidis Pay)";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly tax: {
                            readonly type: "number";
                            readonly description: "Tax percentage (Required to pay with Cofidis Pay)";
                            readonly format: "float";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly discount: {
                            readonly type: "number";
                            readonly description: "(Required to pay with Cofidis Pay)";
                            readonly format: "float";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly description: {
                            readonly type: "string";
                            readonly description: "Text describing the product (Required to pay with Cofidis Pay)";
                        };
                    };
                    readonly required: readonly ["value"];
                    readonly type: "object";
                };
            };
            readonly customer: {
                readonly type: "object";
                readonly description: "Informations regarding customer's notifications";
                readonly properties: {
                    readonly notify: {
                        readonly type: "boolean";
                    };
                    readonly email: {
                        readonly type: "string";
                        readonly description: "Customer's email";
                    };
                    readonly nome: {
                        readonly type: "string";
                        readonly description: "Customer's name";
                    };
                };
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Success"];
                };
                readonly transactionID: {
                    readonly type: "string";
                    readonly examples: readonly ["af3df607c6724870be962a69cac30b99"];
                };
                readonly status: {
                    readonly type: "string";
                    readonly examples: readonly ["Pendente"];
                };
                readonly redirectUrl: {
                    readonly type: "string";
                    readonly examples: readonly ["https://sandbox.eupago.pt/api/extern/paybylink/form/af3df607c6724870be962a69cac30b99"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Rejected"];
                };
                readonly code: {
                    readonly type: "string";
                    readonly examples: readonly ["APIKEY_MISSING"];
                };
                readonly text: {
                    readonly type: "string";
                    readonly examples: readonly ["API Key was not available in the request"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const PaybylinkQrcode: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["payment"];
        readonly properties: {
            readonly payment: {
                readonly type: "object";
                readonly description: "Informations regarding the payment";
                readonly properties: {
                    readonly identifier: {
                        readonly type: "string";
                    };
                    readonly amount: {
                        readonly type: "object";
                        readonly required: readonly ["value", "currency"];
                        readonly properties: {
                            readonly value: {
                                readonly type: "number";
                                readonly description: "Payment amount";
                                readonly format: "float";
                                readonly minimum: -3.402823669209385e+38;
                                readonly maximum: 3.402823669209385e+38;
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly default: "EUR";
                            };
                        };
                    };
                    readonly shipping: {
                        readonly type: "object";
                        readonly required: readonly ["value"];
                        readonly properties: {
                            readonly value: {
                                readonly type: "number";
                                readonly description: "Shipping amount";
                                readonly default: 0;
                                readonly format: "float";
                                readonly minimum: -3.402823669209385e+38;
                                readonly maximum: 3.402823669209385e+38;
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly default: "EUR";
                            };
                        };
                    };
                    readonly lang: {
                        readonly type: "string";
                        readonly description: "Defines the Language of the email notifications.";
                        readonly default: "PT";
                    };
                    readonly expirationDate: {
                        readonly type: "string";
                        readonly description: "Defines the date when the link will expire (Default value is 24 hours after the link creation)";
                        readonly default: "2099-12-31 23:59:59";
                        readonly format: "date";
                    };
                    readonly successUrl: {
                        readonly type: "string";
                        readonly description: "The payer will be forwarded to this url if the payment process is successful.";
                    };
                    readonly failUrl: {
                        readonly type: "string";
                        readonly description: "The payer will be forwarded to this url if the payment process fails.";
                    };
                    readonly backUrl: {
                        readonly type: "string";
                        readonly description: "The payer will be forwarded to this url if the user presses back.";
                    };
                };
            };
            readonly products: {
                readonly type: "array";
                readonly description: "All products in the order. This param may include different objects (products).";
                readonly items: {
                    readonly properties: {
                        readonly sku: {
                            readonly type: "string";
                            readonly description: "Product code (Required to pay with Cofidis Pay)";
                        };
                        readonly name: {
                            readonly type: "string";
                            readonly description: "Product name";
                        };
                        readonly value: {
                            readonly type: "number";
                            readonly description: "Product price";
                            readonly format: "float";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly quantity: {
                            readonly type: "integer";
                            readonly description: "Number of times this product is ordered  (Required to pay with Cofidis Pay)";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly tax: {
                            readonly type: "number";
                            readonly description: "Tax percentage (Required to pay with Cofidis Pay)";
                            readonly format: "float";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly discount: {
                            readonly type: "number";
                            readonly description: "(Required to pay with Cofidis Pay)";
                            readonly format: "float";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly description: {
                            readonly type: "string";
                            readonly description: "Text describing the product (Required to pay with Cofidis Pay)";
                        };
                    };
                    readonly required: readonly ["value"];
                    readonly type: "object";
                };
            };
            readonly customer: {
                readonly type: "object";
                readonly description: "Informations regarding customer's notifications";
                readonly properties: {
                    readonly notify: {
                        readonly type: "boolean";
                    };
                    readonly email: {
                        readonly type: "string";
                        readonly description: "Customer's email";
                    };
                    readonly nome: {
                        readonly type: "string";
                        readonly description: "Customer's name";
                    };
                };
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Rejected"];
                };
                readonly code: {
                    readonly type: "string";
                    readonly examples: readonly ["APIKEY_MISSING"];
                };
                readonly text: {
                    readonly type: "string";
                    readonly examples: readonly ["API Key was not available in the request"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const SantanderConsumer: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["payment", "customer"];
        readonly properties: {
            readonly payment: {
                readonly type: "object";
                readonly description: "Informations regarding the payment";
                readonly required: readonly ["successUrl", "failUrl", "backUrl"];
                readonly properties: {
                    readonly identifier: {
                        readonly type: "string";
                    };
                    readonly amount: {
                        readonly type: "object";
                        readonly required: readonly ["value", "currency"];
                        readonly properties: {
                            readonly value: {
                                readonly type: "number";
                                readonly description: "Payment amount";
                                readonly format: "float";
                                readonly minimum: -3.402823669209385e+38;
                                readonly maximum: 3.402823669209385e+38;
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly default: "EUR";
                            };
                        };
                    };
                    readonly successUrl: {
                        readonly type: "string";
                        readonly description: "The payer will be forwarded to this url if the payment process is successful.";
                    };
                    readonly failUrl: {
                        readonly type: "string";
                        readonly description: "The payer will be forwarded to this url if the payment process fails (eg: no funds, problems with 3DS)";
                    };
                    readonly backUrl: {
                        readonly type: "string";
                        readonly description: "The payer will be forwarded to this url if the user presses back.";
                    };
                    readonly lang: {
                        readonly type: "string";
                        readonly description: "Defines the Language of the form.";
                        readonly default: "PT";
                    };
                    readonly minutesFormUp: {
                        readonly type: "integer";
                        readonly description: "Number of minutes that the url for the payment form will remain active. After that time the form will be unaccessible and the reference expired. Max and default 1440 minutes";
                        readonly default: 1440;
                        readonly format: "int32";
                        readonly minimum: -2147483648;
                        readonly maximum: 2147483647;
                    };
                };
            };
            readonly customer: {
                readonly type: "object";
                readonly description: "Informations regarding customer's notifications";
                readonly required: readonly ["notify", "email"];
                readonly properties: {
                    readonly notify: {
                        readonly type: "boolean";
                        readonly default: true;
                    };
                    readonly email: {
                        readonly type: "string";
                        readonly description: "Customer's email";
                    };
                };
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Rejected"];
                };
                readonly code: {
                    readonly type: "string";
                    readonly examples: readonly ["APIKEY_MISSING"];
                };
                readonly text: {
                    readonly type: "string";
                    readonly examples: readonly ["API Key was not available in the request"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const SplitPayments: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["amount", "beneficiaries"];
        readonly properties: {
            readonly amount: {
                readonly type: "number";
                readonly description: "Total amount of the transaction.";
                readonly format: "float";
                readonly examples: readonly [4.68];
                readonly minimum: -3.402823669209385e+38;
                readonly maximum: 3.402823669209385e+38;
            };
            readonly identifier: {
                readonly type: "string";
                readonly description: "Transaction identifier";
                readonly examples: readonly ["Pedido split-payments Multibanco - Dois beneficiários"];
            };
            readonly alias: {
                readonly type: "string";
                readonly description: "Param used only on MB WAY requests. It must be used to define to which phone number the request must be sent.";
                readonly examples: readonly ["123456789"];
            };
            readonly adminCallback: {
                readonly type: "string";
                readonly description: "Use this optional field to receive a communication when this reference is paid.";
                readonly examples: readonly ["https://eupago.pt"];
            };
            readonly successUrl: {
                readonly type: "string";
                readonly description: "Param used only on Bizum requests. It must define the URL to which the payer will be redirected upon successful completion of the payment process.";
            };
            readonly failUrl: {
                readonly type: "string";
                readonly description: "Param used only on Bizum requests. It must define the URL to which the payer will be redirected upon failed completion of the payment process.";
            };
            readonly beneficiaries: {
                readonly type: "array";
                readonly description: "Array with the information of the beneficiaries of the funds of this transaction.";
                readonly items: {
                    readonly properties: {
                        readonly externKey: {
                            readonly type: "string";
                            readonly description: "External Key of an EuPago account. This key is not the API Key. Please contact our Support Team for more information.";
                            readonly default: "xxxx-xxxx-xxxx-xxxx-xxxx";
                        };
                        readonly amount: {
                            readonly type: "number";
                            readonly description: "Amount this particular beneficiary will receive";
                            readonly format: "float";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly identifier: {
                            readonly type: "string";
                            readonly description: "Transaction identifier for this particular beneficiary.";
                        };
                        readonly immediatePayment: {
                            readonly type: "boolean";
                            readonly description: "Set if the payment should be immediate.";
                        };
                    };
                    readonly required: readonly ["externKey", "amount"];
                    readonly type: "object";
                };
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "payment-method": {
                    readonly type: "string";
                    readonly enum: readonly ["multibanco", "mbway", "bizum", "pix"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Defines the payment method";
                };
            };
            readonly required: readonly ["payment-method"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Success"];
                };
                readonly entity: {
                    readonly type: "string";
                    readonly examples: readonly ["82307"];
                };
                readonly reference: {
                    readonly type: "string";
                    readonly examples: readonly ["100502152"];
                };
                readonly amount: {
                    readonly type: "string";
                    readonly examples: readonly ["4.68"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly transactionStatus: {
                    readonly type: "string";
                    readonly examples: readonly ["Rejected"];
                };
                readonly code: {
                    readonly type: "string";
                    readonly examples: readonly ["APIKEY_MISSING"];
                };
                readonly text: {
                    readonly type: "string";
                    readonly examples: readonly ["API Key was not available in the request"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
export { Bizum, CofidisPay, CreditCard, CreditCardRecurrenceAuthorization, CreditCardRecurrencePayment, DirectDebitAuthorization, DirectDebitPayment, Europix, FloaPayCreate, FloaPaySimulation, MbWayCopy, Mbway, MultibancoBatch, P24, Paybylink, PaybylinkQrcode, SantanderConsumer, SplitPayments };
