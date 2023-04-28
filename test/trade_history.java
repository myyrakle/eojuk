
// If under EE 9, change jakarta to javax
import jakarta.annotation.*;
import jakarta.persistence.*;
import jakarta.persistence.Table;

import org.hibernate.annotations.*;
import java.time.LocalDateTime;

@Entity()
@Table(name = ""trade_history"", schema = ""foo"")
public class TradeHistory {

    Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @NotNull
    Long id;


    @Column(name = "seller_id")
    @Nullable
    Integer sellerId;


    @Column(name = "buyer_id")
    @Nullable
    Integer buyerId;


    @Column(name = "price")
    @NotNull
    string price;


    @Column(name = "trade_fee")
    @Nullable
    string tradeFee;


    @Column(name = "sell_offer_id")
    @Nullable
    Long sellOfferId;


    @Column(name = "buy_offer_id")
    @Nullable
    Long buyOfferId;


    @Column(name = "created_at")
    @Nullable
    @CreationTimestamp
    LocalDateTime createdAt;


    @Column(name = "updated_at")
    @Nullable
    @UpdateTimestamp
    LocalDateTime updatedAt;


    @Column(name = "deleted_at")
    @Nullable
    LocalDateTime deletedAt;
}