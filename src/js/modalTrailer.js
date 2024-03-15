// modalTrailer.js

import ModalVideo from 'modal-video'; // Importujemy bibliotekę modal-video
import 'modal-video/css/modal-video.min.css'; // Importujemy styl CSS dla modal-video

document.addEventListener('DOMContentLoaded', () => {
  const modal = new ModalVideo('.trailerButton', {
    youtube: {
      controls: 1,
      nocookie: true,
    },
  });

  //   const openTrailerModal = () => {
  //     modal.open();
  //   };

  const trailerButton = document.querySelector('.trailerButton');
  if (trailerButton) {
    trailerButton.addEventListener('click', openTrailerModal);
  }
});
