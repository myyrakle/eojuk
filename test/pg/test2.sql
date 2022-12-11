CREATE TABLE "trade_history" (
	"id"	serial8		NOT NULL,
	"seller_id"	int		NULL,
	"buyer_id"	int		NULL,
	"price"	decimal(20,2)		NOT NULL,
	"trade_fee"	decimal(20,2)		NULL,
	"sell_offer_id"	int8		NULL,
	"buy_offer_id"	int8		NULL,
	"created_at"	timestamptz	DEFAULT now()	NULL,
	"updated_at"	timestamptz	DEFAULT now()	NULL,
	"deleted_at"	timestamptz		NULL
);

COMMENT ON COLUMN "nft_trade_history"."id" IS '기본키';

COMMENT ON COLUMN "nft_trade_history"."seller_id" IS '판매자 ID';

COMMENT ON COLUMN "nft_trade_history"."buyer_id" IS '구매자 ID';

COMMENT ON COLUMN "nft_trade_history"."price" IS '거래 체결가격';

COMMENT ON COLUMN "nft_trade_history"."trade_fee" IS '거래 수수료';

COMMENT ON COLUMN "nft_trade_history"."sell_offer_id" IS '판매 등록';

COMMENT ON COLUMN "nft_trade_history"."buy_offer_id" IS '구매 요청';

COMMENT ON COLUMN "nft_trade_history"."created_at" IS '생성일자';

COMMENT ON COLUMN "nft_trade_history"."updated_at" IS '수정일자';

COMMENT ON COLUMN "nft_trade_history"."deleted_at" IS '삭제일자';

ALTER TABLE "trade_history" ADD CONSTRAINT "PK_NFT_TRADE_HISTORY" PRIMARY KEY (
	"id"
);

