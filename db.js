var db;
const funcdb = ()=>{
    db = new Dexie("db_sistema");
    db.version(1).stores({
        materias:'idmateria,codigo,nombre',
        inscripciones:'idProducto,codigo,nombre,marca,modalidad'
      });
};
funcdb();