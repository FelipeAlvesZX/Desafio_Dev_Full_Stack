package com.desafio.lanchonete.pedido.dto;

import java.math.BigDecimal;

public record ItemPedidoResponse(
        Long id,
        Long itemId,
        String codigo,
        String descricao,
        Integer quantidade,
        BigDecimal precoUnitario,
        BigDecimal subtotal
) { }
