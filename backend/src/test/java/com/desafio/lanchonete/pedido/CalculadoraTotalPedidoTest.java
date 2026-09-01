package com.desafio.lanchonete.pedido;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DisplayName("CalculadoraTotalPedido")
class CalculadoraTotalPedidoTest {

    private final CalculadoraTotalPedido calculadora = new CalculadoraTotalPedido();

    @Test
    @DisplayName("soma hambúrgueres, bebidas e adicionais respeitando a quantidade")
    void deveSomarTodosOsItens() {
        Pedido pedido = Pedido.builder()
                .hamburgueres(List.of(itemHamburguer("22.90", 1)))
                .bebidas(List.of(itemBebida("6.50", 2)))
                .adicionais(List.of(itemAdicional("3.00", 1)))
                .build();

        assertEquals(new BigDecimal("38.90"), calculadora.calcular(pedido));
    }

    @Test
    @DisplayName("retorna zero quando o pedido não tem itens")
    void deveRetornarZeroSemItens() {
        Pedido pedido = Pedido.builder().build();

        assertEquals(new BigDecimal("0.00"), calculadora.calcular(pedido));
    }

    @Test
    @DisplayName("multiplica corretamente quantidades maiores que um")
    void deveMultiplicarPelaQuantidade() {
        Pedido pedido = Pedido.builder()
                .hamburgueres(List.of(itemHamburguer("15.00", 3)))
                .build();

        assertEquals(new BigDecimal("45.00"), calculadora.calcular(pedido));
    }

    @Test
    @DisplayName("considera apenas adicionais quando não há hambúrguer nem bebida")
    void deveSomarSomenteAdicionais() {
        Pedido pedido = Pedido.builder()
                .adicionais(List.of(itemAdicional("2.50", 4)))
                .build();

        assertEquals(new BigDecimal("10.00"), calculadora.calcular(pedido));
    }

    @Test
    @DisplayName("arredonda para duas casas decimais (HALF_UP)")
    void deveArredondarParaDuasCasas() {
        Pedido pedido = Pedido.builder()
                .bebidas(List.of(itemBebida("3.333", 3)))
                .build();

        assertEquals(new BigDecimal("10.00"), calculadora.calcular(pedido));
    }

    @Test
    @DisplayName("usa o preço gravado no item, não o preço atual do cadastro")
    void deveUsarOPrecoDoSnapshot() {

        Pedido pedido = Pedido.builder()
                .hamburgueres(List.of(itemHamburguer("18.00", 2)))
                .build();

        assertEquals(new BigDecimal("36.00"), calculadora.calcular(pedido));
    }


    private PedidoHamburguer itemHamburguer(String preco, int quantidade) {
        return PedidoHamburguer.builder()
                .precoUnitario(new BigDecimal(preco))
                .quantidade(quantidade)
                .build();
    }

    private PedidoBebida itemBebida(String preco, int quantidade) {
        return PedidoBebida.builder()
                .precoUnitario(new BigDecimal(preco))
                .quantidade(quantidade)
                .build();
    }

    private PedidoAdicional itemAdicional(String preco, int quantidade) {
        return PedidoAdicional.builder()
                .precoUnitario(new BigDecimal(preco))
                .quantidade(quantidade)
                .build();
    }
}
