package com.desafio.lanchonete.bebida;

import com.desafio.lanchonete.bebida.dto.BebidaRequest;
import com.desafio.lanchonete.bebida.dto.BebidaResponse;
import org.springframework.stereotype.Component;

import java.math.RoundingMode;

@Component
public class BebidaMapper {

    public Bebida paraBebida(BebidaRequest req, String codigoGerado){
        return Bebida.builder()
                .codigo(codigoGerado)
                .descricao(req.descricao().trim())
                .precoUnitario(req.precoUnitario().setScale(2, RoundingMode.HALF_UP))
                .contemAcucar(req.contemAcucar())
                .build();
    }

    public void atualizarBebida(Bebida bebida, BebidaRequest req){
        bebida.setDescricao(req.descricao().trim());
        bebida.setPrecoUnitario(req.precoUnitario().setScale(2, RoundingMode.HALF_UP));
        bebida.setContemAcucar(req.contemAcucar());
    }

    public BebidaResponse paraBebidaResponse(Bebida b){
        return new BebidaResponse(b.getId(), b.getCodigo(), b.getDescricao(), b.getPrecoUnitario(), b.getContemAcucar());
    }

}
