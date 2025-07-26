# ♻️ EcoSaveWorld – Plataforma Inteligente de Coleta Sustentável

**EcoSaveWorld** é uma aplicação web desenvolvida como Projeto Integrador dos módulos I e II do Curso Técnico em Informática. A plataforma tem como objetivo modernizar e otimizar o processo de agendamento e execução da coleta de resíduos sólidos, promovendo sustentabilidade ambiental, eficiência operacional e maior integração entre a população e entidades públicas ou privadas atuantes na área de gestão de resíduos.

## 🧩 Contextualização do Problema

Diversos municípios do Estado do Rio Grande do Sul enfrentam desafios relacionados à:

- **Inconsistência nos horários de coleta de resíduos sólidos**
- **Falta de engajamento da população no descarte correto**
- **Desorganização no fluxo de informação entre usuários e agentes ambientais**

Esses fatores contribuem para impactos ambientais, problemas de saúde pública e prejuízos à infraestrutura urbana.

## 🎯 Objetivo Geral

Desenvolver uma solução tecnológica que:

- Facilite o **agendamento inteligente de coletas** de resíduos.
- Implemente a **visualização geográfica de rotas** para motoristas.
- Promova a **educação e conscientização ambiental** da população.
- Estimule a **colaboração entre cidadãos, cooperativas e órgãos públicos**.

## 👥 Público-Alvo

- **Prefeituras e órgãos públicos ambientais**
- **ONGs e cooperativas de reciclagem**
- **Cidadãos residentes nos municípios atendidos**
- **Instituições educacionais e sociais com foco sustentável**

## 🛠️ Tecnologias Utilizadas

| Camada         | Tecnologias                                                |
|----------------|------------------------------------------------------------|
| Front-end      | HTML5, CSS3, JavaScript (ES6)                              |
| Back-end       | PHP 7+, API REST                                           |
| Banco de Dados | MySQL                                                      |
| Mapas e Rotas  | [Leaflet.js](https://leafletjs.com), OpenStreetMap         |
| Geolocalização | API de Navegador, Nominatim                                |
| CEP            | [ViaCEP](https://viacep.com.br)                            |
| Hospedagem     | GitHub Pages (interface), XAMPP/Laragon (servidor local)   |

## ✅ Funcionalidades Implementadas

### Funcionais

- 🔐 Autenticação de usuários com validação de acesso.
- 👥 Cadastro de usuários e motoristas (restrito, por segurança).
- 🔒 Perfis com permissões distintas: administrador, motorista, usuário comum.
- 📅 Agendamento de coletas com controle de data, hora e endereço.
- 📦 Visualização do status das coletas.
- 🧑‍💼 Página institucional com informações da equipe e objetivos do projeto.
- 📱 Interface responsiva e compatível com dispositivos móveis.

### Não Funcionais

- Armazenamento seguro de dados sensíveis.
- Disponibilidade em ambiente local e remoto.
- Projeto escalável para múltiplas rotas simultâneas.
- Interface adaptada para diferentes resoluções de tela.

## 🌐 Funcionalidades Avançadas (Implementadas e em Desenvolvimento)

### 🗺️ Módulo de Geolocalização e Mapas

- ✔️ Exibição de localização do usuário utilizando GPS do navegador.
- ✔️ Visualização de pontos e rotas no mapa via Leaflet.js + OpenStreetMap.
- ❗ Traçado automático de rotas até o endereço informado no input.
- ❗ Sugestão de rota otimizada com base na distância e tempo estimado.
- ❗ Exibição da posição e caminho do motorista em tempo real (fase experimental).

### 🧭 Preenchimento Automático de Endereço

- ✔️ Consulta de CEP por meio da API pública [ViaCEP](https://viacep.com.br).
- ❗ Preenchimento automático de logradouro, bairro, cidade e estado.

## 📂 Estrutura do Projeto

EcoSaveWorld/
├── index.html
├── login.html
├── agendamento.html
├── rota.html
├── scripts/
│   ├── mapa.js
│   ├── consulta-cep.js
├── styles/
│   ├── estilo.css
│   └── responsivo.css
├── backend/
│   └── api.php
└── README.md

## 📂 Como Executar o Projeto Localmente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/EcoSaveWorld.git

# Acesse o diretório
cd EcoSaveWorld

# Inicie o servidor local (ex: XAMPP ou Laragon)
# Coloque os arquivos na pasta 'htdocs' do XAMPP

# Acesse no navegador
http://localhost/EcoSaveWorld/
```

## 🌐 Acesso Online

Uma versão de testes pode ser acessada aqui:  
👉 [https://joaogabrielguimaraes.github.io/teste_projeto/](https://joaogabrielguimaraes.github.io/teste_projeto/)

## 📄 Autores

- **João Gabriel Guimarães**
- **Guilherme dos Passos Persch**

Projeto Integrador I e II - Curso Técnico em Informática  
Turma: INB2  

---

> “Transformar o lixo em solução é responsabilidade de todos. EcoSaveWorld conecta você à mudança.”
