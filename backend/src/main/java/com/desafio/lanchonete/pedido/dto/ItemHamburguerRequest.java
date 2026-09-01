package com.desafio.lanchonete.pedido.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ItemHamburguerRequest(
        @NotNull(message = "Informe o hambúrguer") Long hamburguerId,
        @NotNull(message = "Informe a quantidade") @Min(value = 1, message = "Quantidade mínima é 1") Integer quantidade
) { }
