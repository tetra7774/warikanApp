package warikan03.warikan.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Value;

@Value
@Document(collection = "receipt")
public class RecieptRecord {

    @Id
    String _id;
    // separate numeric identifier stored in field "id" in the document
    @Field("id")
    int receiptId;
    @Field("register_date")
    LocalDate date;
    @Field("total")
    int totalAmount;
    @Field("image_url")
    String imageUrl;
    @Field("created_by")
    String createdBy;
    @Field("is_updated")
    boolean isUpdated;
    @Field("item")
    List<RecieptItemRecord> items;

}
