import { ConfigParams } from 'pip-services3-commons-node';

import { DevicesMemoryPersistence } from '../../src/persistence/DevicesMemoryPersistence';
import { DevicesPersistenceFixture } from './DevicesPersistenceFixture';

suite('DevicesMemoryPersistence', ()=> {
    let persistence: DevicesMemoryPersistence;
    let fixture: DevicesPersistenceFixture;
    
    setup((done) => {
        persistence = new DevicesMemoryPersistence();
        persistence.configure(new ConfigParams());
        
        fixture = new DevicesPersistenceFixture(persistence);
        
        persistence.open(null, done);
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