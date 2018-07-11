//Paquete necesario para conectar con el OpenLDAP y hacer peticiones
var ldap = require('ldapjs');

//usuario
var username = 'andresito@gmail.com';
//contraseña
var password = 'andres'
// creacion de conexion con OpenLDAP
var client = ldap.createClient({
    url: 'ldap://127.0.0.1:389'
});
//Filtro para encontrar el dn,sn,cn,'userPassword' por medio del mail
var opts = {
  filter: '(mail= ' + username+ ')',
  scope: 'sub',
  paged: true,
  sizeLimit: 200,
  attributes: ['dn', 'sn', 'cn', 'userPassword']  
};
//Busqueda del dn 
client.search('dc=example,dc=com', opts, function(err, res) {
  res.on('searchEntry', function(entry) {
    //Almacenamiento del dn, para tener todo el objeto json: entry.object sin el .dn
    var dnObtained = entry.object.dn;
    //Autentificación en base al dn obtenido y password isertado por usuario 
    client.bind(dnObtained,password , function(err, res) {
        if(err){
            return console.log('ERROR! ' + password);
        }
        else {
            return console.log('INGRESO CORRECTO');
        } 
    });
  });
});

//Probar el script ejecutando desde el terminal: node ldapLogin.js pero primero
//Inicializamos el demonio con: sudo /usr/local/libexec/slapd 
//revisar conexion con: ps aux | grep '[s]lapd' en el puerto establecido

//En caso de querer OTRO TIPO DE CIFRADO como el sha256 se podria uilizar en node.js:
//1) var sha256 = require('sha256');                           --ó
//2) var passwordhasher = require('password-hasher');          --sudo npm install password-hasher   
// en el segundo caso un ejemplo se:
//var hash = passwordhasher.createHash('ssha', 'andres', new Buffer.from('83d88386463f0625', 'hex'));
//var password = passwordhasher.formatRFC2307(hash); disponible en https://github.com/idauth/password-hasher
// Y en postgres:
//CREATE EXTENSION pgcrypto;                                    --Se crea primero extensión en la base de datos que se va a encriptar
//SELECT ENCODE(DIGEST('AnveshPassword','sha256'),'hex');
//SELECT ENCODE(HMAC('AnveshPassword','mykey','sha256'),'hex');
//Trabajando como si fuera texto plano y comparando con los HASH en el formato que queramos


