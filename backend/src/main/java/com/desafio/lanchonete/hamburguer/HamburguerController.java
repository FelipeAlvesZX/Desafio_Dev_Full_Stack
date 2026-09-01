package com.desafio.lanchonete.hamburguer;

import com.desafio.lanchonete.hamburguer.dto.HamburguerRequest;
import com.desafio.lanchonete.hamburguer.dto.HamburguerResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hamburgueres")
@RequiredArgsConstructor
public class HamburguerController {

    private final HamburguerService service;

    @GetMapping
    public List<HamburguerResponse> listar(@RequestParam(required = false) String termo) {
        return service.listar(termo);
    }

    @GetMapping("/{id}")
    public HamburguerResponse buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HamburguerResponse criar(@Valid @RequestBody HamburguerRequest req) {
        return service.criar(req);
    }

    @PutMapping("/{id}")
    public HamburguerResponse atualizar(@PathVariable Long id,
                                        @Valid @RequestBody HamburguerRequest req) {
        return service.atualizar(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
