create table at_customer
(
code integer primary key,
name char(150) not null unique
);

-----Create a sequence------------
CREATE SEQUENCE at_customer_code_seq START WITH 1 NOCACHE ORDER;


CREATE OR REPLACE TRIGGER at_customer_code_trg BEFORE
    INSERT ON at_customer
    FOR EACH ROW
    WHEN ( new.code IS NULL )
BEGIN
    :new.code := at_customer_code_seq.nextval;
END;
/

----------------------------------

create data layer code for (entities.js) Customer and CustomerManager (managers.js),
in CustomerManager create all CRUD methods

In server/Accounting.js map a function to url '/addCustomer'
						     '/updateCustomer'
						     '/removeCustomer'
						     'getCustomerByCode'
						     'getCustomers'
