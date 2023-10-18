CREATE TABLE "trade_history" (
	"_id"	ObjectID		NOT NULL,
	"sellerID"	int		NOT NULL,
	"buyerID"	int		NOT NULL,
	"sellOfferID"	int		NOT NULL,
	"buyOfferID"	int		NOT NULL,
	"createDate"	Time	 	NULL,
	"updateDate"	Time  	NOT NULL,
	"deleteDate"	Time		NOT NULL
);

COMMENT ON COLUMN "trade_history"."_id" IS '기본키';

COMMENT ON COLUMN "trade_history"."sellerID" IS '판매자 ID';

COMMENT ON COLUMN "trade_history"."buyerID" IS '구매자 ID';

COMMENT ON COLUMN "trade_history"."sellOfferID" IS '판매 등록';

COMMENT ON COLUMN "trade_history"."buyOfferID" IS '구매 요청';

COMMENT ON COLUMN "trade_history"."createDate" IS '생성일자';

COMMENT ON COLUMN "trade_history"."updateDate" IS '수정일자';

COMMENT ON COLUMN "trade_history"."deleteDate" IS '삭제일자';
