/*  Création d'une fonction qui prends $ en paramètre, la fonction s'auto-appelle pour s'assurer que le code à l'interieur à la mention de $ on fait bien référence
  à jQuery, si d'autres bibliothèques venait à utiliser ou modifier la valeur de $ cela n'aurait donc pas d'influence sur notre code jQuery.
  C'est ce qui est appelé une IIFE - Immediatly Invoked Function Expression */
(function($) {
  /* fn ici est un raccourd de $.prototype est il est utilisé pour ajoutés des plugins/méthodes à Jquery : ici ca sera mauGallery. Je rappelle que cette méthode à été 
  définit dans script.js tout comme le paramètre options. Ici les variables seront locales à la fonction tandis que la méthode mauGallery sera globale  et  utilisable 
  partout ou jQuery est chargé à partir du moment ou il est importé côté HTML*/
  $.fn.mauGallery = function(options) {
    // Ici grâce à la méthode extend(), on récupère les options définit sous script.js et on les combinent(merge) avec les options par défault que possède mauGallery,
    var options = $.extend($.fn.mauGallery.defaults, options);
    // Initialisaiton d'une variable sous forme de tableaux déstinés à contenir la collection d'étiquette
    var tagsCollection = [];
    // pour chaque élément de l'objet JQuery mauGallery on applique une fonction 
    return this.each(function() {
      // Appelle de la méthode creatRowWrapper avec en paramètre la div gallery
      $.fn.mauGallery.methods.createRowWrapper($(this));
      // si l'option modale est sur true (c'est le cas), on appelle la méthode createLightBox sur la div gallery avec le nom de l'id lightbox et le type de navigation en param
      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $(this),
          options.lightboxId,
          options.navigation
        );
      }
      // On initialise les méthodes de listeners 
      $.fn.mauGallery.listeners(options);

      // Ici on viens dire qu'on veut itilinaliser différentes méthodes et ce pour chaque image qui font partie de la div gallery en tant qu'enfant
      $(this)
        .children(".gallery-item")
        .each(function(index) {
          $.fn.mauGallery.methods.responsiveImageItem($(this));
          $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
          $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);
          // création d'une constance theTag pour contenir la valeur de l'étiquette de l'image séléctionné qui est enregistré en data-gallery-tag
          var theTag = $(this).data("gallery-tag");
          // On ajoute l'ensemble des tags parcourus pour chaque images de la gallerie à notre tableau tagsCollection si un tag est bien présent
          if (
            options.showTags &&
            theTag !== undefined &&
            // Ici indexOf() nous permet d'éviter les doublons pour générer un tableau de valeur unique.
            tagsCollection.indexOf(theTag) === -1
          ) {
            tagsCollection.push(theTag);
          }
        });
      // Grâce à notre code précèdant, on peut maintenant utiliser le tableaux pour appeler la méthode showItemTags et générer les boutons de filtres suivant l'option tagsPosition (en haut ou bas par exemple)
      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags(
          $(this),
          options.tagsPosition,
          tagsCollection
        );
      }
      // Définit l'apparation l'apparition en fondue des éléments de la galerie (les photos) à une demi-seconde.
      $(this).fadeIn(500);
    });
  };
  // On retrouve ici la définition des options de défault de la méthode mauGallery
  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };
  // Méthode de listeners qui applique une fonction au clique sur une photo de la galerie pour appeler la méthode  d'ouverture de la modale et l'affichage de l'image plus grande
  $.fn.mauGallery.listeners = function(options) {
    $(".gallery-item").on("click", function() {
      /* ici prop() permet de récupérer le nom de la balise HTML de la photo, faisant référence à tagName dans le DOM cette valeur sera donc en MAJUSCULE c'est pourquoi 
      on la compare à "IMG" et pas à "img" */
      if (options.lightBox && $(this).prop("tagName") === "IMG") {
        $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
      } else {
        return;
      }
    });
    // Ecoute du click sur les différents filtres pour appeléer ensuite la méthode filterBytag
    $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);
    // Ecoute du click sur les boutons suivant et précèdant pour appeler les méthodes équivalente et le défilemetn d'image, on passe en paramètre l'id de la modale définit dans script.js
    $(".gallery").on("click", ".mg-prev", () =>
      $.fn.mauGallery.methods.prevImage(options.lightboxId)
    );
    $(".gallery").on("click", ".mg-next", () =>
      $.fn.mauGallery.methods.nextImage(options.lightboxId)
    );
  };

  // Définition des différentes méthodes appelé par mauGallery
  $.fn.mauGallery.methods = {
    /* méthode du conteneur en ligne, si on à pas la class "row" sur le premier enfant inclue dans la div gallery on lui ajoute une div avec des classes qui servira de contenueur
    pour la future galerie photo */
    createRowWrapper(element) {
      if (
        !element
          .children()
          .first()
          .hasClass("row")
      ) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },
    /* méthode qui génère les divs conteneur autour des imgs directement, prends en paramètre ici les images et les options de colonne définit dans script.js
    Permet la mise en forme responsive en complément de bootsrap
    Si l'option de colonne est définit en tant que nombre on affecte une div parents aux image en conséquence
    Si l'option de colonne est définit en tant qu'objet (c'est le cas ici) on concatène les différentes classes en fonction des paramètres de taille objet définit et on les ajoutes
    à une div parents autour de l'img sinon on renvoi une erreur*/
    wrapItemInColumn(element, columns) {
      if (columns.constructor === Number) {
        element.wrap(
          `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
        );
      } else if (columns.constructor === Object) {
        var columnClasses = "";
        if (columns.xs) {
          columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
        }
        if (columns.sm) {
          columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
        }
        if (columns.md) {
          columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
        }
        if (columns.lg) {
          columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
        }
        if (columns.xl) {
          columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
        }
        element.wrap(`<div class='item-column mb-4${columnClasses}' style="cursor:pointer;"></div>`);
      } else {
        console.error(
          `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
        );
      }
    },
    // méthode qui permet d'affecter chaque images en présence dans la div gallery-items-row
    moveItemInRowWrapper(element) {
      element.appendTo(".gallery-items-row");
    },
    // méthode qui rajoute la classe img-fluid aux images si il s'agit bien d'image les rendant ainsi responsive grâce à boostrap 
    responsiveImageItem(element) {
      if (element.prop("tagName") === "IMG") {
        element.addClass("img-fluid");
      }
    },
    // méthode permettant d'ouvrir la modale d'img, en lui donnant la source de l'img d'origine de la galerie photo
    openLightBox(element, lightboxId) {
      $(`#${lightboxId}`)
        .find(".lightboxImage")
        .attr("src", element.attr("src"));
      $(`#${lightboxId}`).modal("toggle");
    },
    // méthode qui gère l'affichage de l'image précèdante dans la modale ( à réparer car non fonctionnel )
    prevImage() {
      // Ici on initie une varaible activeImg  qui va venir contenir ensuite l'image active de la modale et son attribut src
      let activeImage = null;
      $("img.gallery-item").each(function() {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });
      // Initialisation d'une variable qui aura le nom de l'étiquette du filtre séléctionné par l'utilisateur pour filtrer la galerie
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      // Initalisation d'une variable imagesCollection sous forme de tableaux vide déstiné à contenir l'ensemble des photos de la galerie suivant le choix utilisateur (tag actif)
      let imagesCollection = [];
      // si le choix utilisateur est "TOUS" on viens mettre l'ensemble des images dans la variable tableau
      if (activeTag === "all") {
        $(".item-column").each(function() {
          if ($(this).children("img").length) {
            imagesCollection.push($(this).children("img"));
          }
        });
        // si le choix utilisateur est un filtre spécifique, on viens push uniquement les images correspondante à l'étiquette en question dans la variable tableau
      } else {
        $(".item-column").each(function() {
          if (
            $(this)
              .children("img")
              .data("gallery-tag") === activeTag
          ) {
            imagesCollection.push($(this).children("img"));
          }
        });
      }
      // Initalisation de deux variables une pour l'index et une pour l'image à afficher tout deux sur 0 et null au départ
      let index = 0,
       next = null;
      /* pour chaque images contenu dans la variable tableau d'image, si la source src de l'image active dans la modale est celle de la source d'image provenant du tableau 
      alors on actualise la variable index à la place d'indéxation du tableau*/
      $(imagesCollection).each(function(i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) {
          index = i ;
        }
      });
      /* on affecte à la variable next, l'image du tableau correpondant à l'index qu'on a enregistré ou bien correpondant à la taille du tableau moins 1, gère le cas ou l'index 
       est hors limite.
       C'est ici que se situe le problème qui empêche la fonctionnalité de marcher en efet on ne récupère que l'index de l'img active ou bien la valeur du tableau totale -1 mais
       on ne fait pas réellement de gestion de décrémentation et l'utilisation du OU permet de rester toujours sur la même image */
      /* On va donc gérer cette décrémentation via un nouvelle index désignant l'image précèdante
        Exemple si index = 0 et N= imagesCollection.length = 2 (2 images) on aura newIndex = (0-1+N)modulo de N 
        soit newIndex = (0-1+2)%2 = 1%2 = 1 et on renvoie bien à la dernière image de tableau */
      let newIndex = (index - 1 + imagesCollection.length) % imagesCollection.length;
      next = imagesCollection[newIndex];
      // enfin on termine en indiquant que la src de l'img de la modale doit être la source de la variable next
      $(".lightboxImage").attr("src", $(next).attr("src"));
    },

    // méthode qui génére l'image suivante dans la modale ( à réparer églament car non fonctionnel)
    nextImage() {
      let activeImage = null;
      $("img.gallery-item").each(function() {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      let imagesCollection = [];
      if (activeTag === "all") {
        $(".item-column").each(function() {
          if ($(this).children("img").length) {
            imagesCollection.push($(this).children("img"));
          }
        });
      } else {
        $(".item-column").each(function() {
          if (
            $(this)
              .children("img")
              .data("gallery-tag") === activeTag
          ) {
            imagesCollection.push($(this).children("img"));
          }
        });
      }
      let index = 0,
        next = null;

      $(imagesCollection).each(function(i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) {
          index = i;
        }
      });
      /* On retrouve ici la même base de code que pour la méthode prevImage seul le code ci-dessous va changer car c'est lui indiquera que on veut afficher l'image suivante 
      mainteant et plus la précèdante; 
      Ici encore une fois le bouton n'est pas fonctionnel car on affecte à next soit la valeur de l'index de l'image actuel soit on lui donne la premier image dans les deux
      cas ce n'est pas ce que l'on désire puisqu'on veut afficher l'image suivante et la première image seulement lorsqu'on se trouve à l'index imagesCollection.length-1 */
      let newIndex = (index + 1 + imagesCollection.length) % imagesCollection.length;
      /* J'aurais pu écrire newIndex = (index + 1) % imagesCollection.length en plus court, car imagesCollection.length entre parenthèses n'est pas nécessaire vu qu'on aura 
      jamais de valeur négatif possible mais je le laisse juste par soucis de cohérence avec le calcul jumeux établit dans le previmage()*/
      next = imagesCollection[newIndex];
      $(".lightboxImage").attr("src", $(next).attr("src"));
    },

    // Création de la modale et affichage image
    createLightBox(gallery, lightboxId, navigation) {
      /* on ajoute à la galerie la div qui servira de modale avec la classe approprié et l'id définit en options si disponible 
         puis on continue en ajoutant l'ensemble du code HTML nécessaire pour strcturer et afficher le contenu, notamment l'image sélectionné
         ainsi que la présence des deux boutons d'avancement ou de retour en arrière*/
      gallery.append(`<div class="modal fade" id="${
        lightboxId ? lightboxId : "galleryLightbox"
      }" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            ${
                              navigation
                                ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                                : '<span style="display:none;" />'
                            }
                            <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique"/>
                            ${
                              navigation
                                ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>'
                                : '<span style="display:none;" />'
                            }
                        </div>
                    </div>
                </div>
            </div>`);
    },

    /* méthode qui permet de gérer les étiquette de filtrage de la galerie photo, en rappel, elle prends en paramètre la gallery, l'endroit ou l'on souhaite placer les 
    étiquettes et le tableau des tags définit sous tagsCollection */
    showItemTags(gallery, position, tags) {
      // on initialise une variable tagItems qui viens prendre un élément de liste <li> configuré en class et en data pour devenir le bouton TOUS
      var tagItems =
        '<li class="nav-item" style="cursor:pointer;"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';
        // ensuite on lui rajout l'ensemble des étiquettes qui serviront à representer les différentes catégories de filtrages
      $.each(tags, function(index, value) {
        tagItems += `<li class="nav-item active" style="cursor:pointer;">
                <span class="nav-link"  data-images-toggle="${value}">${value}</span></li>`;
      });
      // ici on créer la variable tagsRow qui sera une liste désordonné auquels on viens affécté les élements du DOM <li> précèdamment créer
      var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

      // Si la position désigner dans les options est "en-bas" on place la liste sous la galerie photo sinon si elle est "en-haut" on la place au-dessus. On gère également l'erreur dans une position non gérée
      if (position === "bottom") {
        gallery.append(tagsRow);
      } else if (position === "top") {
        gallery.prepend(tagsRow);
      } else {
        console.error(`Unknown tags position: ${position}`);
      }
    },
    /*méthode permettant de filtrer la galerie photo de Nina suivant le tag sélectionné, cette fonction est appelé au click sur une étiquette de filtre  */
    filterByTag() {
      // si l'étiquette séléctionné par l"utilsateur est déjà celle en cours alors ou return , pour cela on véfifie la présence de la classe active-tag
      if ($(this).hasClass("active-tag")) {
        return;
      }
      // si l'étiquette sélectionné est differente de l'actuel, on supprime les class active et active-tag de l'étiquette avant de lui redonner seulement la class active-tag (évite un doublon)
      $(".active-tag").removeClass("active active-tag");
      $(this).addClass("active-tag");

      // on initialise une variable qui va contenir la valeur data de l'étiquette sélectionné donc le nom de la catégorie (concert, entreprise, mariage, portrait ou tous)
      var tag = $(this).data("images-toggle");

      /* on récupère l'élement DOM des imgs de la galerie photo et on viens dans un premier temps masqué l'ensemble des photographie 
      équivalent js de document.querySelectorAll(".gallery-item); puis d'une boucle sur l'ensemble des imgs dans laquelle on dit ensuite let parent = document.querySelector(".item-column);
      et enfin parent.innerHTML="";*/
      $(".gallery-item").each(function() {
        $(this)
          .parents(".item-column")
          .hide();
          // si le tag séléctionné correspond à tous, on génere dynamiquement la galerie avec une transition de 300ms
        if (tag === "all") {
          $(this)
            .parents(".item-column")
            .show(300);
            // si le tag séléctionné à pour valeur data-tag , on génere dynamiquement la galerie avec uniquement les photos qui possède le data-tag correpondant avec une transi de 300ms
        } else if ($(this).data("gallery-tag") === tag) {
          $(this)
            .parents(".item-column")
            .show(300);
        }
      });
    }
  };
})(jQuery);
