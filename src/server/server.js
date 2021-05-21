import App from './app';
import config from './config/config';

App.app.listen(config.port, () => console.log('O servidor está rodando na porta: ' + config.port));

process.once('SIGUSR2', () => App.closeDataBaseConnection('Nodemon restart', ()=> process.kill(process.pid, 'SIGUSR2')));
process.on('SIGINT', () => App.closeDataBaseConnection('A execução foi interrompida', ()=> process.exit(0)));