# Project Aurora Brasil

Este documento descreve a versao atual do Project Aurora no recorte brasileiro. O projeto foi reorganizado como uma experiencia investigativa sobre pressao urbana para estudantes, usando Petrolina, Manaus e Pelotas como estudos de caso comparaveis.

Aurora nao apresenta cidades como vitrines. Ele apresenta cidades como sistemas em disputa. O foco nao e dar respostas prontas, mas ajudar o usuario a cruzar sinais, perceber desigualdade e perguntar onde o sistema falhou antes do numero aparecer.

## 1. Conceito

Aurora e uma experiencia digital de leitura critica sobre territorio, infraestrutura, clima e vida cotidiana.

As tres cidades cumprem papeis complementares:

- Petrolina mostra o paradoxo entre sol, rio e servicos desiguais no semi-arido.
- Manaus mostra o conflito entre floresta, asfalto, calor, poluicao e caminhos de agua bloqueados.
- Pelotas mostra a pobreza energetica e a exposicao ao frio umido em uma cidade historica do sul.

O objetivo nao e comparar qual cidade e pior. O objetivo e mostrar que o mesmo tipo de falha aparece de formas diferentes dependendo do clima, da forma urbana, da renda e da infraestrutura.

## 2. Objetivo pedagogico

O projeto foi desenhado para:

- estimular investigacao critica
- ensinar leitura de dados sem transformar a experiencia em aula expositiva
- mostrar relacoes entre ambiente, eficiencia, economia e equidade
- revelar como a pressao sistemica muda de cidade para cidade
- incentivar perguntas em vez de solucoes automaticas

As perguntas que a interface quer provocar sao:

- quem fica com a parte pior do sistema?
- o problema esta no recurso, no acesso ou no desenho da cidade?
- o que parece natural, mas foi agravado por uma escolha urbana?
- qual camada esta indo relativamente melhor e por que?
- que dependencia escondida conecta um sistema ao outro?

## 3. Estrutura atual da experiencia

O fluxo principal hoje e:

1. landing page com as tres cidades
2. entrada em um dossie urbano
3. mission brief com imagens, texto, fatos criticos e mapa
4. leitura por camadas padronizadas
5. compare mode com a mesma camada cruzada entre as tres cidades

Cada cidade publica exatamente as mesmas oito camadas:

- Energy
- Water
- Climate
- Air
- Waste
- Mobility
- Biodiversity
- Social

Isso significa que Aurora agora trabalha com comparabilidade estrutural. Cada cidade sempre traz o mesmo conjunto de eixos, mas com intensidades e narrativas diferentes.

## 4. Cidades e papeis narrativos

### Petrolina

Petrolina e lida como um territorio de abundancia desigual. O rio Sao Francisco e o potencial solar existem, mas a cidade ainda convive com pressao em agua, calor, confiabilidade de servico e confianca social.

Camadas mais preocupantes:

- Water
- Climate
- Social

Camada relativamente mais forte:

- Mobility

Pergunta central:

- Como uma cidade cercada por agua produtiva e luz solar intensa ainda normaliza perda, desigualdade e baixa confiabilidade?

### Manaus

Manaus e lida como uma metropole cercada por floresta, mas cada vez mais desconectada da protecao ecologica que deveria ter. O calor, a umidade, os residuos e o ar estagnado dominam a experiencia urbana.

Camadas mais preocupantes:

- Climate
- Air
- Waste
- Social

Camada relativamente mais forte:

- Biodiversity

Pergunta central:

- Por que uma cidade com tanta agua e massa florestal produz uma vida urbana tao pesada e pouco respiravel?

### Pelotas

Pelotas e lida como uma cidade onde o frio umido revela falhas de desenho, de eficiencia energetica e de protecao social. O problema nao e apenas o inverno. E o modo como a cidade deixa o corpo exposto a ele.

Camadas mais preocupantes:

- Energy
- Climate

Camadas relativamente mais fortes:

- Water
- Waste

Pergunta central:

- O frio e o problema, ou a arquitetura, a conta de luz e a desigualdade que transformam o frio em crise cotidiana?

## 5. Modelo de dados atual

O modelo ativo esta em:

- `src/types/city.ts`

Cada cidade em:

- `src/data/cities/petrolina.ts`
- `src/data/cities/manaus.ts`
- `src/data/cities/pelotas.ts`

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
- `breadcrumbLabel`
- `systemsOverview`
- `layers`

Cada camada contem:

- `key`
- `label`
- `icon`
- `status`
- `state`
- `miniSummary`
- `summaryStrip`
- `stats`
- `charts`
- `table`
- `alerts`

O ponto mais importante da refatoracao atual e este:

- toda cidade tem o mesmo numero de camadas
- toda camada usa a mesma estrutura
- toda camada mistura graficos, tabela e leitura textual
- toda cidade tem pelo menos uma camada mais forte e camadas preocupantes

## 6. Padrao de visualizacao por camada

Cada camada foi pensada para ser comparavel entre cidades. Por isso a composicao segue uma linguagem fixa:

1. cabecalho da camada com estado, resumo e metricas-resumo
2. grid de stat cards
3. quatro graficos com visual consistente
4. tabela de field notes
5. alertas
6. feed social dedicado quando a camada e `Social`

Isso permite ao usuario ler:

- status sintetico
- dados numericos
- contraste visual
- contexto territorial
- efeito sobre o cotidiano

## 7. Graficos e tabelas

Aurora continua suportando:

- `line`
- `area`
- `bar`
- `stacked-bar`
- `donut`
- `radial`
- `progress`
- `heatmap`

Renderizacao principal:

- `src/components/charts/ChartRenderer.tsx`

Helpers:

- `src/data/shared/helpers.ts`

Tema visual:

- `src/lib/chartTheme.ts`

Novo padrao de comparabilidade:

- cada camada usa quatro graficos
- todos os tipos seguem a mesma linguagem visual escura com acentos de alerta
- toda camada agora tambem possui uma tabela padronizada
- a tabela vive em `src/components/dashboard/LayerTableCard.tsx`

As tabelas nao servem como planilhas completas. Elas funcionam como notas de campo comparaveis, mostrando zonas, sinais e significado em uma estrutura curta e legivel.

## 8. Social como camada

O projeto agora trata `Social` como uma camada do mesmo nivel das demais, nao apenas como sidebar auxiliar.

Arquivos centrais:

- `src/data/socialPulse.ts`
- `src/components/dashboard/SocialFeedPanel.tsx`
- `src/components/dashboard/SocialPulse.tsx`

Existem dois usos:

- `SocialPulse` como feed lateral ao navegar no dossie
- `SocialFeedPanel` como bloco principal quando o usuario abre a camada `Social`

Isso torna a fala publica parte do modelo investigativo:

- posts mostram onde a pressao vira linguagem cotidiana
- o feed nao substitui dado tecnico
- o feed revela confianca, medo, desgaste e repeticao de falhas

## 9. Compare mode

O compare mode foi refeito para trabalhar com o modelo fixo de camadas.

Arquivo principal:

- `src/components/dashboard/CompareCitiesView.tsx`

Agora o usuario:

- escolhe uma camada
- ve as tres cidades na mesma estrutura
- cruza as quatro metricas-resumo dessa camada
- ve uma leitura de severidade compartilhada
- le as notas de campo das tres cidades lado a lado

Os elementos criativos centrais da comparacao sao:

- `Metric Switchboard`: mostra o mesmo sinal numerico nas tres cidades
- `Pressure Ladder`: converte status em uma escala unica de severidade
- `Metric Drift`: acompanha como os mesmos quatro sinais se comportam entre os casos
- `Field Note Braid`: junta as leituras territoriais locais em um unico quadro

A intencao e que a comparacao pareca uma mesa de investigacao, nao uma tabela burocratica.

## 10. UI e layout

A direcao visual atual prioriza alto contraste e leitura em tablets, especialmente iPad.

Arquivo principal de estilo:

- `src/styles/globals.css`

Shell e layout:

- `src/pages/CityPage.tsx`
- `src/components/navigation/SidebarNav.tsx`
- `src/components/navigation/TopCityNav.tsx`

Decisoes principais:

- fundo escuro em `#0D1117`
- acentos neon de alerta
- painel esquerdo de icones fixo a partir de telas maiores
- palco central em bento blocks
- feed lateral em telas muito largas
- layout fluido e responsivo sem depender de uma grade rigida unica

Comportamento atual por faixa:

- mobile: drawer lateral
- iPad e tablet horizontal: painel de icones fixo e conteudo central em blocos bento
- desktop amplo: painel esquerdo fixo, palco central e Social Pulse lateral

## 11. Assets atuais

O projeto agora usa imagens reais para cada cidade:

- `landscape`
- `streetview`
- `map`

Mapeadas em:

- `src/data/shared/assets.ts`

Arquivos atuais:

- `petrolina-landscape.png`
- `petrolina-streetview.png`
- `mapa-petrolina.png`
- `manaus-landscape.png`
- `manaus-streetview.png`
- `mapa-manaus.png`
- `pelotas-landscape.png`
- `pelotas-streetview.png`
- `mapa-pelotas.png`

Observacao importante:

- os logos individuais antigos nao estao mais no workspace
- por isso `project-aurora-logo.svg` esta sendo usado como fallback de logo para as tres cidades

## 12. Como editar o projeto

### Para mudar texto e dados

Edite diretamente:

- `src/data/cities/petrolina.ts`
- `src/data/cities/manaus.ts`
- `src/data/cities/pelotas.ts`

Ali vivem:

- textos curtos
- mission brief
- macroStats
- status das camadas
- metricas-resumo
- stats
- graficos
- tabelas
- alertas

### Para mudar tipos de grafico

Altere o `type` e mantenha a estrutura correta:

- `line`, `area`, `bar`, `stacked-bar` usam `data` e `series`
- `donut` usa `segments`
- `radial` e `progress` usam `value`, `max`, `centerValue` e `centerLabel`
- `heatmap` usa `rows`

### Para mudar tabelas

Cada camada usa `table`, com:

- `title`
- `subtitle`
- `columns`
- `rows`

As tabelas sao construidas com `makeTable(...)` em:

- `src/data/shared/helpers.ts`

### Para mudar o visual

Edite:

- `src/styles/globals.css`
- `src/lib/chartTheme.ts`
- `tailwind.config.ts`

## 13. Build e observacoes tecnicas

O build atual funciona.

Ponto tecnico ainda relevante:

- as imagens reais sao pesadas e aumentam o bundle final

Se a prioridade passar a ser performance, o proximo passo ideal e otimizar os arquivos de imagem.

## 14. Posicionamento final

Aurora Brasil agora funciona como um sistema comparavel de leitura urbana.

Ele nao pergunta apenas o que esta ruim. Ele pergunta:

- o que esta pior?
- o que ainda funciona?
- por que funciona melhor em uma cidade do que em outra?
- qual padrao de falha se repete?

Quando a experiencia funciona bem, o usuario para de olhar para graficos como decoracao e passa a le-los como pistas.
