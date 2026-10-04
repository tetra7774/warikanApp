package warikan03.warikan.service;

import java.time.LocalDateTime;

import lombok.RequiredArgsConstructor;
import lombok.Value;

@Value
@RequiredArgsConstructor
public class RecieptEntity {
    private String id;
    private String description;
    private LocalDateTime date;

}