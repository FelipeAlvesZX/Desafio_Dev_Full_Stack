package com.desafio.lanchonete.hamburguer.dto;

import com.desafio.lanchonete.ingrediente.dto.IngredienteResponse;

import java.math.BigDecimal;
import java.util.List;

public record HamburguerResponse(
        Long id,
        String codigo,
        String descricao,
        BigDecimal valor,
        List<IngredienteResponse> ingredientes
) { }
