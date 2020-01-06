import { ConfigParams } from 'pip-services3-commons-node';

import { DevicesFilePersistence } from '../../src/persistence/DevicesFilePersistence';
import { DevicesPersistenceFixture } from './DevicesPersistenceFixture';

suite('DevicesFilePersistence', ()=> {
    let persistence: DevicesFilePersistence;
    let fixture: DevicesPersistenceFixture;
    
    setup((done) => {
        persistence = new DevicesFilePersistence('./data/devices.test.json');

        fixture = new DevicesPersistenceFixture(persistence);

        persistence.open(null, (err) => {
            persistence.clear(null, done);
        });
    });
    
    teardown((done) => {
        persistence.close(null, done);
    });
        
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

    test('Get with Filters', (done) => {
        fixture.testGetWithFilter(done);
    });

});