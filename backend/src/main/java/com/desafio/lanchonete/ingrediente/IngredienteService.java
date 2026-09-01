package com.desafio.lanchonete.ingrediente;

import com.desafio.lanchonete.ingrediente.dto.IngredienteRequest;
import com.desafio.lanchonete.ingrediente.dto.IngredienteResponse;
import com.desafio.lanchonete.shared.exception.RecursoNaoEncontradoException;
import com.desafio.lanchonete.shared.exception.RegraDeNegocioException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IngredienteService {

    private final IngredienteRepository repository;
    private final IngredienteMapper mapper;

    @Transactional(readOnly = true)
    public List<IngredienteResponse> listar(String termo) {
        List<Ingrediente> ingredientes = (termo == null || termo.isBlank())
                ? repository.findAll()
                : repository.pesquisar(termo.trim());
        return ingredientes.stream().map(mapper::paraIngredienteResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<IngredienteResponse> listarAdicionais() {
        return repository.findByPermiteAdicionalTrue().stream()
                .map(mapper::paraIngredienteResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public IngredienteResponse buscarPorId(Long id) {
        return mapper.paraIngredienteResponse(buscarEntidade(id));
    }

    @Transactional
    public IngredienteResponse criar(IngredienteRequest req) {
        String codigo = resolverCodigo(req.codigo(), null);
        Ingrediente salvo = repository.save(mapper.paraIngrediente(req, codigo));
        return mapper.paraIngredienteResponse(salvo);
    }

    @Transactional
    public IngredienteResponse atualizar(Long id, IngredienteRequest req) {
        Ingrediente entidade = buscarEntidade(id);
        entidade.setCodigo(resolverCodigo(req.codigo(), entidade));
        mapper.atualizarIngrediente(entidade, req);
        return mapper.paraIngredienteResponse(repository.save(entidade));
    }

    @Transactional
    public void excluir(Long id) {
        repository.delete(buscarEntidade(id));
    }

    private Ingrediente buscarEntidade(Long id) {
        return repository.findById(id).orElseThrow(() ->
                new RecursoNaoEncontradoException("Ingrediente não encontrado: id " + id));
    }

    private String resolverCodigo(String informado, Ingrediente existente) {
        if (informado != null && !informado.isBlank()) {
            String codigo = informado.trim().toUpperCase();
            boolean mudou = existente == null || !codigo.equals(existente.getCodigo());
            if (mudou && repository.existsByCodigo(codigo)) {
                throw new RegraDeNegocioException("Já existe um ingrediente com o código " + codigo);
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
