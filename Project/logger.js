const EventEmitter = require('events');
const uuid = require('uuid');

class Logger extends EventEmitter{
	log(msg){
		//Call event
		this.emit('message', {id:uuid.v4(), msg});
	}
}

module.exports = Logger;
//логирование сайта. Сохранение истории работы приложения. Сохраняет
// всё не только в консольку, но и в дополнительную папку.