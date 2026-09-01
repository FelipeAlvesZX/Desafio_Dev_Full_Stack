package com.desafio.lanchonete.pedido.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ItemBebidaRequest(
        @NotNull(message = "Informe a bebida") Long bebidaId,
        @NotNull(message = "Informe a quantidade") @Min(value = 1, message = "Quantidade mínima é 1") Integer quantidade
) { }
