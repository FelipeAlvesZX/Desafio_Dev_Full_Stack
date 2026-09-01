package com.desafio.lanchonete.bebida;

import com.desafio.lanchonete.shared.domain.EntidadeAuditavel;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "bebida")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bebida extends EntidadeAuditavel{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @Column(nullable = false, length = 120)
    private String descricao;

    @Column(name = "preco_unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal precoUnitario;

    @Column(name = "contem_acucar", nullable = false)
    private Boolean contemAcucar;
}
