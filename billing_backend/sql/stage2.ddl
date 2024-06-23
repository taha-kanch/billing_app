
--------------------at_invoice------------------
CREATE TABLE at_invoice
(
code INT PRIMARY KEY,
customer_code INT NOT NULL,
total_items INT NOT NULL,
remarks CHAR(150),
total_amt DECIMAL(10, 2) NOT NULL,
invoice_date date default SYSDATE
);

-----Create a sequence------------
CREATE SEQUENCE at_invoice_code_seq START WITH 1 NOCACHE ORDER;

CREATE OR REPLACE TRIGGER at_invoice_code_trg BEFORE
    INSERT ON at_invoice
    FOR EACH ROW
    WHEN ( new.code IS NULL )
BEGIN
    :new.code := at_invoice_code_seq.nextval;
END;
/

-------Foreign key--------
alter table at_invoice
add CONSTRAINT at_invoice_customer_code_fk FOREIGN KEY ( customer_code )
REFERENCES at_customer( code );


--------------------at_invoice_items------------------
CREATE TABLE at_invoice_items 
(
code INT PRIMARY KEY,
description int NOT NULL,
price DECIMAL(10, 2) NOT NULL,
qty INT NOT NULL,
total_amt DECIMAL(10, 2) NOT NULL,
uom_code int NOT NULL,
invoice_number int NOT NULL
);

-----Create a sequence------------
CREATE SEQUENCE at_invoice_items_code_seq START WITH 1 NOCACHE ORDER;


CREATE OR REPLACE TRIGGER at_invoice_items_code_trg BEFORE
    INSERT ON at_invoice_items
    FOR EACH ROW
    WHEN ( new.code IS NULL )
BEGIN
    :new.code := at_invoice_items_code_seq.nextval;
END;
/

-------Foreign key--------
alter table at_invoice_items
add CONSTRAINT at_invoice_items_uom_code_fk FOREIGN KEY ( uom_code )
REFERENCES at_uom( code );

alter table at_invoice_items
add CONSTRAINT at_invoice_items_invoice_code_fk FOREIGN KEY ( invoice_number )
REFERENCES at_invoice( code );

----------------------------------
