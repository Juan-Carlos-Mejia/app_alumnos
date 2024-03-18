<?php
include('../../Config/Config.php');
extract($_REQUEST);

$alumnos = isset($alumnos) ? $alumnos : '[]';
$accion=$accion ?? '';
$class_alumnos = new alumnos($conexion);
print_r( json_encode($class_alumnos->recibir_datos($alumnos)) );

class alumnos{
    private $datos=[], $db, $respuesta = ['msg'=>'ok'];
    public function __construct($db){
        $this->db = $db;
    }
    public function recibir_datos($alumnos){
        global $accion;
        if($accion==='consultar'){
            return $this->administrar_alumnos();
        }else{
            $this->datos = json_decode($alumnos, true);
            return $this->validar_datos();
        }
    }
    private function validar_datos(){
        if( empty($this->datos['idalumo']) ){
            $this->respuesta['msg'] = 'Por error no se pudo seleccionar la ID';
        }
        if( empty($this->datos['codigo']) ){
            $this->respuesta['msg'] = 'Por favor ingrese el codigo de la materia';
        }
        if( empty($this->datos['nombre']) ){
            $this->respuesta['msg'] = 'Por favor ingrese el nombre de la materia';
        }
        if( empty($this->datos['direccion']) ){
            $this->respuesta['msg'] = 'Por favor ingrese el nombre de la materia';
        }
        if( empty($this->datos['telefono']) ){
            $this->respuesta['msg'] = 'Por favor ingrese el nombre de la materia';
        }
        if( empty($this->datos['email']) ){
            $this->respuesta['msg'] = 'Por favor ingrese el nombre de la materia';
        }
        return $this->administrar_alumnos();
    }
    private function administrar_alumnos(){
        global $accion;
        if( $this->respuesta['msg'] === 'ok' ){
            if( $accion==='nuevo' ){
                return $this->db->consultas('INSERT INTO alumnos VALUES(?,?,?)',
                $this->datos['idalumno'],$this->datos['codigo'],$this->datos['nombre'],$this->datos['direccion'],$this->datos['telefono'],$this->datos['email']);
            }else if($accion==='modificar' ){
                return $this->db->consultas('UPDATE alumnos SET codigo=?, nombre=?, direccion=?, telefono=?, email=? WHERE idmateria=?',
                $this->datos['codigo'],$this->datos['nombre'],$this->datos['direccion'],$this->datos['telefono'],$this->datos['email'], $this->datos['idmateria']);
            }else if($accion==='eliminar'){
                return $this->db->consultas('DELETE alumnos FROM alumnos WHERE idalumno=?',
                $this->datos['idalumno']);
            }else if($accion==='consultar'){
                $this->db->consultas('SELECT * FROM alumnos');
                return $this->db->obtener_datos();
            }
        }else{
            return $this->respuesta;
        }
    }
}
?>