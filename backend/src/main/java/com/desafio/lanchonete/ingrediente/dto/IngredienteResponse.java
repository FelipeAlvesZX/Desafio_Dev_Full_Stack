package com.desafio.lanchonete.ingrediente.dto;

import java.math.BigDecimal;

public record IngredienteResponse(
        Long id,
        String codigo,
        String descricao,
        BigDecimal precoUnitario,
        Boolean permiteAdicional
) { }
