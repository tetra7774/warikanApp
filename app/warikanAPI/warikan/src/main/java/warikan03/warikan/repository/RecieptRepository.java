package warikan03.warikan.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RecieptRepository extends MongoRepository<RecieptRecord, String> {
    Optional<RecieptRecord> findByReceiptId(int receiptId); // numeric id stored in field "id"

    // MongoRepositoryのinsertメソッドは通常不要

    // MongoRepositoryのfindAllメソッドは通常不要

    // MongoRepositoryのsaveメソッドは通常不要

    // MongoRepositoryのdeleteByIdメソッドは通常不要
}