let DevicesProcess = require('../obj/src/container/DevicesProcess').DevicesProcess;

try {
    new DevicesProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}
