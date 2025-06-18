# Ionic Pokédex

Uma Pokédex responsiva desenvolvida com Ionic + Angular, consumindo a PokéAPI oficial. Permite listar, filtrar, favoritar e visualizar detalhes dos Pokémons, com foco em performance, acessibilidade e experiência mobile/desktop.

---

## Funcionalidades

- **Listagem de Pokémons** com infinite scroll

<div align="center">
  <img src="src/assets/readme/home_mobile.png" width="200" alt="Home Mobile" />
  <img src="src/assets/readme/home_desk.png" width="400" alt="Home Desktop" />
</div>

- **Filtro por tipo** de Pokémon

<div align="center">
  <img src="src/assets/readme/filtro_desk_demo.gif" width="600" alt="Filtro por Tipo" />
</div>

- **Favoritos salvos localmente**

<div align="center">
  <img src="src/assets/readme/favoritos_mobile.png" width="200" alt="Favoritos Mobile" />
  <img src="src/assets/readme/favoritos_desk.png" width="400" alt="Favoritos Desktop" />
</div>

<div align="center">
  <img src="src/assets/readme/favoritos_mobile_demo.gif.gif" width="300" alt="Favoritos Demo Mobile" />
</div>

- **Detalhes completos** de cada Pokémon (imagens, tipos, habilidades, descrição, habitat e geração)

<div align="center">
  <img src="src/assets/readme/detalhes_desktop.gif" width="600" alt="Detalhes Pokémon" />
</div>

- **Responsivo** para mobile e desktop  
- **Acessibilidade:** alt em imagens, aria-label, contraste, navegação por teclado  
- **Performance:** lazy loading de imagens, trackBy em listas principais, preconnect para APIs  
- **UX Mobile:** alerta visual para rotação de tela

<div align="center">
  <img src="src/assets/readme/mobile_rotate_warning.gif" width="300" alt="Alerta de Rotação" />
</div>

---

## Tecnologias Utilizadas

- **[Ionic Framework](https://ionicframework.com/):** UI responsiva e componentes mobile/desktop (`@ionic/angular`)
- **[Angular](https://angular.io/):** SPA, DI, roteamento (`@angular/core`, `@angular/forms`, etc.)
- **[Capacitor](https://capacitorjs.com/):** Integração nativa para Android/iOS
- **[Ionic Storage](https://ionicframework.com/docs/angular/storage):** Persistência local
- **[RxJS](https://rxjs.dev/):** Programação reativa
- **[Swiper](https://swiperjs.com/):** Carrossel nos detalhes
- **[TypeScript](https://www.typescriptlang.org/):** Tipagem estática
- **[Jasmine](https://jasmine.github.io/) & [Karma](https://karma-runner.github.io/):** Testes unitários
- **[ESLint](https://eslint.org/):** Linting (`@angular-eslint`, `@typescript-eslint`)
- **[PokéAPI](https://pokeapi.co/):** Fonte de dados oficial

---
---

##  Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/Celsocag/ionic-pokedex.git
   cd ionic-pokedex
   ```

2. Instale as dependências:
   ```sh
   npm install
   ```



---

##  Como rodar

```sh
ionic serve
```
Acesse [http://localhost:8100](http://localhost:8100) no navegador.

---

##  Testes

Execute os testes unitários:
```sh
npm run test -- --watch=false --browsers=ChromeHeadless
```

---

##  Estrutura do Projeto

```
src/
  app/
    components/           # Componentes reutilizáveis (header, footer, card, filtro)
    favorites/            # Página de favoritos
    pages/
      details/            # Página de detalhes do Pokémon
      home/               # Página inicial (lista de Pokémons)
    services/             # Serviços de negócio (Pokémon, favoritos, filtro)
    models/               # Modelos de dados (Pokemon)
  assets/                 # Imagens e SVGs
  environments/           # Configurações de ambiente
  theme/                  # Variáveis de tema SCSS
  global.scss             # Estilos globais
  index.html              # HTML principal
```

---

##  Decisões Técnicas


### Metodologias e Boas Práticas de Código

- **DRY:** Lógica reutilizável centralizada em services, sem duplicação visível.

- **KISS:** Código simples, direto e fácil de entender.

- **TypeScript Estrito:** O projeto está com `strict: true` no `tsconfig.json` e outras flags de segurança ativadas.

- **Tipagem:** O modelo principal (`Pokemon`) é uma interface, garantindo tipagem forte e alinhamento com as melhores práticas TypeScript.

- **Convenções Angular:** Nomenclatura e estrutura de arquivos seguem o padrão Angular.

- **trackBy:** Utilizado em todas as listas relevantes para performance.



### Performance e Acessibilidade

- **Lazy Loading:** Páginas principais usam lazy loading via router modules.

- **Carregamento Infinito:** Infinite scroll para evitar carregamento excessivo.

- **Lazy Loading de Imagens:** Imagens carregadas sob demanda.

- **Preconnect:** Otimização de requisições à PokéAPI.

- **Acessibilidade:** Uso de alt, aria-label, contraste e navegação por teclado.



---

## Contribuição

Pull requests são bem-vindos! Sinta-se à vontade para abrir issues ou sugerir melhorias.
