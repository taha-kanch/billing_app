CREATE TABLE at_uom
(
code INT PRIMARY KEY,
name char(5) not null unique
);

-----Create a sequence------------
CREATE SEQUENCE at_uom_code_seq START WITH 1 NOCACHE ORDER;


CREATE OR REPLACE TRIGGER at_uom_code_trg BEFORE
    INSERT ON at_uom
    FOR EACH ROW
    WHEN ( new.code IS NULL )
BEGIN
    :new.code := at_uom_code_seq.nextval;
END;
/