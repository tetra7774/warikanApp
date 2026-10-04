package warikan03.warikan.service.reciept;

import java.time.LocalDate;
import java.util.List;

import lombok.Value;


@Value
public class RecieptEntity {
    private Integer id;
    private LocalDate date;
    private int totalAmount;
    private String imageUrl;
    private String createdBy;
    private boolean isUpdated;
    List<RecieptItemEntity> items;

}