var fs = require('fs');

module.exports={
    getAll: (req, res, next) =>{
        
        var coleccion = req.params.coleccion;
        var img = req.params.img;

        var path = `./uploads/${coleccion}/${img}`;

        fs.exists(path, existe => {
            
            if (!existe) {
                path = './assets/no-img.png';
            }

            res.sendfile(path);
        });

    }
}