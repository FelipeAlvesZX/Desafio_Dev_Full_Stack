package com.desafio.lanchonete.shared.exception;

import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;

public record ErroResposta (
        LocalDateTime timestamp,
        int status,
        String erro,
        String mensagem,
        List<ErroCampo> campos
){
    public static ErroResposta de(HttpStatus status, String mensagem){
        return new ErroResposta(LocalDateTime.now(), status.value(), status.getReasonPhrase(), mensagem, List.of());
    }
}
