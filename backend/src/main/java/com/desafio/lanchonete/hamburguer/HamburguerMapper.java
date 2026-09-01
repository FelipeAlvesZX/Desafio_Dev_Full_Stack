package com.desafio.lanchonete.hamburguer;

import com.desafio.lanchonete.hamburguer.dto.HamburguerRequest;
import com.desafio.lanchonete.hamburguer.dto.HamburguerResponse;
import com.desafio.lanchonete.ingrediente.Ingrediente;
import com.desafio.lanchonete.ingrediente.dto.IngredienteResponse;
import org.springframework.stereotype.Component;

import java.math.RoundingMode;
import java.util.List;

@Component
public class HamburguerMapper {

    public Hamburguer paraHamburguer(HamburguerRequest req, String codigoGerado,
                                     List<Ingrediente> ingredientes) {
        return Hamburguer.builder()
                .codigo(codigoGerado)
                .descricao(req.descricao().trim())
                .valor(req.valor().setScale(2, RoundingMode.HALF_UP))
                .ingredientes(ingredientes)
                .build();
    }

    public void atualizarHamburguer(Hamburguer hamburguer, HamburguerRequest req,
                                    List<Ingrediente> ingredientes) {
        hamburguer.setDescricao(req.descricao().trim());
        hamburguer.setValor(req.valor().setScale(2, RoundingMode.HALF_UP));
        hamburguer.getIngredientes().clear();
        hamburguer.getIngredientes().addAll(ingredientes);
    }

    public HamburguerResponse paraHamburguerResponse(Hamburguer h) {
        List<IngredienteResponse> ingredientes = h.getIngredientes().stream()
                .map(i -> new IngredienteResponse(i.getId(), i.getCodigo(), i.getDescricao(),
                        i.getPrecoUnitario(), i.getPermiteAdicional()))
                .toList();
        return new HamburguerResponse(h.getId(), h.getCodigo(), h.getDescricao(),
                h.getValor(), ingredientes);
    }
}
