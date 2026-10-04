package warikan03.warikan.controller.advice;

import org.openapitools.example.api.controller.BadRequestError;
import org.openapitools.example.api.controller.ResouceNotFoundError;
import org.openapitools.example.api.controller.SystemduplicatedIdError;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import jakarta.validation.ConstraintViolationException;
import warikan03.warikan.service.reciept.CreatedReciptIdDuplicatioException;
import warikan03.warikan.service.reciept.RecieptEntityNotFoundException;

@RestControllerAdvice
public class CustomExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(RecieptEntityNotFoundException.class)
    public ResponseEntity<ResouceNotFoundError> handleRecieptEntityNotFoundException(RecieptEntityNotFoundException e) {
        var error = new ResouceNotFoundError(e.getMessage(), "指定したidのレシートが見つかりません");
      

        // 404 Not Found response
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(error);
    }

    @ExceptionHandler(CreatedReciptIdDuplicatioException.class)
    public ResponseEntity<SystemduplicatedIdError> handleCreatedReciptIdDuplicatioException(CreatedReciptIdDuplicatioException e) {
        var error = new SystemduplicatedIdError(e.getMessage(), "システム内部でIDの生成に失敗しました。再度試行してください");

        // 500 response
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error);
    }   

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
		MethodArgumentNotValidException ex,
        HttpHeaders headers,
        HttpStatusCode status, 
        WebRequest request) {
        
            var error = BadRequestErrorCreator.form(ex);
                   
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(error);
	}

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<BadRequestError> handleConstraintViolationExceptionHandler(ConstraintViolationException ex) {

        var error = BadRequestErrorCreator.form(ex);    
		return ResponseEntity.badRequest().body(error);

    }

}
