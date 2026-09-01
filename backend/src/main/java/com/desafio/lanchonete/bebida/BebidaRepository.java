package com.desafio.lanchonete.bebida;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BebidaRepository extends JpaRepository<Bebida, Long> {
    boolean existsByCodigo(String codigo);

    @Query("""
        select b from Bebida b where upper(b.codigo) like upper(concat('%', :termo, '%')) 
            or upper(b.descricao) like upper(concat('%', :termo, '%'))
    """)
    List<Bebida> pesquisar(@Param("termo") String termo);

    @Query(value = "select 'BEB-'|| lpad(nextval('seq_bebida_codigo'):: text, 4, '0')", nativeQuery = true)
    String gerarProximoCodigo();
}
