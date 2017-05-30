var app = {
  inicio: function() {
    this.iniciaFastClick();
    this.iniciaBotones();
  },

  iniciaFastClick: function () {
    FastClick.attach(document.body);
  },

  iniciaBotones: function() {
    var buttonAction = document.querySelector('#button-action');
    buttonAction.addEventListener('click', function(){
      app.cargarFoto(Camera.PictureSourceType.CAMERA);  /* para elegir una foto hecha con la cámara, después elegiremos de la galería   */
    });

    var filterButtons = document.querySelectorAll('.button-filter');  /* seleccionamos todos los botones para aplicar los filtros con cada uno */
    filterButtons[0].addEventListener('click', function(){          /* con los escuchadores recogemos la info de pixeles etc almacenada en el canvas   */
      app.aplicaFiltro('gray');
    });
    filterButtons[1].addEventListener('click', function(){
      app.aplicaFiltro('negative');
    });
    filterButtons[2].addEventListener('click', function(){
      app.aplicaFiltro('sepia');
    });

    var buttonGallery = document.querySelector('#button-gallery');
    buttonGallery.addEventListener('click', function(){
      app.cargarFoto(Camera.PictureSourceType.PHOTOLIBRARY);
    });
  },

  cargarFoto: function(pictureSourceType){
    var opciones = {
      quality: 50,
      sourceType: pictureSourceType,
      destinationType: Camera.DestinationType.FILE_URI,
      targetWidth: 300,
      targetHeight: 300,
      correctOrientation: true
    };
    navigator.camera.getPicture(app.fotoCargada, app.errorAlCargarFoto, opciones);
  },

  fotoCargada: function(imageURI) {
    var img = document.createElement('img');
    img.onload = function(){     /* la función 'onload' espera hasta que la foto ha terminado de cargarse para transmitirla */
      app.pintarFoto(img);      /* cuando la carga es completa "pintamos la foto"  */
    }
    img.src = imageURI;  /* asignamos a la imagen la URL, la direccion en el movil donde se ha guardado la foto */
  },

  pintarFoto: function(img) {
    var canvas = document.querySelector('#foto');   
    var context = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0, img.width, img.height);
  },

  errorAlCargarFoto: function(message) {
    console.log('Fallo al tomar foto o toma cancelada: ' + message);
  },

  aplicaFiltro: function(filterName) {
    var canvas = document.querySelector('#foto');   /* con queryselector' accedemos a la info q está en el canvas sobre la foto  */
    var context = canvas.getContext('2d');
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);    /* con getImageData' obtenemos la info sobre los pixeles  */

    effects[filterName](imageData.data);  /*llamando a la función 'effects' aplicamos el filtro concreto sobre ell objeto 'imagedata'  */

    context.putImageData(imageData, 0, 0);    /* con esto volvemos a pintar en el canvas la imagen resultante (filtrada)   */
  }
};

var imageData;
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    app.inicio();
  }, false);
}
