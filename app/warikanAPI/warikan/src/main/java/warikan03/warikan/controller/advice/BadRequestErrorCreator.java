package warikan03.warikan.controller.advice;

import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.openapitools.example.api.controller.BadRequestError;
import org.openapitools.example.api.controller.InvalidParam;
import org.springframework.web.bind.MethodArgumentNotValidException;

import jakarta.validation.ConstraintViolationException;
import jakarta.validation.ElementKind;

public class BadRequestErrorCreator {

    public static BadRequestError form(MethodArgumentNotValidException ex) {
       
        var invalidParamesList = ex.getFieldErrors()
            .stream()
            .map(fieldError -> {
                return new InvalidParam(
                    fieldError.getField(),
                    fieldError.getDefaultMessage()
                );
            }
            )
            .collect(Collectors.toList());

        var error = new BadRequestError();
        error.setInvalidParams(invalidParamesList);

        return error;
    }

    public static BadRequestError form(ConstraintViolationException ex) {

        var invalidParamesList = ex.getConstraintViolations().stream().map(
            villation -> {
                var ParameterOpt = StreamSupport.stream(villation.getPropertyPath().spliterator(), false)
                    .filter(node -> node.getKind().equals(ElementKind.PARAMETER))
                    .findFirst();
                var invalidParam = new InvalidParam();
                ParameterOpt.ifPresent(p -> invalidParam.setName(p.getName()));
                invalidParam.setReason(villation.getMessage());
                return invalidParam;
            }
        ).collect(Collectors.toList());

        var error = new BadRequestError();
        error.setInvalidParams(invalidParamesList);
        

        return error;
    }

}
