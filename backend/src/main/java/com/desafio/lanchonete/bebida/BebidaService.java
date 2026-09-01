package com.desafio.lanchonete.bebida;


import com.desafio.lanchonete.bebida.dto.BebidaRequest;
import com.desafio.lanchonete.bebida.dto.BebidaResponse;
import com.desafio.lanchonete.shared.exception.RecursoNaoEncontradoException;
import com.desafio.lanchonete.shared.exception.RegraDeNegocioException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BebidaService {

    private final BebidaRepository repository;
    private final BebidaMapper mapper;

    @Transactional(readOnly = true)
    public List<BebidaResponse> listar(String termo) {
        List<Bebida> bebidas = (termo == null || termo.isBlank())
                ? repository.findAll()
                : repository.pesquisar(termo.trim());
        return bebidas.stream().map(mapper::paraBebidaResponse).toList();
    }

    @Transactional(readOnly = true)
    public BebidaResponse buscarPorId(Long id) {
        return mapper.paraBebidaResponse(buscarEntidade(id));
    }

    @Transactional
    public BebidaResponse criar(BebidaRequest req) {
        String codigo = resolverCodigo(req.codigo(), null);
        Bebida salva = repository.save(mapper.paraBebida(req, codigo));
        return mapper.paraBebidaResponse(salva);
    }

    @Transactional
    public BebidaResponse atualizar(Long id, BebidaRequest req) {
        Bebida entidade = buscarEntidade(id);
        entidade.setCodigo(resolverCodigo(req.codigo(), entidade));
        mapper.atualizarBebida(entidade, req);
        return mapper.paraBebidaResponse(repository.save(entidade));
    }

    @Transactional
    public void excluir(Long id) {
        repository.delete(buscarEntidade(id));
    }

    private Bebida buscarEntidade(Long id) {
        return repository.findById(id).orElseThrow(() ->
                new RecursoNaoEncontradoException("Bebida não encontrada: id " + id));
    }

    private String resolverCodigo(String informado, Bebida existente) {
        if (informado != null && !informado.isBlank()) {
            String codigo = informado.trim().toUpperCase();
            boolean mudou = existente == null || !codigo.equals(existente.getCodigo());
            if (mudou && repository.existsByCodigo(codigo)) {
                throw new RegraDeNegocioException("Já existe uma bebida com o código " + codigo);
            }
            return codigo;
        }
        if (existente != null) return existente.getCodigo();
        for (int i = 0; i < 10; i++) {
            String gerado = repository.gerarProximoCodigo();
            if (!repository.existsByCodigo(gerado)) return gerado;
        }
        throw new RegraDeNegocioException("Não foi possível gerar um código automático");
    }
}
