CREATE TABLE "trade_history" (
	"_id"	ObjectID		NOT NULL,
	"sellerID"	int		NOT NULL,
	"buyerID"	int		NOT NULL,
	"sell_offer_id"	int		NOT NULL,
	"buy_offer_id"	int		NOT NULL,
	"created_at"	Time	NOT 	NULL,
	"updated_at"	Time  	NOT NULL,
	"deleted_at"	Time		NOT NULL
);

COMMENT ON COLUMN "nft_trade_history"."id" IS '기본키';

COMMENT ON COLUMN "nft_trade_history"."seller_id" IS '판매자 ID';

COMMENT ON COLUMN "nft_trade_history"."buyer_id" IS '구매자 ID';

COMMENT ON COLUMN "nft_trade_history"."sell_offer_id" IS '판매 등록';

COMMENT ON COLUMN "nft_trade_history"."buy_offer_id" IS '구매 요청';

COMMENT ON COLUMN "nft_trade_history"."created_at" IS '생성일자';

COMMENT ON COLUMN "nft_trade_history"."updated_at" IS '수정일자';

COMMENT ON COLUMN "nft_trade_history"."deleted_at" IS '삭제일자';

ALTER TABLE "trade_history" ADD CONSTRAINT "PK_NFT_TRADE_HISTORY" PRIMARY KEY (
	"id"
);

