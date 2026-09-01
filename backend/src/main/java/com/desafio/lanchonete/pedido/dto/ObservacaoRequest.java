package com.desafio.lanchonete.pedido.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ObservacaoRequest(
        @NotBlank(message = "Observação não pode ser vazia")
        @Size(max = 255, message = "Observação deve ter no máximo 255 caracteres")
        String texto
) { }
