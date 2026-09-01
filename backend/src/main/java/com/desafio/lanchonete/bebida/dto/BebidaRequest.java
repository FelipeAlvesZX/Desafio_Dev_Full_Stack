package com.desafio.lanchonete.bebida.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record BebidaRequest(
        @Pattern(regexp = "^[A-Z]{3}-[0-9]{4}$", message = "O Cógigo deve seguir o formato ABC-0000")
        String codigo,

        @NotBlank(message = "Descrição é obrigatória")
        @Size(max = 100, message = "Descrição deve ter no máximo 100 caracteres")
        String descricao,

        @NotNull(message = "Preço é obrigatório")
        @PositiveOrZero(message = "Preço deve ser maior ou igual a zero")
        BigDecimal precoUnitario,

        @NotNull(message = "Informação sobre o açúcar é obrigatória")
        Boolean contemAcucar
        ) { }
