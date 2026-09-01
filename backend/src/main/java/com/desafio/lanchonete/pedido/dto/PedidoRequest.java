package com.desafio.lanchonete.pedido.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record PedidoRequest(
        @Size(max = 255, message = "Descrição deve ter no máximo 255 caracteres")
        String descricao,

        @NotBlank(message = "Nome do cliente é obrigatório")
        @Size(max = 120)
        String clienteNome,

        @NotBlank(message = "Endereço do cliente é obrigatório")
        @Size(max = 255)
        String clienteEndereco,

        @NotBlank(message = "Telefone do cliente é obrigatório")
        @Size(max = 20)
        String clienteTelefone,

        @Valid List<ItemHamburguerRequest> hamburgueres,
        @Valid List<ItemBebidaRequest> bebidas,
        @Valid List<AdicionalRequest> adicionais,
        @Valid List<ObservacaoRequest> observacoes
) { }
