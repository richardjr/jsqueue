require('shelljs/global');

exec('./node_modules/.bin/jsdoc js/* --destination jsqueue');

exec('sudo rm -rf /var/www/docs/jsdocs/jsqueue/');

exec('sudo mv jsqueue /var/www/docs/jsdocs/');