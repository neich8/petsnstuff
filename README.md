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

mongoimport -d petsnstuff -c nutritions  --type csv --file  ../public/csv/nutritions.csv --headerline

to import sample db

