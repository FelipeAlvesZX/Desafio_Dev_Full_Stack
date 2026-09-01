package com.desafio.lanchonete.ingrediente;

import com.desafio.lanchonete.ingrediente.dto.IngredienteRequest;
import com.desafio.lanchonete.ingrediente.dto.IngredienteResponse;
import org.springframework.stereotype.Component;

import java.math.RoundingMode;

@Component
public class IngredienteMapper {

    public Ingrediente paraIngrediente(IngredienteRequest req, String codigoGerado) {
        return Ingrediente.builder()
                .codigo(codigoGerado)
                .descricao(req.descricao().trim())
                .precoUnitario(req.precoUnitario().setScale(2, RoundingMode.HALF_UP))
                .permiteAdicional(req.permiteAdicional())
                .build();
    }

    public void atualizarIngrediente(Ingrediente ingrediente, IngredienteRequest req) {
        ingrediente.setDescricao(req.descricao().trim());
        ingrediente.setPrecoUnitario(req.precoUnitario().setScale(2, RoundingMode.HALF_UP));
        ingrediente.setPermiteAdicional(req.permiteAdicional());
    }

    public IngredienteResponse paraIngredienteResponse(Ingrediente i) {
        return new IngredienteResponse(i.getId(), i.getCodigo(), i.getDescricao(),
                i.getPrecoUnitario(), i.getPermiteAdicional());
    }
}
