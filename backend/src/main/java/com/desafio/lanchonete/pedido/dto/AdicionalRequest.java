package com.desafio.lanchonete.pedido.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AdicionalRequest(
        @NotNull(message = "Informe o ingrediente adicional") Long ingredienteId,
        @NotNull(message = "Informe a quantidade") @Min(value = 1, message = "Quantidade mínima é 1") Integer quantidade
) { }
