
var Matrix = require('rpi-matrix');
var GifAnimation = require('../src/gif-animation.js');

class MatrixDefaults {

	constructor() {

	}



};

function convertMatrixConfiguration(config) {

	var options = {...config};

	function toInt(name) {
		if (options[name] != undefined) {
			options[name] = parseInt(options[name]);
		}
	}	

	toInt('led-rows');
	toInt('led-cols');
	toInt('led-row-addr-type');
	toInt('led-chain');
	toInt('led-parallel');
	toInt('led-multiplexing');	
	
	return options;
}

function getDefaultMatrixConfiguration() {

	var params = ['led-rows', 'led-cols'];
	var config = {};

	params.forEach((param) => {
		var name = param;
		
		name = name.toUpperCase();
		name = name.replace('-', '_');

		var value = process.env[name];

		if (value != undefined) {
			config[param] = value;
		}
	});

	return config;
}

class Command {

    constructor() {
        module.exports.command  = 'animate [options]';
        module.exports.describe = 'Animate gifs';
        module.exports.builder  = this.defineArgs;
        module.exports.handler  = this.run;
        
    }

    defineArgs(args) {

		args.usage('Usage: $0 animate [options]');

		args.option('help', {describe:'Displays this information'});
		args.option('gif',  {describe:'Specifies name of GIF', default:'pacman'});
		args.option('duration', {describe:'Animate for a specified time (ms)'});
		args.option('iterations', {describe:'Number of iterations to animate'});

		args.wrap(null);

		args.check(function(argv) {
			return true;
		});

		return args.argv;
	}


	run(argv) {

		try {

		
			var config = {...getDefaultMatrixConfiguration(), ...argv};

			Matrix.configure(convertMatrixConfiguration(config));


			console.log('argv', argv);
			var sample = new GifAnimation(argv);
			sample.run();
		}
		catch (error) {
			console.error(error.stack);
		}

    }
    


};

new Command();



