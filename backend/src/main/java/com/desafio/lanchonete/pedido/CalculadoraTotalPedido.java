package com.desafio.lanchonete.pedido;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.function.Function;

@Component
public class CalculadoraTotalPedido {

    public BigDecimal calcular(Pedido pedido) {
        BigDecimal total = somar(pedido.getHamburgueres(),
                PedidoHamburguer::getQuantidade, PedidoHamburguer::getPrecoUnitario)
                .add(somar(pedido.getBebidas(),
                        PedidoBebida::getQuantidade, PedidoBebida::getPrecoUnitario))
                .add(somar(pedido.getAdicionais(),
                        PedidoAdicional::getQuantidade, PedidoAdicional::getPrecoUnitario));
        return total.setScale(2, RoundingMode.HALF_UP);
    }

    private <T> BigDecimal somar(List<T> itens,
                                 Function<T, Integer> quantidade,
                                 Function<T, BigDecimal> precoUnitario) {
        if (itens == null || itens.isEmpty()) {
            return BigDecimal.ZERO;
        }
        return itens.stream()
                .map(item -> precoUnitario.apply(item)
                        .multiply(BigDecimal.valueOf(quantidade.apply(item))))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
