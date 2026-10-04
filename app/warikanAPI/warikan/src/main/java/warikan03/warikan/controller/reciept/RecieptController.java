package warikan03.warikan.controller.reciept;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.openapitools.example.api.controller.PageDTO;
import org.openapitools.example.api.controller.ReceiptApi;
import org.openapitools.example.api.controller.ReceiptDTO;
import org.openapitools.example.api.controller.ReceiptForm;
import org.openapitools.example.api.controller.ReceiptItemDTO;
import org.openapitools.example.api.controller.ReceiptListDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.RequiredArgsConstructor;
import warikan03.warikan.service.reciept.RecieptEntity;
import warikan03.warikan.service.reciept.RecieptItemEntity;
import warikan03.warikan.service.reciept.ReciptService;

@RestController
@RequiredArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RecieptController implements ReceiptApi {

    private final ReciptService reciptService;

    @Override
    @CrossOrigin
    public ResponseEntity<ReceiptDTO> getReceiptById(Integer tmpId) {
        int id = tmpId;
        // レシートを取得
        RecieptEntity reciept = reciptService.find(id);
        // レシートDTOを作成
        ReceiptDTO dto = toReceiptDTO(reciept);
        // レスポンスとして返す
        return ResponseEntity.ok(dto);
    }

    @Override
    @CrossOrigin
    public ResponseEntity<ReceiptListDTO> getReceiptList(Integer page, Integer size) {
        var recieptEntityList = reciptService.find(page, size);
        // レシートリストDTOを作成
        var dto = new ReceiptListDTO();
        dto.setResults(
                recieptEntityList.stream().map(entity -> toReceiptDTO(entity)).collect(Collectors.toList()));
        dto.setPage(
                new PageDTO(page, size, recieptEntityList.size()));
        return ResponseEntity.ok().body(dto);
    }

    @Override
    @CrossOrigin
    public ResponseEntity<ReceiptDTO> createReceipt(ReceiptForm receiptForm) {

        // receiptFormのitemをレシートアイテムエンティティのリストを作成
        System.out.println("receiptForm.getItems(): " + receiptForm.getItems());
        List<RecieptItemEntity> items = toRecieptItemEntity(receiptForm);

        // レシートエンティティを作成
        RecieptEntity reciept = reciptService.create(new RecieptEntity(
                null,
                null,
                receiptForm.getTotalAmount().intValue(),
                receiptForm.getImageUrl(),
                receiptForm.getCreatedBy(),
                receiptForm.getIsUpdated(),
                items));

        // レシートDTOを作成
        var dto = toReceiptDTO(reciept);

        return ResponseEntity.created(URI.create("/receipt/" + reciept.getId())).body(dto);
    }

    @Override
    @CrossOrigin
    public ResponseEntity<ReceiptDTO> editReceiptById(Integer tmpId, ReceiptForm receiptForm) {
        // receiptFormのitemをレシートアイテムエンティティのリストを作成
        List<RecieptItemEntity> items = toRecieptItemEntity(receiptForm);

        RecieptEntity reciept = reciptService.update(new RecieptEntity(
                tmpId,
                null,
                receiptForm.getTotalAmount().intValue(),
                receiptForm.getImageUrl(),
                receiptForm.getCreatedBy(),
                receiptForm.getIsUpdated(),
                items));

        var dto = toReceiptDTO(reciept);
        return ResponseEntity.ok(dto);
    }

    @Override
    @CrossOrigin
    public ResponseEntity<Void> deleteReceiptById(Integer id) {
        int tmpId = id;
        reciptService.delete(tmpId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    // ReceiptFormのitemをRecieptItemEntityのリストに変換するヘルパーメソッド
    private List<RecieptItemEntity> toRecieptItemEntity(ReceiptForm receiptForm) {
        List<RecieptItemEntity> items = new ArrayList<>();
        if (!receiptForm.getItems().isEmpty()) {
            items = receiptForm.getItems().stream().map(item -> {
                return new RecieptItemEntity(
                        item.getName(),
                        item.getPrice(), // int型
                        item.getQuantity(), // int型
                        item.getIsReducedTax() // boolean型
                );
            }).collect(Collectors.toList());
        } else {
            items = null; // アイテムがない場合はnullを設定
        }
        return items;
    }

    // レシートエンティティをDTOに変換するヘルパーメソッド
    private ReceiptDTO toReceiptDTO(RecieptEntity entity) {
        var dto = new ReceiptDTO(
                entity.getId(),
                entity.getDate(),
                entity.getTotalAmount(),
                entity.getImageUrl(),
                entity.getCreatedBy(),
                entity.isUpdated());

        if (entity.getItems() != null && !entity.getItems().isEmpty()) {
            dto.setItems(
                    entity.getItems().stream().map(item -> new ReceiptItemDTO(
                            item.getName(),
                            item.getPrice(),
                            item.getQuantity(),
                            item.isReducedTax())).collect(Collectors.toList()));
        } else {
            dto.setItems(null); // アイテムがない場合はnullを設定
        }

        return dto;
    }
}
