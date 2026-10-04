package warikan03.warikan.service.reciept;

public class CreatedReciptIdDuplicatioException extends RuntimeException {
    public CreatedReciptIdDuplicatioException() {
        super("System-generated ID was duplicated multiple times.");
    }

}
