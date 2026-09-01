# Sistema de Gestão de Pedidos — Lanchonete

Aplicação web para gestão de pedidos de uma lanchonete, com cadastro de bebidas,
ingredientes e hambúrgueres, e lançamento de pedidos com adicionais e cálculo
automático do valor total.

Desenvolvido como resposta ao Desafio Técnico – Desenvolvedor(a) Full Stack (Salutem).

---

## Stack

| Camada | Tecnologia | Versão |
|---|---|---|
| Back-end | Java | 25 |
| | Spring Boot | 4.1.1 |
| | Spring Web MVC, Spring Data JPA, Bean Validation, Lombok | — |
| | Maven | 3.9 |
| Front-end | Angular | 22.1 |
| | Node.js | 24 |
| | TypeScript, SCSS | — |
| Banco | PostgreSQL | 16 |
| Infra | Docker + Docker Compose | — |
| | Nginx (serve o front e faz proxy da API) | 1.27 |

---

## Como executar

### Pré-requisito único

**Docker Desktop** instalado e em execução. Não é necessário ter Java, Node,
Maven ou PostgreSQL na máquina — tudo é compilado e executado dentro dos
containers.

### Subindo o projeto

Há um script de inicialização para cada sistema operacional em
`services/instaladores/`. Ele apenas verifica se o Docker está disponível e
executa o Compose no diretório correto.

**Windows**
```
services\instaladores\iniciar-windows.bat
```

**Linux**
```bash
chmod +x services/instaladores/iniciar-linux.sh
./services/instaladores/iniciar-linux.sh
```

**macOS**
```bash
chmod +x services/instaladores/iniciar-mac.command
./services/instaladores/iniciar-mac.command
```

**Ou diretamente pelo Docker Compose:**
```bash
cd services/docker
docker compose up --build -d
```

O primeiro build leva alguns minutos (download das imagens base e das
dependências de Maven e npm). Os seguintes usam cache.

### Endereços

| Serviço | URL |
|---|---|
| Front-end | http://localhost:4222 |
| API | http://localhost:8082 |
| PostgreSQL | localhost:5432 |

> A raiz da API (`http://localhost:8082/`) retorna 404 — é o comportamento
> esperado, pois não há controller mapeado em `/`. Use um endpoint real,
> como `http://localhost:8082/bebidas`.

### Parando

```bash
cd services/docker
docker compose down        # para os containers, preserva os dados
docker compose down -v     # para e apaga o volume do banco
```

O `schema.sql` só é executado na **primeira** criação do volume. Se você
alterar o schema, use `docker compose down -v` para que ele seja reaplicado.

---

## Configuração

As portas e credenciais ficam em `services/docker/.env`:

```
POSTGRES_DB=desafio_lanchonete_db
POSTGRES_USER=desafio_salutem
POSTGRES_PASSWORD=desafio
POSTGRES_PORT=5432
BACKEND_PORT=8082
FRONTEND_PORT=4222
```

Para trocar a porta do front-end ou da API, altere apenas esse arquivo e suba
novamente. As portas **internas** dos containers (8082 no backend, 80 no nginx)
são referenciadas pelo `nginx.conf` e não devem ser alteradas isoladamente.

---

## Estrutura do repositório

```
.
├── backend/                 API REST em Spring Boot
├── frontend/                SPA em Angular
├── banco/
│   └── schema.sql           DDL: tabelas, constraints, triggers, sequences
└── services/
    ├── docker/              docker-compose.yml e .env
    ├── instaladores/        scripts de inicialização por SO
    └── testes/              coleção Postman e script de smoke test
```

### Back-end — organização em camadas

O código é organizado **por domínio**, com as camadas explícitas dentro de cada
pacote. Mexer na regra de bebida significa abrir uma pasta, não cinco.

```
com.desafio.lanchonete
├── config/                        CORS
├── shared/
│   ├── domain/                    EntidadeAuditavel (@MappedSuperclass)
│   └── exception/                 ApiExceptionHandler e exceções de domínio
├── bebida/
│   ├── Bebida.java                @Entity
│   ├── BebidaRepository.java      Spring Data JPA
│   ├── BebidaService.java         regra de negócio + transação
│   ├── BebidaController.java      @RestController
│   ├── BebidaMapper.java          entidade ↔ DTO
│   └── dto/                       Request e Response
├── ingrediente/                   (mesma estrutura)
├── hamburguer/                    (mesma estrutura)
└── pedido/
    ├── Pedido.java + 4 entidades filhas
    ├── CalculadoraTotalPedido.java  regra do requisito 3.5, isolada
    └── ...
```

O fluxo é sempre `Controller → Service → Repository`. Nenhum controller acessa
o repositório diretamente, e as entidades JPA não são expostas na API — o
contrato HTTP é definido pelos DTOs.

O tratamento de erros é centralizado em `ApiExceptionHandler`
(`@RestControllerAdvice`), que traduz exceção em status HTTP:

| Situação | Exceção | HTTP |
|---|---|---|
| Registro inexistente | `RecursoNaoEncontradoException` | 404 |
| Código duplicado, adicional inválido | `RegraDeNegocioException` | 409 |
| Campo obrigatório, formato inválido | `MethodArgumentNotValidException` | 400 |
| Violação de constraint no banco | `DataIntegrityViolationException` | 409 |

### Front-end — organização em camadas

```
src/app
├── core/                     infraestrutura
│   ├── models/               interfaces espelhando os DTOs da API
│   ├── interceptors/         prefixo /api e tratamento de erro
│   └── services/             notificações (toast)
├── shared/                   reutilizáveis, sem regra de negócio
│   ├── components/           tabela-pesquisa, confirmacao-dialog
│   └── pipes/                moeda-br
└── features/                 um pacote por domínio
    ├── bebida/               service + rotas + telas (lista e formulário)
    ├── ingrediente/
    ├── hamburguer/
    └── pedido/
```

Nenhum componente injeta `HttpClient` diretamente — o acesso à API passa sempre
pelo service da feature. Não há URL absoluta no código: o
`api-url-interceptor` prefixa `/api` em toda chamada, e o Nginx faz o proxy
para o backend. `core/` e `shared/` não dependem de `features/`.

---

## Banco de dados

O `banco/schema.sql` é a fonte da verdade do schema e é executado
automaticamente pelo container do PostgreSQL na primeira inicialização.

O Hibernate roda com `spring.jpa.hibernate.ddl-auto=validate`: ele **confere**
se as entidades correspondem às tabelas e falha no boot em caso de divergência,
mas nunca altera o schema. Isso preserva as constraints e triggers que o
Hibernate não conhece.

### Modelo

| Tabela | Papel |
|---|---|
| `bebida`, `ingrediente`, `hamburguer` | cadastros (requisitos 3.1 e 3.2) |
| `hamburguer_ingrediente` | composição do hambúrguer (N:N) |
| `pedido` | cabeçalho do pedido (requisito 3.3) |
| `pedido_hamburguer`, `pedido_bebida` | itens do pedido |
| `pedido_adicional` | adicionais (requisito 3.4) |
| `pedido_observacao` | observações em texto livre |

### Decisões de modelagem

**`codigo` é chave de negócio, separada do `id`.** O `id` é a chave técnica
(`BIGINT IDENTITY`); o `codigo` é o identificador que o usuário vê e pesquisa.
Mantê-los separados permite que o código venha de um sistema legado ou de uma
etiqueta de fornecedor, e faz o histórico sobreviver a uma migração de base.

**Formato padronizado `AAA-0000`**, garantido por `CHECK` no banco. O código
pode ser digitado pelo usuário ou gerado automaticamente pelo sistema a partir
de uma `SEQUENCE` (`BEB-0001`, `ING-0001`, `HAM-0001`, `PED-0001`) quando o
campo é deixado em branco.

**Preço dos itens do pedido é um _snapshot_.** As tabelas
`pedido_hamburguer`, `pedido_bebida` e `pedido_adicional` gravam o
`preco_unitario` vigente no momento do lançamento. Reajustar o preço no
cadastro não altera o valor de pedidos já registrados.

**A regra do requisito 3.4 é validada em dois níveis.** O service rejeita o
ingrediente com mensagem legível; uma trigger no banco (`trg_pedido_adicional_valida`)
impede o dado inconsistente caso a validação da aplicação seja contornada.

**`ON DELETE RESTRICT`** nos itens de cadastro referenciados por pedidos:
não é possível excluir uma bebida que já tem histórico.

---

## API

Todos os cadastros expõem o mesmo conjunto de operações:

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/{recurso}` | Lista todos |
| `GET` | `/{recurso}?termo=x` | Pesquisa por **código ou descrição** |
| `GET` | `/{recurso}/{id}` | Busca por id |
| `POST` | `/{recurso}` | Cria — `201 Created` |
| `PUT` | `/{recurso}/{id}` | Atualiza |
| `DELETE` | `/{recurso}/{id}` | Exclui — `204 No Content` |

Recursos: `/bebidas`, `/ingredientes`, `/hamburgueres`, `/pedidos`.

Endpoint adicional:

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/ingredientes/adicionais` | Apenas ingredientes com `permiteAdicional = true` — consumido pela tela de pedido (requisito 3.4) |

### Exemplo

```bash
# cria uma bebida com código gerado automaticamente
curl -X POST http://localhost:8082/bebidas \
  -H "Content-Type: application/json" \
  -d '{"codigo":null,"descricao":"Coca-Cola Lata 350ml","precoUnitario":6.50,"contemAcucar":true}'
```

---

## Testes

### Coleção Postman

`services/testes/lanchonete-api.postman_collection.json` — 36 requisições
organizadas por recurso, cobrindo o caminho feliz e os casos de erro
(código duplicado, formato inválido, campo obrigatório, id inexistente,
adicional não habilitado). Importe no Postman em **File → Import**.

### Smoke test

`services/testes/smoke-test.ps1` encadeia o fluxo completo automaticamente
(cria ingrediente → usa no hambúrguer → monta o pedido) e confere o valor
total calculado:

```powershell
cd services\testes
.\smoke-test.ps1
```

---

## Requisitos do desafio

| Item | Requisito | Situação |
|---|---|---|
| 3.1 | Cadastro e pesquisa de bebidas e ingredientes | Atendido |
| 3.2 | Cadastro de hambúrguer com lista de ingredientes | Atendido |
| 3.3 | Tela de pedido | Atendido |
| 3.4 | Lançamento de adicionais *(diferencial)* | Atendido |
| 3.5 | Cálculo do preço total *(diferencial)* | Atendido |

A pesquisa por **código e descrição** é feita no banco, em uma única consulta
por recurso, com índices GIN (`pg_trgm`) sobre a descrição.

O cálculo do total (3.5) é implementado em dois lugares com propósitos
distintos: no front-end, com `computed()` do Angular, para recalcular em tempo
real conforme o usuário altera os itens, sem ida ao servidor; e no back-end,
na classe `CalculadoraTotalPedido`, que é a autoridade sobre o valor
persistido — o total não depende do que o cliente envia.

---

## Desenvolvimento sem Docker

Requer Java 25, Node 24 e um PostgreSQL acessível.

**Banco** — apenas o container do banco:
```bash
cd services/docker
docker compose up db -d
```

**Back-end** (porta 8082):
```bash
cd backend
./mvnw spring-boot:run
```

**Front-end** (porta 4222 no modo de desenvolvimento):
```bash
cd frontend
npm install
npm start
```

O CORS já está liberado para `http://localhost:4222` em
`config/CorsConfig.java`; ao usar `ng serve` na porta padrão 4222, inclua essa
origem na configuração.
