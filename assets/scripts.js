// On attends que tout les éléments du DOM soit chargés avant d'éxecuter la fonction
$(document).ready(function() {
    // On séléctionne l'élément correspondant donc ici la galerie de photo pour lui affecté le plugin mauGallery
    $('.gallery').mauGallery({
        // On renseigne le nombre de colonne en options du plugin permettant ainsi de rendre cette dernière responsive ( xs : trés petit par exemple )
        columns: {
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 3
        },
        // Autres options tel que lightBox pour afficher les images séléctionné en superposition agrandie, désignation de la lightbox avec un id pour la différencier 
        // des autres instances lightbox, affichage ou non des tags (ici oui) et positionnement de ces derniers par rapport à la galerie ( ici en haut)
        // Redondance ici du paramètre d'options lightBox vu qu'il est déja définir sur true par défault avant la merge >> aucune incidence sur le code.
        lightBox: true,
        lightboxId: 'myAwesomeLightbox',
        showTags: true,
        tagsPosition: 'top'
    });
});
