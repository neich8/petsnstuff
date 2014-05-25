garlicbread
===========

To create mongo database:

cd into petsnstuff

mkdir data

cd into data

type 'pwd' to get directory root path

type mongod --dbpath (root path)

open a new terminal in the data directory

type
mongoimport --db petsnstuff --type csv --headerline --file ../public/csv/ingredients.csv

then

--db petsnstuff --type csv --headerline --file ../public/csv/nutritions.csv

to import sample db

