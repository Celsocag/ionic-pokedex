# Ionic Pokédex

Uma Pokédex responsiva desenvolvida com Ionic + Angular, consumindo a PokéAPI oficial. Permite listar, filtrar, favoritar e visualizar detalhes dos Pokémons, com foco em performance, acessibilidade e experiência mobile/desktop.

---

## 🚀 Visão Geral

- Lista de Pokémons com infinite scroll
  
  ![Home Mobile](src/assets/readme/home_mobile.png)

  ![Home Desktop](src/assets/readme/home_desk.png)

  
- Filtro por tipo
  
  ![Filtro Demo](src/assets/readme/filtro_desk_demo.gif)

  
- Favoritos salvos localmente
  
  ![Favoritos Mobile](src/assets/readme/favoritos_mobile.png)
  
  ![Favoritos Desktop](src/assets/readme/favoritos_desk.png)

  
- Detalhes completos de cada Pokémon
  
  ![Detalhes Desktop](src/assets/readme/detalhes_desktop.gif)

  
- Responsivo para mobile e desktop
  
- Boas práticas de acessibilidade e performance


---

## 📦 Instalação

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

## ▶️ Como rodar

```sh
ionic serve
```
Acesse [http://localhost:8100](http://localhost:8100) no navegador.

---

## 🧪 Testes

Execute os testes unitários:
```sh
npm run test -- --watch=false --browsers=ChromeHeadless
```

---

## 📁 Estrutura do Projeto

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

## 🛠️ Funcionalidades

- **Listagem:** Pokémons paginados, com carregamento infinito.
  
  ![Home Mobile](src/assets/readme/home_mobile.png)
  
  ![Home Desktop](src/assets/readme/home_desk.png)

  
- **Filtro:** Por tipo de Pokémon.
  
  ![Filtro Demo](src/assets/readme/filtro_desk_demo.gif)

  
- **Favoritos:** Adicione/remova Pokémons favoritos (persistência local).
  
  ![Favoritos Mobile](src/assets/readme/favoritos_mobile.png)

  ![Favoritos Desktop](src/assets/readme/favoritos_desk.png)
  
  ![Favoritos Demo Mobile](src/assets/readme/favoritos_mobile_demo.gif.gif)

  
- **Detalhes:** Imagens, tipos, habilidades, descrição, habitat e geração.
  
  ![Detalhes Desktop](src/assets/readme/detalhes_desktop.gif)

  
- **Responsividade:** Layout adaptado para mobile e desktop.
  
- **Acessibilidade:** Uso de alt, aria-label, contraste e navegação por teclado.
  
- **Performance:** Lazy loading de imagens, trackBy em listas, preconnect para APIs.

**Diferencial de UX para mobile:**

![Alerta de Rotação](src/assets/readme/mobile_rotate_warning.gif)



---

## 🔗 API

- [PokéAPI](https://pokeapi.co/): Fonte oficial de dados dos Pokémons.

---

## 👨‍💻 Contribuição

Pull requests são bem-vindos! Sinta-se à vontade para abrir issues ou sugerir melhorias.
