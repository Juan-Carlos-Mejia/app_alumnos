Vue.component('componente-alumnos', {
    data() {
        return {
            valor:'',
            alumnos:[],
            accion:'nuevo',
            alumno:{
                idalumno: new Date().getTime(),
                codigo:'',
                nombre:'',
                direccion:'',
                telefono:'',
                email:''
            }
        }
    },
    methods:{
        buscaralumno(e){
            this.listar();
        },
        eliminaralumno(idalumno){
            if( confirm(`Esta seguro de elimina el materia?`) ){
                this.accion='eliminar';
                await db.alumnos.where("idmateria").equals(idmateria).delete();
                let respuesta = await fetch(`private/modulos/alumnos/alumnos.php?accion=eliminar&alumnos=${JSON.stringify(this.alumno)}`),
                    data = await respuesta.json();
                this.nuevoalumno();
                this.listar();
            }
        },
        modificaralumno(alumno){
            this.accion = 'modificar';
            this.alumno = alumno;
        },
        guardaralumno(){
            await db.alumnos.bulkPut([{...this.alumno}]);
            let respuesta = await fetch(`private/modulos/alumnos/alumnos.php?accion=${this.accion}&alumnos=${JSON.stringify(this.alumno)}`),
                data = await respuesta.json();
            this.nuevoalumno();
            this.listar();
        },
        nuevoalumno(){
            this.accion = 'nuevo';
            this.alumno = {
                idalumno: new Date().getTime(),
                codigo:'',
                nombre:'',
                direccion:'',
                telefono:'',
                email:''
            }
        },
        listar(){
            let collections = db.alumnos.orderBy('codigo')
            .filter(alumno=>alumno.codigo.includes(this.valor) ||
                alumno.nombre.toLowerCase().includes(this.valor.toLowerCase()) ||
                alumno.direccion.toLowerCase().includes(this.valor.toLowerCase()) ||
                alumno.telefono.toLowerCase().includes(this.valor.toLowerCase()) ||
                alumno.email.toLowerCase().includes(this.valor.toLowerCase()));
            this.alumno = await collections.toArray();
            if( this.alumnos.length<=0 ){
                let respuesta = await fetch('private/modulos/alumnos/alumnos.php?accion=consultar'),
                    data = await respuesta.json();
                this.alumnos = data;
                db.alumnos.bulkPut(data);
            }
        }
    },
    template: `
        <div class="row">
            <div class="col col-md-6">
                <div class="card text-bg-dark">
                    <div class="card-header">REGISTRO DE alumnoS</div>
                    <div class="catd-body">
                        <div class="row p-1">
                            <div class="col col-md-2">CODIGO</div>
                            <div class="col col-md-3">
                                <input v-model="alumno.codigo" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">NOMBRE</div>
                            <div class="col col-md-5">
                                <input v-model="alumno.nombre" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">DIRECCION</div>
                            <div class="col col-md-3">
                                <input v-model="alumno.direccion" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">TELEFONO</div>
                            <div class="col col-md-3">
                                <input v-model="alumno.telefono" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">EMAIL</div>
                            <div class="col col-md-3">
                                <input v-model="alumno.email" type="email" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col">
                                <button @click.prevent.default="guardaralumno" class="btn btn-success">GUARDAR</button>
                                <button @click.prevent.default="nuevoalumno" class="btn btn-warning">NUEVO</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col col-md-6">
                <div class="card text-bg-dark">
                    <div class="card-header">LISTADO DE alumnoS</div>
                    <div class="card-body">
                        <form id="frmalumno">
                            <table class="table table-dark table-hover">
                                <thead>
                                    <tr>
                                        <th>BUSCAR</th>
                                        <th colspan="5">
                                            <input placeholder="codigo, nombre, direccion, telefono, email" type="search" v-model="valor" @keyup="buscaralumno" class="form-control">
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>CODIGO</th>
                                        <th>NOMBRE</th>
                                        <th>DIRECCION</th>
                                        <th>TELEFONO</th>
                                        <th>EMAIL</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr @click="modificaralumno(alumno)" v-for="alumno in alumnos" :key="alumno.idalumno">
                                        <td>{{alumno.codigo}}</td>
                                        <td>{{alumno.nombre}}</td>
                                        <td>{{alumno.direccion}}</td>
                                        <td>{{alumno.telefono}}</td>
                                        <td>{{alumno.email}}</td>
                                        <td><button @click.prevent.default="eliminaralumno(alumno.idalumno)" class="btn btn-danger">del</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
});