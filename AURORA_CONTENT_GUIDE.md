# Project Aurora Brasil

Este documento descreve a versao brasileira do Project Aurora, refatorada para Petrolina, Manaus e Pelotas e pensada para estudantes de 12 anos.

Aurora nao apresenta cidades como cartoes-postais. Ele apresenta cidades como sistemas sob pressao. O foco e investigativo: os dados nao entregam respostas prontas, nao oferecem solucoes fechadas e nao tentam aliviar a gravidade do que mostram. O objetivo e ensinar o aluno a olhar para um numero ruim e perguntar: onde esse sistema falhou?

## 1. Conceito da experiencia

Aurora e uma experiencia digital de leitura critica sobre tres cidades brasileiras.

- Petrolina mostra o nexo agua-energia no semi-arido.
- Manaus mostra a perda dos caminhos de agua e dos servicos ecossistemicos.
- Pelotas mostra a pobreza energetica, a umidade e a arquitetura inadequada ao frio.

Cada cidade funciona como um estudo de caso. Em vez de explicar o Brasil por uma narrativa unica, Aurora usa tres territorios com problemas diferentes para ensinar que pressao urbana sempre depende do lugar, do clima, da infraestrutura e da desigualdade.

## 2. Objetivo pedagogico

O projeto foi desenhado para:

- estimular investigacao critica
- tornar visiveis falhas sistemicas
- mostrar relacoes entre clima, infraestrutura e vida cotidiana
- ensinar leitura de graficos sem transformar a experiencia em aula expositiva
- incentivar perguntas em vez de respostas fechadas

O aluno nao deve sair com uma solucao pronta. Ele deve sair com novas perguntas:

- quem fica com a parte pior do sistema?
- que dependencia esta escondida?
- o problema esta no recurso, no acesso ou na distribuicao?
- o que parece natural, mas na verdade foi produzido por falha urbana?

## 3. Como a experiencia funciona

Aurora tem uma sequencia simples:

1. Abertura com loading de leitura critica.
2. Tela inicial com as tres cidades.
3. Entrada em uma cidade especifica.
4. Dossie da cidade com imagens, texto, mapa e fatos criticos.
5. Leitura por camadas de sistema.
6. Modo de comparacao entre cidades.

Cada camada mistura:

- frase de estado
- resumo curto
- metricas de impacto
- graficos
- alerta
- pergunta investigativa

O usuario nao recebe uma resposta final. Ele e convidado a montar a propria leitura.

## 4. Cidades e papeis narrativos

### Petrolina

Petrolina representa o paradoxo do semi-arido: rio presente, sol abundante e, ainda assim, falha de abastecimento, despejo de esgoto bruto e dependencia de energia fossil.

Eixo central:

- Agua e Escassez
- Energia e Sol

Pergunta-chave:

- Como uma cidade atravessada pelo Sao Francisco normaliza tanta desigualdade de acesso?

### Manaus

Manaus representa a contradicao entre floresta abundante e cidade asfaltada, quente e mal saneada. O foco esta na morte dos igarapes, no aculo de residuos hidricos e nas ilhas de calor.

Eixo central:

- Ilhas de Calor
- Residuos Hidricos

Pergunta-chave:

- O que a cidade destruiu no proprio ambiente para ficar tao hostil?

### Pelotas

Pelotas representa o frio vivido como perda economica e risco de saude. O foco esta em vazamento termico, mofo, sobrecarga eletrica e arquitetura despreparada.

Eixo central:

- Vazamento Termico
- Pico de Inverno

Pergunta-chave:

- O frio e o problema principal, ou a casa mal preparada para ele?

## 5. Direcao de UX

Aurora Brasil foi refatorado para uma UX mais dura, industrial e inquieta.

Principios:

- fundo anthracite e superfices escuras
- vermelho de sinal para estados criticos
- amber para atencao
- nada de visual "feliz"
- brilho pulsante em estados criticos
- leitura com clima de scanner e sistema sob pressao
- imagens dessaturadas para destacar desgaste, calor, sujeira e perda

Interacoes:

- metricas abrem perguntas investigativas
- graficos tambem abrem perguntas
- em Petrolina, o hover nos graficos de agua acende o card do nexo com energia
- o compare nao tenta harmonizar tudo; ele mostra tambem ausencias e lacunas

## 6. Acessibilidade

Aurora depende de contraste alto e hierarquia visual clara.

As principais decisoes de acessibilidade sao:

- contraste forte entre fundo e texto
- badges de status com cor e texto
- descricoes textuais para leitura de valores
- aria-label nos cards e graficos
- linguagem curta e direta

## 7. Estrutura de dados atual

O app ativo usa arquivos TypeScript como fonte principal.

Arquivos ativos:

- `src/data/cities/petrolina.ts`
- `src/data/cities/manaus.ts`
- `src/data/cities/pelotas.ts`
- `src/data/cities/index.ts`
- `src/types/city.ts`

Cada cidade contem:

- `slug`
- `name`
- `oneLineDescription`
- `missionBrief`
- `macroStats`
- `logo`
- `heroImage`
- `secondaryImage`
- `mapImage`
- `layers`

Cada camada contem:

- `key`
- `label`
- `status`
- `state`
- `miniSummary`
- `summaryStrip`
- `stats`
- `charts`
- `alerts`

## 8. Tipos de grafico usados

Aurora suporta:

- `line`
- `area`
- `bar`
- `stacked-bar`
- `donut`
- `radial`
- `progress`
- `heatmap`

Uso atual por cidade:

- Petrolina usa `donut`, `bar`, `stacked-bar` e `progress`
- Manaus usa `area`, `heatmap`, `line` e `progress`
- Pelotas usa `bar`, `radial`, `line` e `donut`

Os graficos nao sao neutros. Eles funcionam como linguagem narrativa:

- `donut` mostra dependencia ou divisao
- `bar` mostra desigualdade ou contraste direto
- `line` mostra acumulacao ou escalada
- `area` mostra peso ambiental
- `radial` vira leitura de risco
- `progress` vira alerta simples
- `heatmap` mostra concentracao de dano

## 9. Arquitetura da interface

### Entrada

- `src/App.tsx`
- `src/components/LoadingScreen.tsx`

### Navegacao e rotas

- `src/app/router/AppRouter.tsx`
- `src/pages/LandingPage.tsx`
- `src/pages/CityPage.tsx`
- `src/components/navigation/SidebarNav.tsx`
- `src/components/navigation/CitySwitcher.tsx`

### Conteudo

- `src/components/mission-brief/MissionBriefView.tsx`
- `src/components/dashboard/SystemLayerView.tsx`
- `src/components/dashboard/CompareCitiesView.tsx`

### Graficos e estilo

- `src/components/charts/ChartRenderer.tsx`
- `src/lib/chartTheme.ts`
- `src/styles/globals.css`
- `tailwind.config.ts`

## 10. Como editar o projeto

### Para mudar texto

Edite diretamente os arquivos de cidade:

- `src/data/cities/petrolina.ts`
- `src/data/cities/manaus.ts`
- `src/data/cities/pelotas.ts`

Ali vivem:

- descricoes curtas
- mission brief
- macroStats
- frases de estado
- resumos
- alertas

### Para mudar dados

Edite:

- `summaryStrip`
- `stats`
- `charts`

nos objetos de camada.

### Para mudar tipo de grafico

Troque o `type` e ajuste o formato dos dados.

Regras:

- `line`, `area`, `bar` e `stacked-bar` usam `data` e `series`
- `donut` usa `segments`
- `radial` e `progress` usam `value`, `max`, `centerValue` e `centerLabel`
- `heatmap` usa `rows`

### Para mudar a linguagem visual

Edite:

- `src/styles/globals.css`
- `src/lib/chartTheme.ts`
- `tailwind.config.ts`

## 11. Assets atuais

Como esta fase da refatoracao prioriza conceito, leitura critica e coerencia visual, os assets foram trocados por paineis SVG locais com linguagem industrial. Eles funcionam como:

- logos
- cenas de contexto
- mapas esquematicos

Isso evita misturar imagens antigas de cidades ficticias com o novo recorte brasileiro.

## 12. Arquivos legados

Ainda existem arquivos legados no repositorio ligados a uma versao anterior do projeto, incluindo um parser CSV antigo.

O app ativo desta refatoracao nao depende deles para renderizar as paginas atuais. A fonte principal agora esta nos arquivos TypeScript das tres cidades brasileiras.

## 13. Posicionamento final

Aurora Brasil e uma experiencia de leitura critica sobre falhas urbanas. Ele nao foi feito para confortar, nem para entregar respostas automaticas. Foi feito para ensinar observacao, confronto e pergunta.

Quando funciona bem, o aluno deixa de olhar para um grafico como decoracao e passa a olhar para ele como pista.

