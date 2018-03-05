begin;

create table persons (
    id_person   serial primary key,
    name        text not null,
    last_name   text not null,
    oib         char (11) constraint oibchk check (oib is null or char_length(oib) = 11),
    age         integer
);


end;