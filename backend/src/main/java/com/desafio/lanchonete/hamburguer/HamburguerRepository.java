package com.desafio.lanchonete.hamburguer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HamburguerRepository extends JpaRepository<Hamburguer, Long> {

    boolean existsByCodigo(String codigo);

    @Query("""
            select distinct h from Hamburguer h
            left join fetch h.ingredientes
            where upper(h.codigo) like upper(concat('%', :termo, '%'))
               or upper(h.descricao) like upper(concat('%', :termo, '%'))
            """)
    List<Hamburguer> pesquisar(@Param("termo") String termo);

    @Query("select distinct h from Hamburguer h left join fetch h.ingredientes")
    List<Hamburguer> buscarTodosComIngredientes();

    @Query(value = "select 'HAM-' || lpad(cast(nextval('seq_hamburguer_codigo') as text), 4, '0')",
            nativeQuery = true)
    String gerarProximoCodigo();
}
