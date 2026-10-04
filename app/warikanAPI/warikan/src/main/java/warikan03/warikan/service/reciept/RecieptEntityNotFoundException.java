package warikan03.warikan.service.reciept;

public class RecieptEntityNotFoundException extends RuntimeException {

    public RecieptEntityNotFoundException(int tmpId) {
        super("RecieptEntity with id " + tmpId + " not found");
        
    }

}
