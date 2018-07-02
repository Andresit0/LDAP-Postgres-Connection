# LDAP-Postgres-Connection
Conección entre LDAP, Postgres, Node.js y Apache Directory Studio por medio de ODBC. Con ejemplo de creación de grupo y subgrupos y autentificación con Node.js

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

pegar la información del archivo odbcinst.ini adjunto






