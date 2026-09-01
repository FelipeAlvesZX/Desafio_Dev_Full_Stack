package com.desafio.lanchonete.pedido;

import com.desafio.lanchonete.pedido.dto.ItemPedidoResponse;
import com.desafio.lanchonete.pedido.dto.PedidoResponse;
import com.desafio.lanchonete.pedido.dto.PedidoResumoResponse;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class PedidoMapper {

    public PedidoResponse paraPedidoResponse(Pedido p) {
        List<ItemPedidoResponse> hamburgueres = p.getHamburgueres().stream()
                .map(i -> new ItemPedidoResponse(
                        i.getId(),
                        i.getHamburguer().getId(),
                        i.getHamburguer().getCodigo(),
                        i.getHamburguer().getDescricao(),
                        i.getQuantidade(),
                        i.getPrecoUnitario(),
                        subtotal(i.getPrecoUnitario(), i.getQuantidade())))
                .toList();

        List<ItemPedidoResponse> bebidas = p.getBebidas().stream()
                .map(i -> new ItemPedidoResponse(
                        i.getId(),
                        i.getBebida().getId(),
                        i.getBebida().getCodigo(),
                        i.getBebida().getDescricao(),
                        i.getQuantidade(),
                        i.getPrecoUnitario(),
                        subtotal(i.getPrecoUnitario(), i.getQuantidade())))
                .toList();

        List<ItemPedidoResponse> adicionais = p.getAdicionais().stream()
                .map(i -> new ItemPedidoResponse(
                        i.getId(),
                        i.getIngrediente().getId(),
                        i.getIngrediente().getCodigo(),
                        i.getIngrediente().getDescricao(),
                        i.getQuantidade(),
                        i.getPrecoUnitario(),
                        subtotal(i.getPrecoUnitario(), i.getQuantidade())))
                .toList();

        List<String> observacoes = p.getObservacoes().stream()
                .map(PedidoObservacao::getTexto)
                .toList();

        return new PedidoResponse(
                p.getId(), p.getCodigo(), p.getDataPedido(), p.getDescricao(),
                p.getClienteNome(), p.getClienteEndereco(), p.getClienteTelefone(),
                hamburgueres, bebidas, adicionais, observacoes, p.getValorTotal());
    }

    public PedidoResumoResponse paraPedidoResumoResponse(Pedido p) {
        return new PedidoResumoResponse(p.getId(), p.getCodigo(), p.getDataPedido(),
                p.getClienteNome(), p.getValorTotal());
    }

    private BigDecimal subtotal(BigDecimal preco, Integer quantidade) {
        return preco.multiply(BigDecimal.valueOf(quantidade));
    }
}
