package com.desafio.lanchonete.pedido;

import com.desafio.lanchonete.bebida.Bebida;
import com.desafio.lanchonete.bebida.BebidaRepository;
import com.desafio.lanchonete.hamburguer.Hamburguer;
import com.desafio.lanchonete.hamburguer.HamburguerRepository;
import com.desafio.lanchonete.ingrediente.Ingrediente;
import com.desafio.lanchonete.ingrediente.IngredienteRepository;
import com.desafio.lanchonete.pedido.dto.*;
import com.desafio.lanchonete.shared.exception.RecursoNaoEncontradoException;
import com.desafio.lanchonete.shared.exception.RegraDeNegocioException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository repository;
    private final HamburguerRepository hamburguerRepository;
    private final BebidaRepository bebidaRepository;
    private final IngredienteRepository ingredienteRepository;
    private final CalculadoraTotalPedido calculadora;
    private final PedidoMapper mapper;

    @Transactional(readOnly = true)
    public List<PedidoResumoResponse> listar(String termo) {
        List<Pedido> pedidos = (termo == null || termo.isBlank())
                ? repository.findAll()
                : repository.pesquisar(termo.trim());
        return pedidos.stream().map(mapper::paraPedidoResumoResponse).toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponse buscarPorId(Long id) {
        return mapper.paraPedidoResponse(buscarEntidade(id));
    }

    @Transactional
    public PedidoResponse criar(PedidoRequest req) {
        Pedido pedido = Pedido.builder()
                .codigo(gerarCodigo())
                .dataPedido(LocalDateTime.now())
                .descricao(req.descricao())
                .clienteNome(req.clienteNome().trim())
                .clienteEndereco(req.clienteEndereco().trim())
                .clienteTelefone(req.clienteTelefone().trim())
                .valorTotal(BigDecimal.ZERO)
                .build();

        preencherItens(pedido, req);
        pedido.setValorTotal(calculadora.calcular(pedido));
        return mapper.paraPedidoResponse(repository.save(pedido));
    }

    @Transactional
    public PedidoResponse atualizar(Long id, PedidoRequest req) {
        Pedido pedido = buscarEntidade(id);
        pedido.setDescricao(req.descricao());
        pedido.setClienteNome(req.clienteNome().trim());
        pedido.setClienteEndereco(req.clienteEndereco().trim());
        pedido.setClienteTelefone(req.clienteTelefone().trim());

        pedido.getHamburgueres().clear();
        pedido.getBebidas().clear();
        pedido.getAdicionais().clear();
        pedido.getObservacoes().clear();

        preencherItens(pedido, req);
        pedido.setValorTotal(calculadora.calcular(pedido));
        return mapper.paraPedidoResponse(repository.save(pedido));
    }

    @Transactional
    public void excluir(Long id) {
        repository.delete(buscarEntidade(id));
    }


    private void preencherItens(Pedido pedido, PedidoRequest req) {
        adicionarHamburgueres(pedido, req.hamburgueres());
        adicionarBebidas(pedido, req.bebidas());
        adicionarAdicionais(pedido, req.adicionais());
        adicionarObservacoes(pedido, req.observacoes());

        if (pedido.getHamburgueres().isEmpty() && pedido.getBebidas().isEmpty()) {
            throw new RegraDeNegocioException("O pedido deve conter ao menos um hambúrguer ou uma bebida");
        }
    }

    private void adicionarHamburgueres(Pedido pedido, List<ItemHamburguerRequest> itens) {
        if (itens == null) return;
        for (ItemHamburguerRequest item : itens) {
            Hamburguer hamburguer = hamburguerRepository.findById(item.hamburguerId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException(
                            "Hambúrguer não encontrado: id " + item.hamburguerId()));

            pedido.getHamburgueres().add(PedidoHamburguer.builder()
                    .pedido(pedido)
                    .hamburguer(hamburguer)
                    .quantidade(item.quantidade())
                    .precoUnitario(hamburguer.getValor())
                    .build());
        }
    }

    private void adicionarBebidas(Pedido pedido, List<ItemBebidaRequest> itens) {
        if (itens == null) return;
        for (ItemBebidaRequest item : itens) {
            Bebida bebida = bebidaRepository.findById(item.bebidaId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException(
                            "Bebida não encontrada: id " + item.bebidaId()));

            pedido.getBebidas().add(PedidoBebida.builder()
                    .pedido(pedido)
                    .bebida(bebida)
                    .quantidade(item.quantidade())
                    .precoUnitario(bebida.getPrecoUnitario())
                    .build());
        }
    }

    private void adicionarAdicionais(Pedido pedido, List<AdicionalRequest> itens) {
        if (itens == null) return;
        for (AdicionalRequest item : itens) {
            Ingrediente ingrediente = ingredienteRepository.findById(item.ingredienteId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException(
                            "Ingrediente não encontrado: id " + item.ingredienteId()));

            if (!Boolean.TRUE.equals(ingrediente.getPermiteAdicional())) {
                throw new RegraDeNegocioException("O ingrediente " + ingrediente.getDescricao()
                        + " não está habilitado para uso como adicional");
            }

            pedido.getAdicionais().add(PedidoAdicional.builder()
                    .pedido(pedido)
                    .ingrediente(ingrediente)
                    .quantidade(item.quantidade())
                    .precoUnitario(ingrediente.getPrecoUnitario())
                    .build());
        }
    }

    private void adicionarObservacoes(Pedido pedido, List<ObservacaoRequest> itens) {
        if (itens == null) return;
        int ordem = 1;
        for (ObservacaoRequest item : itens) {
            pedido.getObservacoes().add(PedidoObservacao.builder()
                    .pedido(pedido)
                    .texto(item.texto().trim())
                    .ordem(ordem++)
                    .build());
        }
    }

    private Pedido buscarEntidade(Long id) {
        return repository.findById(id).orElseThrow(() ->
                new RecursoNaoEncontradoException("Pedido não encontrado: id " + id));
    }

    private String gerarCodigo() {
        for (int i = 0; i < 10; i++) {
            String gerado = repository.gerarProximoCodigo();
            if (!repository.existsByCodigo(gerado)) return gerado;
        }
        throw new RegraDeNegocioException("Não foi possível gerar o código do pedido");
    }
}
