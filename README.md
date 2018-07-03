# LDAP-Postgres-Connection
Conección entre LDAP, Postgres, Node.js y Apache Directory Studio por medio de ODBC. Con ejemplo de creación de grupo y subgrupos y autentificación con Node.js (Este tutorial ha sido realizado en Linux Mint 18.1 por lo que en ubuntu 16.04 debería correr sin problema). 

Con la finalidad de no tener problemas durante las configuraciones correspondientes o en caso de tener uno de los siguientes errores se recomienda ver los guientes errores que se pueden dar con sus soluciones:
------------------------------------------------------------------------------------

configure: error: C compiler cannot create executables
sudo apt-get install g++

configure: error: readline library not found
If you have readline already installed, see config.log for details on the
failure. It is possible the compiler isn’t looking in the proper directory.
Use –without-readline to disable readline support.

sudo apt-get install libreadline6-dev
------------------------------------------------------------------------------------

configure: error: zlib library not found
If you have zlib already installed, see config.log for details on the
failure. It is possible the compiler isn’t looking in the proper directory.
Use –without-zlib to disable zlib support.

sudo apt-get install zlib1g-dev
------------------------------------------------------------------------------------

checking for CRYPTO new ex data in -lcrypto... no
configure: error: library ’crypto’ is required for OpenSSL

sudo apt-get install libssl-dev
------------------------------------------------------------------------------------

configure: error: libpq library version ¿= 9.2 is required

sudo apt-get install libpq-dev
------------------------------------------------------------------------------------

configure: error: could not locate libtool ltdl.h

sudo apt install libltdl-dev
------------------------------------------------------------------------------------

connections on Unix domain socket ”/tmp/.s.PGSQL.5432”?

Instalar postgres en: /usr/local/pgsql en caso de tenerlo en otro lado revisar el path y luego en el paso posterior donde se inserta en el terminal sudo nano /etc/profile.d/path.sh colocarlo correctamente
------------------------------------------------------------------------------------

createdb: /usr/local/pgsql/lib/libssl.so.1.0.0: no version information available (required by
/usr/local/lib/libldap r-2.4.so.2)

sudo ln -fs /usr/lib/liblber-2.4.so.2 /usr/local/lib/
------------------------------------------------------------------------------------
sudo ln -fs /usr/lib/libldap r-2.4.so.2 /usr/local/lib/
------------------------------------------------------------------------------------

# Configuración e Instalación de ODBC

Para la instalación de unixODBC ejecutar en el terminal:

cd /usr/local/src/
------------------------------------------------------------------------------------
sudo wget http://www.unixodbc.org/unixODBC-2.3.4.tar.gz
------------------------------------------------------------------------------------
sudo tar xzf unixODBC-2.3.4.tar.gz
------------------------------------------------------------------------------------
cd unixODBC-2.3.4/
------------------------------------------------------------------------------------
sudo ./configure
------------------------------------------------------------------------------------
sudo make
------------------------------------------------------------------------------------
sudo make install
------------------------------------------------------------------------------------

Al finalizar la instalación, es necesario agregar el directorio de instalación bin de Postgres (en este caso /usr/local/pgsql/bin) a la variable de entorno PATH, y configurar correctamente la variable de entorno LD LIBRARY PATH. Entonces ejecutar en el terminal 

sudo nano /etc/profile.d/path.sh 
------------------------------------------------------------------------------------

y pegar el contenido del path.sh adjunto (Cambiar el path en caso de que postgres no este instalado en /usr/local/pgsql). Finalmente actualizar el perfil bash ejecutando:

sudo source /etc/profile.d/path.sh
------------------------------------------------------------------------------------

Para la instalación de psqlODBC ejecutar en el terminal:

cd /usr/local/src/
------------------------------------------------------------------------------------
sudo wget https://ftp.postgresql.org/pub/odbc/versions/src/psqlodbc-10.00.0000.tar.gz
------------------------------------------------------------------------------------
sudo tar xzf psqlodbc-10.00.0000.tar.gz
------------------------------------------------------------------------------------
cd psqlodbc-10.00.0000/
------------------------------------------------------------------------------------
sudo ./configure –help
------------------------------------------------------------------------------------
sudo ./configure –with-unixodbc
------------------------------------------------------------------------------------
sudo make
------------------------------------------------------------------------------------
sudo make install
------------------------------------------------------------------------------------

Para configurar ODBC establecer correctamente los valores para el usuario, contraseña (los
cuales deben ser creados en la base de datos Postgres también) y postgres. Para ello ejecutar en el terminal 

sudo nano /usr/local/etc/odbc.ini 
------------------------------------------------------------------------------------

y pegar todo el script que se encuentra en el documento adjunto odbc.ini, el mismo que contiene el username y password de un usuario en la base de datos de postgres. Entonces, para este caso se ha creado en postgres un usuario llamado ldap con password 1234, además de una base de datos denominda pg_ldap que contendra todos los elementos que leerá el OpenLdap.

Resta configurar el driver ODBC “Postgres”: Entonces después de insertar en el terminal

sudo nano /usr/local/etc/odbcinst.ini 
------------------------------------------------------------------------------------

para finalmente pegar la información del archivo odbcinst.ini adjunto.

# Configuración e Instalación de OpenLDAP

Con la finalidad de instalar OpenLDAP ejecutar los siguientes comandos:

cd /usr/local/src/
------------------------------------------------------------------------------------
wget https://ftp.postgresql.org/pub/odbc/versions/src/psqlodbc-10.00.0000.tar.gz
------------------------------------------------------------------------------------
tar xzf psqlodbc-10.00.0000.tar.gz 
------------------------------------------------------------------------------------
cd psqlodbc-10.00.0000/
------------------------------------------------------------------------------------
./configure --help
------------------------------------------------------------------------------------
./configure --with-unixodbc
------------------------------------------------------------------------------------
make
------------------------------------------------------------------------------------
make install
------------------------------------------------------------------------------------

Para configurar OpenLDAP acceder al archivo slapd.conf y poner los datos solicitados como esta en el archivo adjunto. Para ello, primero ejecutar los comandos: 

cd /usr/local/etc/openldap/
------------------------------------------------------------------------------------
sudo cp /usr/local/src/openldap-2.4.45/servers/slapd/back-sql/rdbms depend/pgsql/slapd.conf .
------------------------------------------------------------------------------------
sudo nano slapd.conf
------------------------------------------------------------------------------------

Y realizar las modificaciones a los parámetros database, suffix, rootdn, rootpw, dbname, dbuser, dbpasswd a corde a la configuración del ODBC. Tal como esta el slapd.conf adjunto.

Ir al directorio /usr/local/src/openldap-2.4.45/servers/slapd/back-sql/rdbms_depend/pgsql/ por terminal o GUI y reemplazar los archivos: backsql_create.sql, testdb_create.sql, testdb_metadata.sql por los adjunto en este tutorial. En el último archivo "testdb_metadata.sql" en la linea 56 tiene el directorio raiz "dc=example,dc=com", en caso de haberlo cambiado en las configuraciones del LDAP, modificarlo aqui caso contrario dejar como esta.  

A continuación se debe crear la estructura de base de datos para LDAP. Esta estructura es necesaria para que LDAP funcione con SQL como backend. Para ello ingresar al directorio servers/slapd/back-sql/rdbms_depend/pgsql/ y crear la metadata que se utilizara como backend ejecutando el script SQL backsql_create.sql. Para ello en la terminal ejecutar como usuario postgres lo siguiente (el usuario postgres se crea cuando instala postgres, su clave no es la misma con la que entra a la base de datos, esta debe crearla como cualquier otro usuario de linux colocando en el terminal "passwd postgres"):

cd /usr/local/src/openldap-2.4.45/servers/slapd/back-sql/rdbms_depend/pgsql/
------------------------------------------------------------------------------------
psql -d pg_ldap < backsql_create.sql
------------------------------------------------------------------------------------
psql -d pg_ldap < testdb_create.sql 
------------------------------------------------------------------------------------
psql -d pg_ldap < testdb_metadata.sql
------------------------------------------------------------------------------------

Los errores arrojados por ambos scripts se deben a que intentan eliminar tablas que aún no existen (están pensados para limpiar una instalación preexistente). Simplemente ignorar estos errores y continuar digitando desde el usuario postgres con el fin de dar permisos:

psql -d pg_ldap
------------------------------------------------------------------------------------
grant all on ldap_attr_mappings,ldap_entries,ldap_entry_objclasses,ldap_oc_mappings,referrals,certs to ldap;
------------------------------------------------------------------------------------
grant all on ldap_attr_mappings_id_seq,ldap_entries_id_seq,ldap_oc_mappings_id_seq,referrals_id_seq to ldap;
------------------------------------------------------------------------------------
grant all on authors_docs,documents,institutes,persons,phones to ldap;
------------------------------------------------------------------------------------
grant all on documents_id_seq,institutes_id_seq,persons_id_seq,phones_id_seq to ldap;
------------------------------------------------------------------------------------

Con el fin de determinaar si toda la conexión LDAP-Postgres por medio de ODBC ha sido correcta se puede digitar en una nueva terminal:

1) Para verificar conexion ODBC ejecutar en la terminal:

isql -v PgSQL
------------------------------------------------------------------------------------
select name from persons;
------------------------------------------------------------------------------------

Obteniendo como resultado una tabla vacía, acorde a los datos insertados en postgres a lo que ejecutamos anteriormente: psql -d pg_ldap < backsql_create.sql , psql -d pg_ldap < testdb_create.sql y psql -d pg_ldap < testdb_metadata.sql (por lo que también se debería verificar que se hayan creado tablas en nuestra base de datos "pg_ldap" creada anteriormente)

2) Para la verificación del funcionamiento del servidor LDAP ejecutar en el terminal:

/usr/local/libexec/slapd
------------------------------------------------------------------------------------
ps aux | grep '[s]lapd'
------------------------------------------------------------------------------------

Obteniendo como resultado algo parecido a:

root      3064  0.0  0.7 267528  8032 ?        Ssl  oct31   0:03 /usr/local/libexec/slapd

y al ejecutar:

netstat -tulpn | grep slapd
------------------------------------------------------------------------------------

se obtiene como respuesta el puerto utilizado, que generalmente es el 389 como se muestra a continuación:

tcp        0      0 0.0.0.0:389             0.0.0.0:*               LISTEN      3064/slapd

Para obtener mayor información acercaa de esta conexión se pueden visitar los siguientes links, que me ayudaron a hacer este tutorial sin haber tenido nada de conocimiento:

https://www.linuxito.com/gnu-linux/nivel-alto/977-compilar-e-instalar-openldap-con-postgresql-como-backend

http://www.darold.net/projects/ldap_pg/HOWTO/x178.html

https://github.com/openldap/openldap/tree/master/servers/slapd/back-sql/rdbms_depend/pgsql

# Conexión con Apache Directory Studio (APS)

Descargar el APS de la página 

http://directory.apache.org/studio/
------------------------------------------------------------------------------------

descomprimir y ejecutarlo entrando a la carpeta desde el terminal con "./nombre_del_archivo.sh" en mi caso:

./ApacheDirectoryStudio
------------------------------------------------------------------------------------

en caso de querer crear un acceso de directo del mismo recomiendo copiarlo en el home y utilizar la herramienta "Menu Editor"
de la cual existen muchos tutoriales en el internet para aprender a usarla.

Una vez abierto el mismo se crea la conexión deseada de la siguiente manera:

1) Activar el denomio LDAP para ello ejecutar en el terminal:

sudo /usr/local/libexec/slapd
------------------------------------------------------------------------------------

2) Hacer clic en nueva conexión
![Alt text](abrirConexion.png "imagen descripcion")

![Alt text](abrirConexion.png?raw=true "Title"))

