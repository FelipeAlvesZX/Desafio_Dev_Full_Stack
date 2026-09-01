package com.desafio.lanchonete.bebida;

import com.desafio.lanchonete.bebida.dto.BebidaRequest;
import com.desafio.lanchonete.bebida.dto.BebidaResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bebidas")
@RequiredArgsConstructor
public class BebidaController {

    private final BebidaService service;

    @GetMapping
    public List<BebidaResponse> listar(@RequestParam(required = false) String termo) {
        return service.listar(termo);
    }

    @GetMapping("/{id}")
    public BebidaResponse buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BebidaResponse criar(@Valid @RequestBody BebidaRequest req) {
        return service.criar(req);
    }

    @PutMapping("/{id}")
    public BebidaResponse atualizar(@PathVariable Long id,
                                    @Valid @RequestBody BebidaRequest req) {
        return service.atualizar(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}