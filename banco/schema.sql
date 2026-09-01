create extension if not exists pg_trgm;

create sequence seq_bebida_codigo      start 1;
create sequence seq_ingrediente_codigo start 1;
create sequence seq_hamburguer_codigo  start 1;
create sequence seq_pedido_codigo      start 1;

create or replace function set_atualizado_em()
returns trigger as $$
begin
    new.atualizado_em = now();
    return new;
end;
$$ language plpgsql;

create table bebida (
    id bigint generated always as identity primary key,
    codigo varchar(20) not null,
    descricao varchar(120) not null,
    preco_unitario numeric(10,2) not null check (preco_unitario >= 0),
    contem_acucar boolean not null default FALSE,
    criado_em timestamp not null default now(),
    atualizado_em   timestamp not null default now(),
    constraint uq_bebida_codigo unique (codigo),
    constraint ck_bebida_codigo check  (codigo ~ '^[A-Z]{3}-[0-9]{4}$')
);

create index idx_bebida_descricao_trgm on bebida using gin (descricao gin_trgm_ops);

create trigger trg_bebida_atualizado_em
    before update on bebida
    for each row execute function set_atualizado_em();

create table ingrediente (
    id bigint generated always as identity primary key,
    codigo varchar(20) not null,
    descricao varchar(120) not null,
    preco_unitario numeric(10,2) not null check (preco_unitario >= 0),
    permite_adicional boolean not null default FALSE,
    criado_em  timestamp not null default now(),
    atualizado_em timestamp not null default now(),
    constraint uq_ingrediente_codigo unique (codigo),
    constraint ck_ingrediente_codigo check  (codigo ~ '^[A-Z]{3}-[0-9]{4}$')
);

create index idx_ingrediente_descricao_trgm on ingrediente using gin (descricao gin_trgm_ops);

create trigger trg_ingrediente_atualizado_em
    before update on ingrediente
    for each row execute function set_atualizado_em();

create table hamburguer (
    id bigint generated always as identity primary key,
    codigo varchar(20) not null,
    descricao varchar(120) not null,
    valor numeric(10,2) not null check (valor >= 0),
    criado_em timestamp not null default now(),
    atualizado_em   timestamp not null default now(),
    constraint uq_hamburguer_codigo unique (codigo),
    constraint ck_hamburguer_codigo check  (codigo ~ '^[A-Z]{3}-[0-9]{4}$')
);

create index idx_hamburguer_descricao_trgm on hamburguer using gin (descricao gin_trgm_ops);

create trigger trg_hamburguer_atualizado_em
    before update on hamburguer
    for each row execute function set_atualizado_em();

create table hamburguer_ingrediente (
    hamburguer_id   bigint not null references hamburguer(id)   on delete cascade,
    ingrediente_id  bigint not null references ingrediente(id)  on delete restrict,
    primary key (hamburguer_id, ingrediente_id)
);

create table pedido (
    id bigint generated always as identity primary key,
    codigo varchar(20) not null,
    data_pedido   timestamp not null default now(),
    descricao  varchar(255),
    cliente_nome  varchar(120)  not null,
    cliente_endereco    varchar(255)  not null,
    cliente_telefone    varchar(20)   not null,
    valor_total   numeric(10,2) not null default 0 check (valor_total >= 0),
    criado_em  timestamp not null default now(),
    atualizado_em timestamp not null default now(),
    constraint uq_pedido_codigo unique (codigo),
    constraint ck_pedido_codigo check  (codigo ~ '^[A-Z]{3}-[0-9]{4}$')
);

create index idx_pedido_descricao_trgm on pedido using gin (descricao gin_trgm_ops);
create index idx_pedido_cliente_nome_trgm on pedido using gin (cliente_nome gin_trgm_ops);
create index idx_pedido_data on pedido (data_pedido);

create trigger trg_pedido_atualizado_em
    before update on pedido
    for each row execute function set_atualizado_em();

create table pedido_hamburguer (
    id bigint generated always as identity primary key,
    pedido_id bigint  not null references pedido(id) on delete cascade,
    hamburguer_id bigint  not null references hamburguer(id) on delete restrict,
    quantidade integer not null default 1 check (quantidade > 0),
    preco_unitario  numeric(10,2) not null check (preco_unitario >= 0)
);

create index idx_pedido_hamburguer_pedido on pedido_hamburguer (pedido_id);

create table pedido_bebida (
    id bigint generated always as identity primary key,
    pedido_id bigint  not null references pedido(id) on delete cascade,
    bebida_id bigint  not null references bebida(id) on delete restrict,
    quantidade integer not null default 1 check (quantidade > 0),
    preco_unitario  numeric(10,2) not null check (preco_unitario >= 0)
);

create index idx_pedido_bebida_pedido on pedido_bebida (pedido_id);

create table pedido_observacao (
    id bigint generated always as identity primary key,
    pedido_id bigint not null references pedido(id) on delete cascade,
    texto varchar(255) not null,
    ordem integer not null default 0
);

create index idx_pedido_observacao_pedido on pedido_observacao (pedido_id);

create table pedido_adicional (
    id bigint generated always as identity primary key,
    pedido_id bigint not null references pedido(id)on delete cascade,
    ingrediente_id bigint  not null references ingrediente(id) on delete restrict,
    quantidade integer not null default 1 check (quantidade > 0),
    preco_unitario numeric(10,2) not null check (preco_unitario >= 0)
);

create index idx_pedido_adicional_pedido on pedido_adicional (pedido_id);

create or replace function valida_ingrediente_adicional()
returns trigger as $$
declare
    v_permite boolean;
begin
    select permite_adicional into v_permite
    from ingrediente
    where id = new.ingrediente_id;

    if v_permite is distinct from true then
  raise EXCEPTION
   'Ingrediente id=% não está habilitado como adicional (permite_adicional=false)',
   new.ingrediente_id;
    end if;

    return new;
end;
$$ language plpgsql;

create trigger trg_pedido_adicional_valida
    before insert or update on pedido_adicional
    for each row execute function valida_ingrediente_adicional();

create or replace view vw_pedido_total_calculado as
select
    p.id as pedido_id,
    p.codigo,
    p.valor_total as valor_total_persistido,
    coalesce(h.subtotal, 0) + coalesce(b.subtotal, 0) + coalesce(a.subtotal, 0) as valor_total_calculado
from pedido p
left join (
    select pedido_id, sum(quantidade * preco_unitario) as subtotal
    from pedido_hamburguer group by pedido_id
) h on h.pedido_id = p.id
left join (
    select pedido_id, sum(quantidade * preco_unitario) as subtotal
    from pedido_bebida group by pedido_id
) b on b.pedido_id = p.id
left join (
    select pedido_id, sum(quantidade * preco_unitario) as subtotal
    from pedido_adicional group by pedido_id
) a on a.pedido_id = p.id;