CREATE OR REPLACE VIEW amis_all_datasources AS (
  SELECT
    database,
    database     AS modified_by,
    region_code,
    region_name,
    product_code,
    product_name,
    element_code,
    element_name,
    units,
    year,
    year_label,
    month,
    value,
    flag,
    value_type,
    month_position,
    current_date AS last_update
  FROM AMIS_DATA_6901f4dc
  UNION ALL SELECT
              d.database,
              d.modified_by,
              d.region_code,
              d.region_name,
              d.product_code,
              d.product_name,
              d.element_code,
              d.element_name,
              d.units,
              d.year,
              d.year_label,
              d.month,
              d.value,
              d.flag,
              d.value_type,
              d.month_position,
              d.last_update
            FROM  amis_table_test d);





-- Function: update_view_amis_all_datasources()

-- DROP FUNCTION update_view_amis_all_datasources();

CREATE OR REPLACE FUNCTION update_view_amis_all_datasources()
  RETURNS void AS
  $BODY$
declare
	tablename text;
	sql text;
	sql2 text;
BEGIN

sql =  'select tablename from customdataset where code = ''AMIS''';
execute sql into tablename;

  sql2 = 'CREATE OR REPLACE VIEW amis_all_datasources AS (
  SELECT
    database,
    database     AS modified_by,
    region_code,
    region_name,
    product_code,
    product_name,
    element_code,
    element_name,
    units,
    year,
    year_label,
    month,
    value,
    flag,
    value_type,
    month_position,
    current_date AS last_update
  FROM '|| tablename || '
  UNION ALL SELECT
              d.database,
              d.modified_by,
              d.region_code,
              d.region_name,
              d.product_code,
              d.product_name,
              d.element_code,
              d.element_name,
              d.units,
              d.year,
              d.year_label,
              d.month,
              d.value,
              d.flag,
              d.value_type,
              d.month_position,
              d.last_update
            FROM  amis_table_test d)';
execute sql2 ;

END;
$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;
ALTER FUNCTION update_view_amis_all_datasources()
OWNER TO fenix;


UPDATE customdataset SET tablename = 'AMIS_POPULATION_NATIONAL_ff233b4f' where code = 'AMIS_POPULATION_NATIONAL';
