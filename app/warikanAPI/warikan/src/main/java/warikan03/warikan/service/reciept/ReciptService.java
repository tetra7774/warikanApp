package warikan03.warikan.service.reciept;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import warikan03.warikan.repository.RecieptItemRecord;
import warikan03.warikan.repository.RecieptRecord;
import warikan03.warikan.repository.RecieptRepository;

@Service
@RequiredArgsConstructor
public class ReciptService {

    private final RecieptRepository recieptRepository;

    public RecieptEntity find(int id) {

        RecieptEntity tmp = recieptRepository.findByReceiptId(id)
                .map(record -> toReceiptEntity(record))
                .orElseThrow(() -> new RecieptEntityNotFoundException(id));
        return tmp;

    }

    public List<RecieptEntity> find(Integer page, Integer size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "receiptId"));
        return recieptRepository.findAll(pageRequest).stream()
                .map(record -> toReceiptEntity(record)).collect(Collectors.toList());
    }

    public RecieptEntity create(RecieptEntity recieptEntity) {
        System.out.println("items: " + recieptEntity.getItems());
        List<RecieptItemRecord> items = toRecieptEntityRecord(recieptEntity);

        // IDの重複チェックと生成
        Random rnd = new Random();
        Integer id = null;
        int count = 0;
        while (count < 3) {
            id = rnd.nextInt(1000);
            if (!dbNullCheck(id)) {
                break; // IDが重複しなければループを抜ける
            }
            count++;
        }
        if (count == 3) {
            throw new CreatedReciptIdDuplicatioException();
        }

        // 現在の日付を取得
        LocalDate date = LocalDate.now();

        // RecieptRecordを作成
        var record = new RecieptRecord(
                null,
                id,
                date,
                recieptEntity.getTotalAmount(),
                recieptEntity.getImageUrl(),
                recieptEntity.getCreatedBy(),
                recieptEntity.isUpdated(),
                items);

        // レシートをデータベースに挿入
        RecieptRecord result = recieptRepository.insert(record);

        // RecieptEntityに変換して返す
        RecieptEntity entity = new RecieptEntity(
                result.getReceiptId(),
                result.getDate(),
                result.getTotalAmount(),
                result.getImageUrl(),
                result.getCreatedBy(),
                result.isUpdated(),
                result.getItems() != null ? result.getItems().stream().map(item -> new RecieptItemEntity(
                        item.getName(),
                        item.getPrice(),
                        item.getQuantity(),
                        item.isReducedTax())).collect(Collectors.toList()) : null);
        return entity;
    }

    public RecieptEntity update(RecieptEntity recieptEntity) {

        // IDの存在チェック
        RecieptRecord exsistedRecord = recieptRepository.findByReceiptId(recieptEntity.getId())
                .orElseThrow(() -> new RecieptEntityNotFoundException(recieptEntity.getId()));

        // 更新用のレコードを生成
        var itemRecords = toRecieptEntityRecord(recieptEntity);
        var record = new RecieptRecord(
                exsistedRecord.get_id(),
                recieptEntity.getId(),
                exsistedRecord.getDate(),
                recieptEntity.getTotalAmount(),
                recieptEntity.getImageUrl(),
                recieptEntity.getCreatedBy(),
                recieptEntity.isUpdated(),
                itemRecords);

        RecieptRecord result = recieptRepository.save(record);

        return toReceiptEntity(result);
    }

    public void delete(int id) {
        // IDの存在チェック
        String existedId = recieptRepository.findByReceiptId(id)
                .map(record -> record.get_id())
                .orElseThrow(() -> new RecieptEntityNotFoundException(id));
        // レコードを削除
        recieptRepository.deleteById(existedId);
    }

    // DBのIDチェックするヘルパーメソッド
    public boolean dbNullCheck(int id) {
        return recieptRepository.findByReceiptId(id).isPresent();
    }

    // RecieptRecordをRecieptEntityに変換するヘルパーメソッド
    private RecieptEntity toReceiptEntity(RecieptRecord record) {
        List<RecieptItemRecord> items = record.getItems();
        List<RecieptItemEntity> itemsEntity;
        if (items != null && !items.isEmpty()) {
            itemsEntity = items.stream().map(item -> new RecieptItemEntity(
                    item.getName(),
                    item.getPrice(),
                    item.getQuantity(),
                    item.isReducedTax()))
                    .collect(Collectors.toList());
        } else {
            itemsEntity = null;
        }
        // アイテムがnullまたは空の場合は空のリストを設定
        return new RecieptEntity(
                record.getReceiptId(),
                record.getDate(),
                record.getTotalAmount(),
                record.getImageUrl(),
                record.getCreatedBy(),
                record.isUpdated(),
                itemsEntity);
    }

    // RecieptEntityのitemsをRecieptItemRecordに変換するヘルパーメソッド
    private List<RecieptItemRecord> toRecieptEntityRecord(RecieptEntity recieptEntity) {
        // レシートの各アイテムをRecieptItemRecordに変換
        List<RecieptItemRecord> items = new ArrayList<>();
        if (recieptEntity.getItems() != null && !recieptEntity.getItems().isEmpty()) {
            items = recieptEntity.getItems().stream().map(item -> new RecieptItemRecord(
                    item.getName(),
                    item.getPrice(), // int型
                    item.getQuantity(), // int型
                    item.isReducedTax() // boolean型
            )).collect(Collectors.toList());
        } else {
            items = null;
        }
        return items;
    }

}