-- Observamos que en los esquemas este el mail(todos los existentes en LDAP estan por lo que en caso de querer crear nuevos deberiamos modificar los mismos o mejor crear nuestro propios esquemas)
-- Creamos la tabla en Postgres donde se almacenan los mails
drop table mails;
drop sequence mails_id_seq;
create table mails (
	id serial not null primary key,
	mail varchar(255) not null unique,
	pers_id int not null
);

--Colocamos los diferentes querys que se deben ejecutar tomando en cuenta el id que toca en este caso el 16 ya que en el script "testdb_metadata.sql" llega hasta el 15
insert into ldap_attr_mappings (id,oc_map_id,name,sel_expr,from_tbls,join_where,add_proc,delete_proc,param_order,expect_return) values (16,1,'mail','mails.mail','persons,mails','mails.pers_id=persons.id','SELECT add_mail(?,?)','DELETE FROM mails WHERE mail=? AND pers_id=?',3,0);

--creamos la función que esta siendo invocada en "ldap_attr_mappings" al colocar como parametro de entrada 'SELECT add_mail(?,?)'
create function add_mail (varchar, int) returns int
as '
	select setval (''mails_id_seq'', (select case when max(id) is null then 1 else max(id) end from mails));
	insert into mails (id,mail,pers_id)
		values (nextval(''mails_id_seq''),$1,$2);
	select max(id) from mails
' language 'sql';
