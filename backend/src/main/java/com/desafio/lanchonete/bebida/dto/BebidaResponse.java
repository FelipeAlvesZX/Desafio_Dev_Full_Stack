package com.desafio.lanchonete.bebida.dto;

import java.math.BigDecimal;

public record BebidaResponse(
        Long id,
        String codigo,
        String descricao,
        BigDecimal precoUnitario,
        Boolean contemAcucar
) {
    
}
