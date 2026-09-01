package com.desafio.lanchonete.ingrediente.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record IngredienteRequest(
        @Pattern(regexp = "^[A-Z]{3}-[0-9]{4}$", message = "O código deve seguir o formato ABC-0000")
        String codigo,

        @NotBlank(message = "Descrição é obrigatória")
        @Size(max = 120, message = "Descrição deve ter no máximo 120 caracteres")
        String descricao,

        @NotNull(message = "Preço é obrigatório")
        @PositiveOrZero(message = "Preço deve ser maior ou igual a zero")
        BigDecimal precoUnitario,

        @NotNull(message = "Informe se o ingrediente pode ser usado como adicional")
        Boolean permiteAdicional
) { }
