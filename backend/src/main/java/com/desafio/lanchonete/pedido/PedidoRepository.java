package com.desafio.lanchonete.pedido;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    boolean existsByCodigo(String codigo);

    @Query("""
            select p from Pedido p
            where upper(p.codigo) like upper(concat('%', :termo, '%'))
               or upper(p.descricao) like upper(concat('%', :termo, '%'))
               or upper(p.clienteNome) like upper(concat('%', :termo, '%'))
            order by p.dataPedido desc
            """)
    List<Pedido> pesquisar(@Param("termo") String termo);

    @Query(value = "select 'PED-' || lpad(cast(nextval('seq_pedido_codigo') as text), 4, '0')",
            nativeQuery = true)
    String gerarProximoCodigo();
}
