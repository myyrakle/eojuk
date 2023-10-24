CREATE TABLE "payment_method" (
	"_id"	ObjectID		NOT NULL,
	"shopID"	ObjectID		NOT NULL,
	"cardName"	string		NULL,
	"cardAlias"	string		NULL,
	"isDefault"	bool		NULL,
	"customer_uid"	string		NULL,
	"merchant_uid"	string		NULL,
	"email"	string		NULL,
	"cardNumber"	string		NULL,
	"expirePeriod"	string		NULL,
	"cardCompany"	string		NULL,
	"createDate"	Time		NULL,
	"deleteDate"	Time		NULL
);

COMMENT ON COLUMN "payment_method"."cardAlias" IS '결제수단 별명';

COMMENT ON COLUMN "payment_method"."cardNumber" IS '마스킹';

COMMENT ON COLUMN "payment_method"."expirePeriod" IS '마스킹';

ALTER TABLE "payment_method" ADD CONSTRAINT "PK_PAYMENT_METHOD" PRIMARY KEY (
	"_id"
);