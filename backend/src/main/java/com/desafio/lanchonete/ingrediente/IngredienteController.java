package com.desafio.lanchonete.ingrediente;

import com.desafio.lanchonete.ingrediente.dto.IngredienteRequest;
import com.desafio.lanchonete.ingrediente.dto.IngredienteResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ingredientes")
@RequiredArgsConstructor
public class IngredienteController {

    private final IngredienteService service;

    @GetMapping
    public List<IngredienteResponse> listar(@RequestParam(required = false) String termo) {
        return service.listar(termo);
    }

    @GetMapping("/adicionais")
    public List<IngredienteResponse> listarAdicionais() {
        return service.listarAdicionais();
    }

    @GetMapping("/{id}")
    public IngredienteResponse buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IngredienteResponse criar(@Valid @RequestBody IngredienteRequest req) {
        return service.criar(req);
    }

    @PutMapping("/{id}")
    public IngredienteResponse atualizar(@PathVariable Long id,
                                         @Valid @RequestBody IngredienteRequest req) {
        return service.atualizar(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
