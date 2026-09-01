package com.desafio.lanchonete.hamburguer.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;

public record HamburguerRequest(
        @Pattern(regexp = "^[A-Z]{3}-[0-9]{4}$", message = "O código deve seguir o formato ABC-0000")
        String codigo,

        @NotBlank(message = "Descrição é obrigatória")
        @Size(max = 120, message = "Descrição deve ter no máximo 120 caracteres")
        String descricao,

        @NotNull(message = "Valor é obrigatório")
        @PositiveOrZero(message = "Valor deve ser maior ou igual a zero")
        BigDecimal valor,

        @NotEmpty(message = "Informe ao menos um ingrediente")
        List<Long> ingredienteIds
) { }
