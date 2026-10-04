package warikan03.warikan.repository;

import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Value;


@Value
public class RecieptItemRecord {
    @Field("name")
    String name;
    @Field("price")
    int price;
    @Field("quantity")
    int quantity;
    @Field("reduced_tax")
    boolean isReducedTax;   
}
