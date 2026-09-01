package com.desafio.lanchonete.pedido;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pedido_observacao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoObservacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @Column(nullable = false, length = 255)
    private String texto;

    @Column(nullable = false)
    private Integer ordem;
}
