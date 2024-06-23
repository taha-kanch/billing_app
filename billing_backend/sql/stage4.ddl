create table at_user
(
code integer primary key,
username char(150) not null unique,
password char(150) not null
);

-----Create a sequence------------
CREATE SEQUENCE at_user_code_seq START WITH 1 NOCACHE ORDER;

CREATE OR REPLACE TRIGGER at_user_code_trg BEFORE
    INSERT ON at_user
    FOR EACH ROW
    WHEN ( new.code IS NULL )
BEGIN
    :new.code := at_user_code_seq.nextval;
END;
/

-----------------------------------------------------------