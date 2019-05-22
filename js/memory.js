// TODO : Transformer les propriétés $clickedCardOne et $clickedCardTwo en array clicked = [one=> '',two => ''] et dans showPicture, entrer dans les condition si !empty(clicked[one]) !empty(clicked[two]) (en prenant en compte le dataset numbers)

var app = {
  wrapper: document.querySelector('.wrapper'),
  board: document.querySelector('.board'),
  title: document.createElement('h1'),
  rules: document.createElement('p'),
  blocTime: document.querySelector('.bloc-time'),
  time: document.createElement('div'),
  startTimer: null,
  position: 750,
  $allCards: [],
  $clickedCardOne: null,
  $clickedCardTwo: null,
  click: 0,
  win: 0,

  init: function() {
    // Affichage du titre + règles sur le board
    app.presentation();

    // Boutton jouer
    var $button = document.createElement('div');
    $button.className = 'play';
    $button.innerHTML = 'Jouer';
    $button.addEventListener('click', app.launchGame);
    app.wrapper.appendChild($button);
  },

  presentation: function() {
    app.board.classList.add('rules');
    app.title.className = 'title';
    app.title.innerHTML = 'Le Memory de l\'espace';
    app.board.appendChild(app.title);
    app.rules.className = 'text';
    app.rules.innerHTML = 'Règles :<br/> Cliquez sur deux cartes pour les retourner. <br/> Si elles sont différentes vous avez 1 seconde pour les mémoriser.<br/> Si elles sont identiques, elles sont retiré du jeu. <br/><br/> Attention !<br/> Vous avez une minute pour retrouver les 14 paires de cartes mélangées sur le plateau.<br/> La barre bleu symbolise le temps qu\'il vous reste... <br/><br/> Appuyez sur Jouer pour lancer la partie.';
    app.board.appendChild(app.rules);
  },

  launchGame: function(evt) {
    // Nettoyage du plateau (supression boutton jouer + titre + règle)
    app.cleanBoard(evt.target);

    // préparation du timer
    app.time.className = 'time';
    app.blocTime.appendChild(app.time);
    // début du chrono
    app.startTimer = setInterval(app.chrono, 100);

    // je créer les cartes
    app.createCard();
    // je leur assigne un sprite
    app.assignBackground();
    // je mélange le tableau
    app.shuffle(app.$allCards);
    // puis j'ajoute chaque éléments de mon tableau dans le board
    app.placeOnBoard();
  },

  cleanBoard: function(buttonPlay) {
    app.wrapper.removeChild(buttonPlay);
    app.board.classList.remove('rules');
    app.board.removeChild(app.title);
    app.board.removeChild(app.rules);
  },

  chrono: function() {
    app.position--;
    app.time.style.width = app.position + 'px';
    if (app.position <= 0) {
      clearInterval(app.startTimer);
      alert('Temps écoulé vous avez perdu !');
      app.reset();
    }
  },

  createCard: function() {
    for (var cardNbr = 0; cardNbr < 28; cardNbr++) {
      // je créer une div et je l'ajoute à mon tableau allCards
      app.$allCards[cardNbr] = document.createElement('div');
      // je lui ajoute une classe card
      app.$allCards[cardNbr].classList.add('card');
      // et une classe hidden
      app.$allCards[cardNbr].classList.add('hidden');
      // un dataset contenant le numéro de la carte
      app.$allCards[cardNbr].dataset.number = cardNbr;
    }
  },

  assignBackground: function() {
    var pair = 0;
    var bkgPosition;

    for (var cardNbr = 0; cardNbr < app.$allCards.length; cardNbr++, pair++) {
      bkgPosition = pair * 100;
      app.$allCards[cardNbr].style.backgroundPosition = '0px -' + bkgPosition + 'px';
      app.$allCards[cardNbr].dataset.pair = pair;
      cardNbr++;
      app.$allCards[cardNbr].style.backgroundPosition = '0px -' + bkgPosition + 'px';
      app.$allCards[cardNbr].dataset.pair = pair;
    }
  },

  shuffle: function(a) {
    var j, x, i;
    for (i = a.length - 2; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
  },

  placeOnBoard: function() {
    for (var cardNbr = 0; cardNbr < app.$allCards.length; cardNbr++) {
      // Je place chaque div présente dans l'array comme nouvel enfant dans le board
      app.board.appendChild(app.$allCards[cardNbr]);
      // et lui assigne un évènement qui s'active à chaque click
      app.$allCards[cardNbr].addEventListener('click', app.showPicture);
    }
  },

  showPicture: function($evt) {
    // j'incrémente click
    app.click++;
    // si c'est la première carte retourné
    if (app.click === 1) {
      // je récupère l'élément
      app.$clickedCardOne = $evt.target;
      // je change la classe pour afficher la carte
      app.$clickedCardOne.classList.replace('hidden', 'visible');
    }
    // sinon si c'est la deuxième carte retournée
    else if (app.click === 2) {
      // je récupère l'élément
      app.$clickedCardTwo = $evt.target;
      // je change la classe pour afficher la carte
      app.$clickedCardTwo.classList.replace('hidden', 'visible');
      // si l'utilisateur n'a pas cliqué deux fois sur la même carte :
      if (app.$clickedCardOne.dataset.number !== app.$clickedCardTwo.dataset.number) {
        // si leur backgrounds sont différents
        if (app.$clickedCardOne.dataset.pair !== app.$clickedCardTwo.dataset.pair) {
          // je cache les carte après 1 secondes
          window.setTimeout(app.hidePicture, 1000);
        }
        // sinon elles sont identiques
        else {
          window.setTimeout(app.isFind, 500);
          app.win++;
          console.log(app.win);
          // si elles on été identiques 14 fois alors toutes les paires on été trouvé
          if (app.win >= 14) {
            clearInterval(app.startTimer);
            window.setTimeout(function() {
              alert('Félicitation ! Vous avez trouvé toutes les paires');
            }, 1000);
            app.reset();
          }
        }
      }
      // si l'utilisateur à cliqué deux fois sur la même carte on décrémente click pour pouvoir dévoiler une autre carte
      else {
        app.click--;
      }
    }
  },

  isFind: function() {
    app.click = 0;
    if (app.$clickedCardOne != null && app.$clickedCardTwo != null) {
      app.$clickedCardOne.classList.replace('visible', 'find');
      app.$clickedCardOne.removeEventListener('click', app.showPicture, false);
      app.$clickedCardOne = null;
      app.$clickedCardTwo.classList.replace('visible', 'find');
      app.$clickedCardTwo.removeEventListener('click', app.showPicture, false);
      app.$clickedCardTwo = null;
    }
  },

  hidePicture: function() {
    // si les variables ne sont pas null ( vérification pour éviter une erreur en fin de partie au cas ou le timeout se déclancherais après que le tableau est été vidé)
    if (app.$clickedCardOne != null && app.$clickedCardTwo != null) {
      // je change à nouveau la classe pour cacher les carte
      app.$clickedCardOne.classList.replace('visible', 'hidden');
      app.$clickedCardTwo.classList.replace('visible', 'hidden');
    }
    // je remet click à 0 pour indiquer que les deux cartes on bien été caché et ainsi pouvoir entrer dans les if à nouveau
    app.click = 0;
    app.$clickedCardOne = null;
    app.$clickedCardTwo = null;
  },

  reset: function() {
    // remise à 0 des valeurs
    app.startTimer = null;
    app.position = 1000;
    app.$clickedCardOne = null;
    app.$clickedCardTwo = null;
    app.click = 0;
    app.win = 0;

    // supression du chrono
    app.blocTime.removeChild(app.time);

    // suppression de toutes les cartes
    for (var index in app.$allCards) {
      app.board.removeChild(app.$allCards[index]);
    }

    // retour à la case départ (board vide)
    app.init();
  }
};
document.addEventListener('DOMContentLoaded', app.init);
