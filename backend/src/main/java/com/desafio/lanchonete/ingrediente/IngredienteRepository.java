package com.desafio.lanchonete.ingrediente;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IngredienteRepository extends JpaRepository<Ingrediente, Long> {

    boolean existsByCodigo(String codigo);

    List<Ingrediente> findByPermiteAdicionalTrue();

    @Query("""
            select i from Ingrediente i
            where upper(i.codigo) like upper(concat('%', :termo, '%'))
               or upper(i.descricao) like upper(concat('%', :termo, '%'))
            """)
    List<Ingrediente> pesquisar(@Param("termo") String termo);

    @Query(value = "select 'ING-' || lpad(cast(nextval('seq_ingrediente_codigo') as text), 4, '0')",
            nativeQuery = true)
    String gerarProximoCodigo();
}
