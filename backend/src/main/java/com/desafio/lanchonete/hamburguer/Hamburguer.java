package com.desafio.lanchonete.hamburguer;

import com.desafio.lanchonete.ingrediente.Ingrediente;
import com.desafio.lanchonete.shared.domain.EntidadeAuditavel;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hamburguer")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hamburguer extends EntidadeAuditavel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @Column(nullable = false, length = 120)
    private String descricao;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "hamburguer_ingrediente",
            joinColumns = @JoinColumn(name = "hamburguer_id"),
            inverseJoinColumns = @JoinColumn(name = "ingrediente_id")
    )
    @Builder.Default
    private List<Ingrediente> ingredientes = new ArrayList<>();
}
