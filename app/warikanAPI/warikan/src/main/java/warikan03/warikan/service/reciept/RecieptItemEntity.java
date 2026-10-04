package warikan03.warikan.service.reciept;

import lombok.Value;


@Value
public class RecieptItemEntity {
    String name;
    int price;
    int quantity;
    boolean isReducedTax;   

}
