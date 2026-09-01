package com.desafio.lanchonete.pedido;

import com.desafio.lanchonete.pedido.dto.PedidoRequest;
import com.desafio.lanchonete.pedido.dto.PedidoResponse;
import com.desafio.lanchonete.pedido.dto.PedidoResumoResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService service;

    @GetMapping
    public List<PedidoResumoResponse> listar(@RequestParam(required = false) String termo) {
        return service.listar(termo);
    }

    @GetMapping("/{id}")
    public PedidoResponse buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PedidoResponse criar(@Valid @RequestBody PedidoRequest req) {
        return service.criar(req);
    }

    @PutMapping("/{id}")
    public PedidoResponse atualizar(@PathVariable Long id,
                                    @Valid @RequestBody PedidoRequest req) {
        return service.atualizar(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
