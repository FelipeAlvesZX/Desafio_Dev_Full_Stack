package com.desafio.lanchonete.hamburguer;

import com.desafio.lanchonete.hamburguer.dto.HamburguerRequest;
import com.desafio.lanchonete.hamburguer.dto.HamburguerResponse;
import com.desafio.lanchonete.ingrediente.Ingrediente;
import com.desafio.lanchonete.ingrediente.IngredienteRepository;
import com.desafio.lanchonete.shared.exception.RecursoNaoEncontradoException;
import com.desafio.lanchonete.shared.exception.RegraDeNegocioException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HamburguerService {

    private final HamburguerRepository repository;
    private final IngredienteRepository ingredienteRepository;
    private final HamburguerMapper mapper;

    @Transactional(readOnly = true)
    public List<HamburguerResponse> listar(String termo) {
        List<Hamburguer> hamburgueres = (termo == null || termo.isBlank())
                ? repository.buscarTodosComIngredientes()
                : repository.pesquisar(termo.trim());
        return hamburgueres.stream().map(mapper::paraHamburguerResponse).toList();
    }

    @Transactional(readOnly = true)
    public HamburguerResponse buscarPorId(Long id) {
        return mapper.paraHamburguerResponse(buscarEntidade(id));
    }

    @Transactional
    public HamburguerResponse criar(HamburguerRequest req) {
        String codigo = resolverCodigo(req.codigo(), null);
        List<Ingrediente> ingredientes = carregarIngredientes(req.ingredienteIds());
        Hamburguer salvo = repository.save(mapper.paraHamburguer(req, codigo, ingredientes));
        return mapper.paraHamburguerResponse(salvo);
    }

    @Transactional
    public HamburguerResponse atualizar(Long id, HamburguerRequest req) {
        Hamburguer entidade = buscarEntidade(id);
        entidade.setCodigo(resolverCodigo(req.codigo(), entidade));
        mapper.atualizarHamburguer(entidade, req, carregarIngredientes(req.ingredienteIds()));
        return mapper.paraHamburguerResponse(repository.save(entidade));
    }

    @Transactional
    public void excluir(Long id) {
        repository.delete(buscarEntidade(id));
    }

    private Hamburguer buscarEntidade(Long id) {
        return repository.findById(id).orElseThrow(() ->
                new RecursoNaoEncontradoException("Hambúrguer não encontrado: id " + id));
    }

    private List<Ingrediente> carregarIngredientes(List<Long> ids) {
        List<Ingrediente> ingredientes = ingredienteRepository.findAllById(ids);
        if (ingredientes.size() != ids.stream().distinct().count()) {
            throw new RegraDeNegocioException("Um ou mais ingredientes informados não existem");
        }
        return ingredientes;
    }

    private String resolverCodigo(String informado, Hamburguer existente) {
        if (informado != null && !informado.isBlank()) {
            String codigo = informado.trim().toUpperCase();
            boolean mudou = existente == null || !codigo.equals(existente.getCodigo());
            if (mudou && repository.existsByCodigo(codigo)) {
                throw new RegraDeNegocioException("Já existe um hambúrguer com o código " + codigo);
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
