package com.desafio.lanchonete.pedido.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponse(
        Long id,
        String codigo,
        LocalDateTime dataPedido,
        String descricao,
        String clienteNome,
        String clienteEndereco,
        String clienteTelefone,
        List<ItemPedidoResponse> hamburgueres,
        List<ItemPedidoResponse> bebidas,
        List<ItemPedidoResponse> adicionais,
        List<String> observacoes,
        BigDecimal valorTotal
) { }
