# Conector n8n Customizado: True Random Number Generator

## Visão Geral

Este repositório contém a solução para o desafio técnico proposto pela **Onfly** para a vaga de estágio em tecnologia. O objetivo foi desenvolver um nó (conector) customizado para a plataforma de automação low-code n8n, demonstrando habilidades em desenvolvimento back-end, integração com APIs e uso de ambientes containerizados com Docker.

O resultado é um nó de automação robusto e reutilizável que se integra à API do `Random.org` para gerar números aleatórios verdadeiros, enriquecendo o resultado com informações adicionais e oferecendo tratamento de erros amigável.

## Principais Funcionalidades

* **Geração de Números Aleatórios:** Utiliza o endpoint `integers` da API do Random.org para garantir a aleatoriedade.
* **Validação de Intervalo:** Verifica se o valor mínimo inserido não é maior que o valor máximo, retornando um erro claro na saída do nó.
* **Enriquecimento de Dados:** Além do número gerado, o nó adiciona dois campos extras ao resultado:
    * `verificacao`: Informa se o número é "Par" ou "Ímpar".
    * `geradoEm`: Adiciona um timestamp no formato ISO 8601 de quando o número foi gerado.

## Tecnologias Utilizadas

* **TypeScript**
* **Node.js**
* **Docker & Docker Compose**
* **PostgreSQL**
* **n8n** (Ambiente de desenvolvimento e execução)

## Pré-requisitos

Para executar este projeto localmente, você precisará ter instalado:

* [Node.js](https://nodejs.org/) (versão 22 LTS ou superior)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Executando o Projeto

Siga os passos abaixo para configurar e iniciar o ambiente de desenvolvimento.

**1. Clonar o Repositório**
```bash
git clone https://github.com/Dolabelaa/n8n-challenge.git
cd n8n-challenge
````

**2. Instalar Dependências**
Execute o comando abaixo para instalar as dependências do projeto listadas no `package.json`.

```bash
npm install
```

**3. Compilar o Conector**
Este passo transpila o código-fonte de TypeScript para JavaScript, gerando a versão final na pasta `/dist`.

```bash
npm run build
```

**4. Iniciar o Ambiente**
Com o Docker Desktop em execução, suba os containers do n8n e do PostgreSQL.

```bash
docker-compose up -d
```

Após alguns instantes, a instância do n8n estará acessível em seu navegador.

**5. Acessar a Plataforma**
Abra seu navegador e navegue para `http://localhost:5678`.

## Como Utilizar o Conector

1.  Na interface do n8n, crie um novo workflow.
2.  Clique no `+` para adicionar um nó e pesquise por "**Random**".
3.  Configure os parâmetros `ValorMinimo` e `ValorMaximo`.
4.  Execute o nó para ver o resultado no painel de saída (Output).

## Desafios e Aprendizados

*(Esta é a sua seção pessoal\! Use o exemplo abaixo como inspiração para escrever com as suas palavras.)*

O desenvolvimento deste conector foi uma jornada de aprendizado prático e intenso. O principal desafio foi superar os erros de compatibilidade de tipos em TypeScript, o que exigiu uma depuração metódica e me ensinou a importância de entender profundamente o ecossistema de um framework.

Além disso, a configuração do ambiente com Docker Compose reforçou meu conhecimento sobre a criação de ambientes de desenvolvimento consistentes e isolados. O resultado final não é apenas a solução de um problema, mas um projeto que reflete minha capacidade de aprender novas tecnologias, persistir diante de obstáculos e entregar um software funcional e de qualidade.

```
```
