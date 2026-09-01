package com.desafio.lanchonete.pedido.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PedidoResumoResponse(
        Long id,
        String codigo,
        LocalDateTime dataPedido,
        String clienteNome,
        BigDecimal valorTotal
) { }
