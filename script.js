/* ================================================================
   SCRIPT PRINCIPAL — Casa de Oração
   Responsabilidades:
     1. Header com efeito visual ao rolar a página
     2. Menu hamburguer (mobile)
     3. Destaque do link de navegação ativo por seção
     4. Animação de entrada dos cards via IntersectionObserver
     5. Ano atual no rodapé
   ================================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Referências aos elementos do DOM ---- */
  var header   = document.getElementById('header');
  var menuBtn  = document.getElementById('menuBtn');
  var nav      = document.getElementById('nav');
  var yearEl   = document.getElementById('year');

  /* Todos os links de nav que apontam para âncoras internas (#...) */
  var navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  /* Todas as seções que possuem um id (usadas para detectar qual está visível) */
  var sections = document.querySelectorAll('section[id]');

  /* Cards marcados com data-animate (receberão animação de entrada) */
  var animCards = document.querySelectorAll('[data-animate]');


  /* ================================================================
     1. ANO ATUAL NO RODAPÉ
     Preenche o <span id="year"> com o ano corrente
     ================================================================ */
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* ================================================================
     2. HEADER COM SOMBRA AO ROLAR
     Adiciona a classe 'scrolled' quando o usuário rola a página;
     o CSS usa essa classe para exibir borda e sombra
     ================================================================ */
  function handleScroll() {
    /* Sombra do header */
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    /* Atualiza o link ativo da navegação */
    updateActiveNavLink();
  }

  /* Escuta o evento de scroll com passive:true para melhor performance */
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* Executa uma vez ao carregar para definir o estado inicial */
  handleScroll();


  /* ================================================================
     3. LINK DE NAVEGAÇÃO ATIVO POR SEÇÃO
     Percorre todas as seções e destaca o link cujo id corresponde
     à seção atualmente visível na viewport
     ================================================================ */
  function updateActiveNavLink() {
    /* Offset: considera a altura do header fixo + margem */
    var scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      var top    = section.offsetTop;
      var height = section.offsetHeight;
      var id     = section.getAttribute('id');

      /* Busca o link de nav que aponta para esta seção */
      var link = document.querySelector('.nav-link[href="#' + id + '"]');

      if (link) {
        /* Verifica se a posição de scroll está dentro desta seção */
        if (scrollPos >= top && scrollPos < top + height) {
          /* Remove 'active' de todos os links antes de adicionar */
          navLinks.forEach(function (l) { l.classList.remove('active'); });
          link.classList.add('active');
        }
      }
    });
  }


  /* ================================================================
     4. MENU HAMBURGUER (MOBILE)
     Alterna a classe 'open' no nav e no botão ao clicar
     ================================================================ */
  if (menuBtn) {

    menuBtn.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');

      /* Anima as barras do hamburguer em "X" */
      menuBtn.classList.toggle('open', isOpen);

      /* Atualiza o atributo de acessibilidade */
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    /* Fecha o menu ao clicar em qualquer link (útil no mobile) */
    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* ================================================================
     5. ANIMAÇÃO DE ENTRADA NOS CARDS (IntersectionObserver)
     Adiciona a classe 'visible' quando o card entra na viewport,
     o que dispara a transição de opacidade e posição definida no CSS.
     Cada card entra com um leve atraso escalonado (efeito cascata).
     ================================================================ */
  if ('IntersectionObserver' in window && animCards.length > 0) {

    var cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, index) {
        if (entry.isIntersecting) {

          /* Atraso escalonado: cada card entra 120ms depois do anterior */
          var delay = index * 120;

          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);

          /* Para de observar o card após a animação (não precisa re-animar) */
          cardObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12   /* dispara quando 12% do card está visível */
    });

    /* Registra cada card para ser observado */
    animCards.forEach(function (card) {
      cardObserver.observe(card);
    });

  } else {
    /* Fallback para navegadores sem suporte ao IntersectionObserver:
       mostra todos os cards imediatamente, sem animação */
    animCards.forEach(function (card) {
      card.classList.add('visible');
    });
  }

});
// ======================================================
// CARROSSEL AUTOMÁTICO
// ======================================================

// Seleciona todas as imagens
const imagens = document.querySelectorAll('.carrossel-img');

// Índice da imagem atual
let index = 0;

// Função para mostrar imagem
function mostrarImagem(i) {

    // Remove active de todas
    imagens.forEach(img => {
        img.classList.remove('active');
    });

    // Ativa imagem atual
    imagens[i].classList.add('active');
}

// Próxima imagem
function proximaImagem() {

    index++;

    // Reinicia ao chegar na última
    if(index >= imagens.length) {
        index = 0;
    }

    mostrarImagem(index);
}

// Imagem anterior
function imagemAnterior() {

    index--;

    // Volta para última
    if(index < 0) {
        index = imagens.length - 1;
    }

    mostrarImagem(index);
}

// Clique botão próximo
document.querySelector('.next')
.addEventListener('click', proximaImagem);

// Clique botão anterior
document.querySelector('.prev')
.addEventListener('click', imagemAnterior);

// Troca automática a cada 4 segundos
setInterval(proximaImagem, 5000);